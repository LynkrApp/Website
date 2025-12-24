import { db } from '@/lib/db';
import serverAuth from '@/lib/serverAuth';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (
    req.method !== 'POST' &&
    req.method !== 'GET' &&
    req.method !== 'PUT' &&
    req.method !== 'DELETE'
  ) {
    return res.status(405).end();
  }

  try {
    if (req.method === 'POST') {
      const { currentUser } = await serverAuth(req, res);
      const { name, order } = req.body;

      const section = await db.section.create({
        data: {
          name,
          order: order || 0,
          userId: currentUser.id,
        },
      });

      return res.status(200).json(section);
    }

    if (req.method === 'GET') {
      const { userId } = req.query;

      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: 'Missing userId' });
      }

      const sections = await db.section.findMany({
        where: {
          userId,
        },
        include: {
          links: {
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      });

      return res.status(200).json(sections);
    }

    if (req.method === 'PUT') {
      const { currentUser } = await serverAuth(req, res);
      const { sections } = req.body;

      if (!Array.isArray(sections)) {
        return res.status(400).json({ message: 'Invalid sections array' });
      }

      // Verify ownership
      const sectionIds = sections.map((s: any) => s.id);
      const userSections = await db.section.findMany({
        where: {
          id: { in: sectionIds },
          userId: currentUser.id,
        },
        select: { id: true },
      });

      if (userSections.length !== sections.length) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      await db.$transaction(
        sections.map(({ id }: { id: string }, index: number) =>
          db.section.update({
            where: {
              id,
            },
            data: {
              order: index,
            },
          })
        )
      );
      return res.status(200).json({ message: 'Section order updated' });
    }

    if (req.method === 'DELETE') {
      const { currentUser } = await serverAuth(req, res);
      const { sectionId } = req.query;

      if (!sectionId || typeof sectionId !== 'string') {
        return res.status(400).json({ message: 'Missing sectionId' });
      }

      // Verify ownership before deleting
      const section = await db.section.findUnique({
        where: {
          id: sectionId,
        },
      });

      if (!section) {
        return res.status(404).json({ message: 'Section not found' });
      }

      if (section.userId !== currentUser.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      // Perform deletion and link update in transaction
      await db.$transaction([
        db.link.updateMany({
          where: {
            sectionId: sectionId,
            userId: currentUser.id,
          },
          data: {
            sectionId: null,
          },
        }),
        db.section.delete({
          where: {
            id: sectionId,
          },
        }),
      ]);

      return res.status(200).json({ message: 'Section deleted' });
    }
  } catch (error: any) {
    console.error('SECTIONS_API_ERROR:', error);
    return res.status(error.message === 'Not signed in' ? 401 : 500).json({
      message: error.message || 'Internal server error',
    });
  }
}
