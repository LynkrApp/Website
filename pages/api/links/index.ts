import serverAuth from '@/lib/serverAuth';
import { db } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST' && req.method !== 'GET' && req.method !== 'PUT') {
    return res.status(405).end();
  }

  try {
    if (req.method === 'POST') {
      const { currentUser } = await serverAuth(req, res);
      const { title, url, order, isSocial, isNSFW, sectionId, showFavicon } = req.body;
      
      const link = await db.link.create({
        data: {
          title,
          url,
          order,
          userId: currentUser.id,
          isSocial: Boolean(isSocial),
          isNSFWLink: Boolean(isNSFW),
          showFavicon: showFavicon !== undefined ? Boolean(showFavicon) : true,
          ...(sectionId && { sectionId }),
        },
      });

      return res.status(200).json(link);
    }

    if (req.method === 'GET') {
      const { userId } = req.query as { userId?: string };

      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: 'Missing userId' });
      }

      const links = await db.link.findMany({
        where: {
          userId,
        },
        include: {
          section: true,
        },
        orderBy: {
          order: 'asc',
        },
      });

      return res.status(200).json(links);
    }

    if (req.method === 'PUT') {
      const { currentUser } = await serverAuth(req, res);
      const { links } = req.body;

      if (!Array.isArray(links)) {
        return res.status(400).json({ message: 'Invalid links array' });
      }

      // Verify ownership of all links
      const linkIds = links.map((l: any) => l.id);
      const userLinks = await db.link.findMany({
        where: {
          id: { in: linkIds },
          userId: currentUser.id,
        },
        select: { id: true },
      });

      if (userLinks.length !== links.length) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      await db.$transaction(
        links.map(({ id }: { id: string }, index: number) =>
          db.link.update({
            where: {
              id,
            },
            data: {
              order: index,
            },
          })
        )
      );
      return res.status(200).json({ message: 'Link order updated' });
    }
  } catch (error: any) {
    console.error('LINKS_API_ERROR:', error);
    return res.status(error.message === 'Not signed in' ? 401 : 500).json({
      message: error.message || 'Internal server error',
    });
  }
}
