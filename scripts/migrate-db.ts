/*
 * MongoDB → MySQL data migration utility
 * Usage: bun run scripts/migrate-db.ts
 * Requires: process.env.MONGODB_URL and process.env.DATABASE_URL
 */

import { PrismaClient, Prisma } from '@prisma/client';
import { MongoClient, ObjectId } from 'mongodb';
import { spawnSync } from 'node:child_process';

type AnyDoc = Record<string, any>;

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
    const db = mongo.db();

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

    // 1) Users
    const usersCol = await getCollection(['User', 'users', 'user']);
    const users = await usersCol.find({}).toArray();
    console.log(`Migrating Users: ${users.length}`);
    for (const raw of users) {
      const d = normalizeIds(raw, []);
      const create: Prisma.UserUncheckedCreateInput = {
        id: d.id ?? toStringId(d._id)!,
        name: d.name ?? null,
        handle: d.handle ?? null,
        bio: d.bio ?? null,
        image: d.image ?? null,
        email: d.email ?? null,
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
      } as any;
      const update: Prisma.UserUncheckedUpdateInput = {
        name: create.name,
        handle: create.handle,
        bio: create.bio,
        image: create.image,
        email: create.email,
        emailVerified: create.emailVerified ?? null,
        totalViews: create.totalViews,
        updatedAt: new Date(),
        linksLocation: create.linksLocation,
        themePalette: create.themePalette as any,
        buttonStyle: create.buttonStyle,
        typographyTheme: create.typographyTheme as any,
        layoutTheme: create.layoutTheme as any,
        buttonStyleTheme: create.buttonStyleTheme as any,
        ogStyles: create.ogStyles as any,
      };
      await prisma.user.upsert({ where: { id: create.id }, create, update });
    }

    // 2) Sections
    const sectionsCol = await getCollection(['Section', 'sections', 'section']);
    const sections = await sectionsCol.find({}).toArray();
    console.log(`Migrating Sections: ${sections.length}`);
    for (const raw of sections) {
      const d = normalizeIds(raw, ['userId']);
      const create: Prisma.SectionUncheckedCreateInput = {
        id: d.id ?? toStringId(d._id)!,
        name: d.name ?? 'Untitled',
        order: toInt(d.order) ?? 0,
        visible: d.visible !== undefined ? !!d.visible : true,
        createdAt: toDate(d.createdAt) ?? new Date(),
        updatedAt: toDate(d.updatedAt) ?? new Date(),
        userId: String(d.userId),
      };
      const update: Prisma.SectionUncheckedUpdateInput = {
        name: create.name,
        order: create.order,
        visible: create.visible,
        updatedAt: new Date(),
        userId: create.userId,
      };
      await prisma.section.upsert({ where: { id: create.id }, create, update });
    }

    // 3) Accounts
    const accountsCol = await getCollection(['Account', 'accounts', 'account']);
    const accounts = await accountsCol.find({}).toArray();
    console.log(`Migrating Accounts: ${accounts.length}`);
    for (const raw of accounts) {
      const d = normalizeIds(raw, ['userId']);
      const create: Prisma.AccountUncheckedCreateInput = {
        id: d.id ?? toStringId(d._id)!,
        userId: String(d.userId),
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
      const update: Prisma.AccountUncheckedUpdateInput = { ...create } as any;
      delete (update as any).id;
      await prisma.account.upsert({ where: { id: create.id }, create, update });
    }

    // 4) Links
    const linksCol = await getCollection(['Link', 'links', 'link']);
    const links = await linksCol.find({}).toArray();
    console.log(`Migrating Links: ${links.length}`);
    for (const raw of links) {
      const d = normalizeIds(raw, ['userId', 'sectionId']);
      const create: Prisma.LinkUncheckedCreateInput = {
        id: d.id ?? toStringId(d._id)!,
        title: d.title ?? 'Untitled',
        url: d.url ?? '',
        archived: d.archived !== undefined ? !!d.archived : false,
        order: toInt(d.order) ?? 0,
        isSocial: d.isSocial !== undefined ? !!d.isSocial : false,
        showFavicon: d.showFavicon !== undefined ? !!d.showFavicon : true,
        clicks: toInt(d.clicks) ?? 0,
        createdAt: toDate(d.createdAt) ?? new Date(),
        updatedAt: toDate(d.updatedAt) ?? new Date(),
        userId: String(d.userId),
        sectionId: d.sectionId ? String(d.sectionId) : null,
      };
      const update: Prisma.LinkUncheckedUpdateInput = {
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
      await prisma.link.upsert({ where: { id: create.id }, create, update });
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
      const d = normalizeIds(raw, ['userId']);
      const create: Prisma.LinkingTokenUncheckedCreateInput = {
        id: d.id ?? toStringId(d._id)!,
        token: d.token ?? '',
        userId: String(d.userId),
        provider: d.provider ?? '',
        expiresAt: toDate(d.expiresAt) ?? new Date(),
        createdAt: toDate(d.createdAt) ?? new Date(),
      };
      const update: Prisma.LinkingTokenUncheckedUpdateInput = {
        token: create.token,
        userId: create.userId,
        provider: create.provider,
        expiresAt: create.expiresAt,
        createdAt: create.createdAt,
      };
      await prisma.linkingToken.upsert({ where: { id: create.id }, create, update });
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
      const d = normalizeIds(raw, ['userId']);
      const create: Prisma.PageViewUncheckedCreateInput = {
        id: d.id ?? toStringId(d._id)!,
        userId: String(d.userId),
        timestamp: toDate(d.timestamp) ?? new Date(),
        referer: d.referer ?? null,
        userAgent: d.userAgent ?? null,
        ipAddress: d.ipAddress ?? null,
        country: d.country ?? null,
        device: d.device ?? null,
      };
      const update: Prisma.PageViewUncheckedUpdateInput = { ...create } as any;
      delete (update as any).id;
      await prisma.pageView.upsert({ where: { id: create.id }, create, update });
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
      const d = normalizeIds(raw, ['linkId']);
      const create: Prisma.LinkClickUncheckedCreateInput = {
        id: d.id ?? toStringId(d._id)!,
        linkId: String(d.linkId),
        timestamp: toDate(d.timestamp) ?? new Date(),
        referer: d.referer ?? null,
        userAgent: d.userAgent ?? null,
        ipAddress: d.ipAddress ?? null,
        country: d.country ?? null,
        device: d.device ?? null,
      };
      const update: Prisma.LinkClickUncheckedUpdateInput = { ...create } as any;
      delete (update as any).id;
      await prisma.linkClick.upsert({ where: { id: create.id }, create, update });
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
