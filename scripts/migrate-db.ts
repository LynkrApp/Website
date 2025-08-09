/*
 * MongoDB → MySQL data migration utility
 * Usage: bun run scripts/migrate-db.ts
 * Requires: process.env.MONGODB_URL and process.env.DATABASE_URL
 */

import { PrismaClient, Prisma } from '@prisma/client';
import { MongoClient, ObjectId } from 'mongodb';
import { spawnSync } from 'node:child_process';

type AnyDoc = Record<string, any>;

function extractDbNameFromUri(uri: string | undefined): string | undefined {
  if (!uri) return undefined;
  try {
    // Matches mongodb://host/dbname or mongodb+srv://host/dbname
    const match = uri.match(/^mongodb(?:\+srv)?:\/\/[^/]+\/(.+?)(?:\?|$)/i);
    if (match && match[1]) {
      const dbFromPath = decodeURIComponent(match[1]);
      return dbFromPath;
    }
  } catch {
    // ignore parse errors
  }
  return undefined;
}

function toStringId(value: any): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (value instanceof ObjectId) return value.toHexString();
  // Fallback for unexpected types
  try {
    return String(value);
  } catch {
    return null;
  }
}

function normalizeIds<T extends AnyDoc>(doc: T, idFields: string[]): T {
  const copy: AnyDoc = { ...doc };
  // Map Mongo _id → id if present
  if (copy._id && !copy.id) {
    copy.id = toStringId(copy._id);
    delete copy._id;
  }
  // Convert relation ObjectIds to strings
  for (const field of idFields) {
    if (field in copy) {
      const asString = toStringId(copy[field]);
      if (asString !== null) copy[field] = asString;
    }
  }
  return copy as T;
}

function toDate(value: any): Date | undefined {
  if (!value) return undefined;
  const d = value instanceof Date ? value : new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

function toInt(value: any): number | undefined {
  if (value === undefined || value === null) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : undefined;
}

function toBool(value: any): boolean | undefined {
  if (value === undefined || value === null) return undefined;
  return Boolean(value);
}

async function makeUniqueHandle(
  prisma: PrismaClient,
  desiredHandle: string | null | undefined,
  legacyId: string,
  selfId?: string
): Promise<string | null> {
  if (!desiredHandle) return null;
  let base = String(desiredHandle);
  // Avoid whitespace-only
  base = base.trim();
  if (!base) return null;

  // First try exact handle
  const found = await prisma.user.findUnique({ where: { handle: base } });
  if (!found || (selfId && found.id === selfId)) return base;

  const suffix = legacyId.slice(-6);
  let candidate = `${base}-${suffix}`;
  let attempt = 1;
  // Loop until unique or matches self
  // In practice this should converge quickly
  while (true) {
    const f = await prisma.user.findUnique({ where: { handle: candidate } });
    if (!f || (selfId && f.id === selfId)) return candidate;
    attempt += 1;
    candidate = `${base}-${suffix}-${attempt}`;
  }
}

async function makeUniqueEmail(
  prisma: PrismaClient,
  desiredEmail: string | null | undefined,
  selfId?: string
): Promise<string | null> {
  if (!desiredEmail) return null;
  const email = String(desiredEmail).trim();
  if (!email) return null;
  const found = await prisma.user.findUnique({ where: { email } });
  if (!found || (selfId && found.id === selfId)) return email;
  // Conflict: return null to satisfy unique constraint without fabricating emails
  return null;
}

async function pushPrismaSchema(): Promise<void> {
  const commands = [
    ['bunx', ['prisma', 'db', 'push', '--skip-generate']],
    ['npx', ['prisma', 'db', 'push', '--skip-generate']],
  ] as const;

  for (const [cmd, args] of commands) {
    const res = spawnSync(cmd, args, { stdio: 'inherit', shell: true });
    if (res.status === 0) return;
  }
  console.warn(
    'Could not automatically push Prisma schema. Please run: prisma db push'
  );
}

async function main() {
  const mongoUrl = process.env.MONGODB_URL;
  const mysqlUrl = process.env.DATABASE_URL;

  if (!mysqlUrl) {
    console.error('DATABASE_URL is not set. Aborting.');
    process.exit(1);
  }
  if (!mongoUrl) {
    console.error('MONGODB_URL is not set. Aborting.');
    process.exit(1);
  }

  console.log('Ensuring MySQL schema is up to date (prisma db push)...');
  await pushPrismaSchema();

  const prisma = new PrismaClient();
  const mongo = new MongoClient(mongoUrl);

  try {
    console.log('Connecting to MongoDB...');
    await mongo.connect();
    // Resolve correct database (the screenshot shows a DB named "linkcord")
    const candidateDbNames: string[] = Array.from(
      new Set(
        [
          process.env.MONGODB_DB,
          process.env.MONGODB_DATABASE,
          process.env.MONGO_DB,
          process.env.DB_NAME,
          extractDbNameFromUri(mongoUrl),
          'linkcord', // common legacy name used by this project
        ].filter(Boolean) as string[]
      )
    );

    let db = mongo.db();
    // Try to pick an existing DB by name if visible
    try {
      const admin = mongo.db().admin();
      const dbList = (await admin.listDatabases()) as any;
      const existing = new Set<string>(
        (dbList?.databases || []).map((d: any) => String(d.name))
      );
      for (const name of candidateDbNames) {
        if (existing.has(name)) {
          db = mongo.db(name);
          break;
        }
      }
    } catch {
      // If we cannot list databases (limited permissions), probe candidates by listing collections
      for (const name of candidateDbNames) {
        try {
          const probe = mongo.db(name);
          const cols = await probe.listCollections().toArray();
          if (cols.length > 0) {
            db = probe;
            break;
          }
        } catch {
          // ignore and continue probing
        }
      }
    }

    console.log(`Using MongoDB database: ${db.databaseName}`);
    try {
      const existingCollections = await db.listCollections().toArray();
      console.log(
        `Found collections: ${
          existingCollections.map((c) => c.name).join(', ') || '(none)'
        }`
      );
    } catch {
      // ignore listing errors
    }

    // Helper to get a collection by common variants of model names
    const getCollection = async (candidates: string[]) => {
      const existing = await db.listCollections().toArray();
      const names = new Set(existing.map((c) => c.name));
      for (const name of candidates) {
        if (names.has(name)) return db.collection(name);
      }
      // Fallback: return first candidate even if not present to avoid crashes (will just migrate 0 docs)
      return db.collection(candidates[0]);
    };

    // Build ID maps (legacy Mongo ObjectId hex -> new cuid)
    const userIdMap = new Map<string, string>();
    const sectionIdMap = new Map<string, string>();
    const linkIdMap = new Map<string, string>();

    // 1) Users (assign new cuid, store legacyObjectId)
    const usersCol = await getCollection(['User', 'users', 'user']);
    const users = await usersCol.find({}).toArray();
    console.log(`Migrating Users: ${users.length}`);
    for (const raw of users) {
      const legacyId = toStringId((raw as AnyDoc)._id)!;
      const d = normalizeIds(raw, []);
      const existing = await (prisma.user as any).findUnique({
        where: { legacyObjectId: legacyId },
      });

      if (existing) {
        const handle = await makeUniqueHandle(
          prisma,
          d.handle ?? null,
          legacyId,
          existing.id
        );
        const email = await makeUniqueEmail(
          prisma,
          d.email ?? null,
          existing.id
        );
        const updated = await (prisma.user as any).update({
          where: { id: existing.id },
          data: {
            name: d.name ?? null,
            handle,
            bio: d.bio ?? null,
            image: d.image ?? null,
            email,
            emailVerified: toDate(d.emailVerified) ?? null,
            totalViews: toInt(d.totalViews) ?? existing.totalViews ?? 0,
            updatedAt: new Date(),
            linksLocation: d.linksLocation ?? existing.linksLocation ?? 'top',
            themePalette: d.themePalette ?? undefined,
            buttonStyle: d.buttonStyle ?? existing.buttonStyle ?? 'rounded-md',
            typographyTheme: d.typographyTheme ?? undefined,
            layoutTheme: d.layoutTheme ?? undefined,
            buttonStyleTheme: d.buttonStyleTheme ?? undefined,
            ogStyles: d.ogStyles ?? undefined,
          },
        });
        userIdMap.set(legacyId, updated.id);
      } else {
        const handle = await makeUniqueHandle(
          prisma,
          d.handle ?? null,
          legacyId
        );
        const email = await makeUniqueEmail(prisma, d.email ?? null);
        const created = await (prisma.user as any).create({
          data: {
            legacyObjectId: legacyId,
            name: d.name ?? null,
            handle,
            bio: d.bio ?? null,
            image: d.image ?? null,
            email,
            emailVerified: toDate(d.emailVerified),
            totalViews: toInt(d.totalViews) ?? 0,
            createdAt: toDate(d.createdAt) ?? new Date(),
            updatedAt: toDate(d.updatedAt) ?? new Date(),
            linksLocation: d.linksLocation ?? 'top',
            themePalette: d.themePalette ?? undefined,
            buttonStyle: d.buttonStyle ?? 'rounded-md',
            typographyTheme: d.typographyTheme ?? undefined,
            layoutTheme: d.layoutTheme ?? undefined,
            buttonStyleTheme: d.buttonStyleTheme ?? undefined,
            ogStyles: d.ogStyles ?? undefined,
          },
        });
        userIdMap.set(legacyId, created.id);
      }
    }

    // 2) Sections
    // Build helper maps to later infer ownership for Links
    const sectionLegacyToUserNewId = new Map<string, string>();
    const firstSectionByUserId = new Map<string, string>();
    const minOrderByUserId = new Map<string, number>();
    const sectionsCol = await getCollection(['Section', 'sections', 'section']);
    const sections = await sectionsCol.find({}).toArray();
    console.log(`Migrating Sections: ${sections.length}`);
    for (const raw of sections) {
      const legacyId = toStringId((raw as AnyDoc)._id)!;
      const d = normalizeIds(raw, ['userId']);
      const legacyUserId = d.userId ? String(d.userId) : undefined;
      const mappedUserId = legacyUserId
        ? userIdMap.get(legacyUserId)
        : undefined;
      if (!mappedUserId) {
        console.warn(
          `Skipping Section without resolvable userId (legacy _id: ${legacyId}, legacy userId: ${legacyUserId})`
        );
        continue;
      }
      const create: any = {
        legacyObjectId: legacyId,
        name: d.name ?? 'Untitled',
        order: toInt(d.order) ?? 0,
        visible: d.visible !== undefined ? !!d.visible : true,
        createdAt: toDate(d.createdAt) ?? new Date(),
        updatedAt: toDate(d.updatedAt) ?? new Date(),
        userId: mappedUserId,
      };
      const update: any = {
        name: create.name,
        order: create.order,
        visible: create.visible,
        updatedAt: new Date(),
        userId: create.userId,
      };
      const saved = await (prisma.section as any).upsert({
        where: { legacyObjectId: legacyId },
        create,
        update,
      });

      // Populate helper maps
      sectionIdMap.set(legacyId, saved.id);
      sectionLegacyToUserNewId.set(legacyId, saved.userId);
      const currentMin = minOrderByUserId.get(saved.userId);
      if (currentMin === undefined || (create.order ?? 0) < currentMin) {
        minOrderByUserId.set(saved.userId, create.order ?? 0);
        firstSectionByUserId.set(saved.userId, saved.id);
      }
    }

    // 3) Accounts
    const accountsCol = await getCollection(['Account', 'accounts', 'account']);
    const accounts = await accountsCol.find({}).toArray();
    console.log(`Migrating Accounts: ${accounts.length}`);
    for (const raw of accounts) {
      const legacyId = toStringId((raw as AnyDoc)._id)!;
      const d = normalizeIds(raw, ['userId']);
      const legacyUserId = d.userId ? String(d.userId) : undefined;
      const mappedUserId = legacyUserId
        ? userIdMap.get(legacyUserId)
        : undefined;
      if (!mappedUserId) {
        console.warn(
          `Skipping Account without resolvable userId (legacy _id: ${legacyId}, legacy userId: ${legacyUserId})`
        );
        continue;
      }
      const data: any = {
        legacyObjectId: legacyId,
        userId: mappedUserId,
        type: d.type ?? '',
        provider: d.provider ?? '',
        providerAccountId: d.providerAccountId ?? '',
        refresh_token: d.refresh_token ?? null,
        access_token: d.access_token ?? null,
        expires_at: d.expires_at ?? null,
        token_type: d.token_type ?? null,
        scope: d.scope ?? null,
        id_token: d.id_token ?? null,
        session_state: d.session_state ?? null,
        oauth_token_secret: d.oauth_token_secret ?? null,
        oauth_token: d.oauth_token ?? null,
      };

      const existingByCompound = await (prisma.account as any).findUnique({
        where: {
          provider_providerAccountId: {
            provider: data.provider,
            providerAccountId: data.providerAccountId,
          },
        } as any,
      });
      if (existingByCompound) {
        await (prisma.account as any).update({
          where: { id: existingByCompound.id },
          data: {
            ...data,
            legacyObjectId: existingByCompound.legacyObjectId ?? legacyId,
          },
        });
        continue;
      }

      const existingByLegacy = await (prisma.account as any).findUnique({
        where: { legacyObjectId: legacyId },
      });
      if (existingByLegacy) {
        await (prisma.account as any).update({
          where: { id: existingByLegacy.id },
          data,
        });
      } else {
        await (prisma.account as any).create({ data });
      }
      // no map needed for relations
    }

    // 4) Links
    const linksCol = await getCollection(['Link', 'links', 'link']);
    const links = await linksCol.find({}).toArray();
    console.log(`Migrating Links: ${links.length}`);
    for (const raw of links) {
      const legacyId = toStringId((raw as AnyDoc)._id)!;
      const d = normalizeIds(raw, ['userId', 'sectionId']);
      // Infer legacy userId if missing, using common alternative fields or via section ownership
      let inferredLegacyUserId: string | undefined = d.userId
        ? String(d.userId)
        : undefined;
      if (!inferredLegacyUserId) {
        const altUserIdFields = [
          'user',
          'ownerId',
          'owner',
          'uid',
          'user_id',
          'userID',
          'createdBy',
        ];
        for (const field of altUserIdFields) {
          if (raw && field in raw) {
            const asString = toStringId((raw as AnyDoc)[field]);
            if (asString) {
              inferredLegacyUserId = asString;
              break;
            }
          }
        }
      }
      // Resolve new user id
      const inferredLegacySectionId: string | null | undefined = d.sectionId
        ? String(d.sectionId)
        : undefined;
      let newUserId: string | undefined = undefined;
      if (inferredLegacyUserId) newUserId = userIdMap.get(inferredLegacyUserId);
      if (!newUserId && inferredLegacySectionId) {
        newUserId = sectionLegacyToUserNewId.get(
          String(inferredLegacySectionId)
        );
      }

      // Resolve new section id
      let newSectionId: string | null | undefined = undefined;
      if (inferredLegacySectionId) {
        newSectionId =
          sectionIdMap.get(String(inferredLegacySectionId)) ?? null;
      }
      if (!newSectionId && newUserId) {
        newSectionId = firstSectionByUserId.get(String(newUserId)) ?? null;
      }

      if (!newUserId) {
        console.warn(
          `Skipping Link without resolvable userId (legacy _id: ${legacyId})`
        );
        continue;
      }
      const create: any = {
        legacyObjectId: legacyId,
        title: d.title ?? 'Untitled',
        url: d.url ?? '',
        archived: d.archived !== undefined ? !!d.archived : false,
        order: toInt(d.order) ?? 0,
        isSocial: d.isSocial !== undefined ? !!d.isSocial : false,
        showFavicon: d.showFavicon !== undefined ? !!d.showFavicon : true,
        clicks: toInt(d.clicks) ?? 0,
        createdAt: toDate(d.createdAt) ?? new Date(),
        updatedAt: toDate(d.updatedAt) ?? new Date(),
        userId: String(newUserId),
        sectionId: newSectionId ? String(newSectionId) : null,
      };
      const update: any = {
        title: create.title,
        url: create.url,
        archived: create.archived,
        order: create.order,
        isSocial: create.isSocial,
        showFavicon: create.showFavicon,
        clicks: create.clicks,
        updatedAt: new Date(),
        userId: create.userId,
        sectionId: create.sectionId,
      };
      const saved = await (prisma.link as any).upsert({
        where: { legacyObjectId: legacyId },
        create,
        update,
      });
      linkIdMap.set(legacyId, saved.id);
    }

    // 5) LinkingTokens
    const linkingTokensCol = await getCollection([
      'LinkingToken',
      'linkingtokens',
      'linkingtoken',
    ]);
    const linkingTokens = await linkingTokensCol.find({}).toArray();
    console.log(`Migrating LinkingTokens: ${linkingTokens.length}`);
    for (const raw of linkingTokens) {
      const legacyId = toStringId((raw as AnyDoc)._id)!;
      const d = normalizeIds(raw, ['userId']);
      const legacyUserId = d.userId ? String(d.userId) : undefined;
      const mappedUserId = legacyUserId
        ? userIdMap.get(legacyUserId)
        : undefined;
      if (!mappedUserId) {
        console.warn(
          `Skipping LinkingToken without resolvable userId (legacy _id: ${legacyId}, legacy userId: ${legacyUserId})`
        );
        continue;
      }
      const create: any = {
        legacyObjectId: legacyId,
        token: d.token ?? '',
        userId: mappedUserId,
        provider: d.provider ?? '',
        expiresAt: toDate(d.expiresAt) ?? new Date(),
        createdAt: toDate(d.createdAt) ?? new Date(),
      };
      const update: any = {
        token: create.token,
        userId: create.userId,
        provider: create.provider,
        expiresAt: create.expiresAt,
        createdAt: create.createdAt,
      };
      await (prisma.linkingToken as any).upsert({
        where: { legacyObjectId: legacyId },
        create,
        update,
      });
    }

    // 6) PageViews
    const pageViewsCol = await getCollection([
      'PageView',
      'pageviews',
      'pageview',
    ]);
    const pageViews = await pageViewsCol.find({}).toArray();
    console.log(`Migrating PageViews: ${pageViews.length}`);
    for (const raw of pageViews) {
      const legacyId = toStringId((raw as AnyDoc)._id)!;
      const d = normalizeIds(raw, ['userId']);
      const legacyUserId = d.userId ? String(d.userId) : undefined;
      const mappedUserId = legacyUserId
        ? userIdMap.get(legacyUserId)
        : undefined;
      if (!mappedUserId) {
        console.warn(
          `Skipping PageView without resolvable userId (legacy _id: ${legacyId}, legacy userId: ${legacyUserId})`
        );
        continue;
      }
      const create: any = {
        legacyObjectId: legacyId,
        userId: mappedUserId,
        timestamp: toDate(d.timestamp) ?? new Date(),
        referer: d.referer ?? null,
        userAgent: d.userAgent ?? null,
        ipAddress: d.ipAddress ?? null,
        country: d.country ?? null,
        device: d.device ?? null,
      };
      const update: any = { ...create };
      delete (update as any).legacyObjectId;
      await (prisma.pageView as any).upsert({
        where: { legacyObjectId: legacyId },
        create,
        update,
      });
    }

    // 7) LinkClicks
    const linkClicksCol = await getCollection([
      'LinkClick',
      'linkclicks',
      'linkclick',
    ]);
    const linkClicks = await linkClicksCol.find({}).toArray();
    console.log(`Migrating LinkClicks: ${linkClicks.length}`);
    for (const raw of linkClicks) {
      const legacyId = toStringId((raw as AnyDoc)._id)!;
      const d = normalizeIds(raw, ['linkId']);
      const legacyLinkId = d.linkId ? String(d.linkId) : undefined;
      const mappedLinkId = legacyLinkId
        ? linkIdMap.get(legacyLinkId)
        : undefined;
      if (!mappedLinkId) {
        console.warn(
          `Skipping LinkClick without resolvable linkId (legacy _id: ${legacyId}, legacy linkId: ${legacyLinkId})`
        );
        continue;
      }
      const create: any = {
        legacyObjectId: legacyId,
        linkId: mappedLinkId,
        timestamp: toDate(d.timestamp) ?? new Date(),
        referer: d.referer ?? null,
        userAgent: d.userAgent ?? null,
        ipAddress: d.ipAddress ?? null,
        country: d.country ?? null,
        device: d.device ?? null,
      };
      const update: any = { ...create };
      delete (update as any).legacyObjectId;
      await (prisma.linkClick as any).upsert({
        where: { legacyObjectId: legacyId },
        create,
        update,
      });
    }

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exitCode = 1;
  } finally {
    await mongo.close();
    await prisma.$disconnect();
  }
}

// Run
main();
