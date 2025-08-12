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
          isSocial: isSocial === true, // Ensure boolean conversion
          isNSFWLink: isNSFW === true,
          showFavicon: showFavicon !== undefined ? Boolean(showFavicon) : true, // Ensure proper boolean conversion with default
          ...(sectionId && { sectionId }),
        },
      });

      return res.status(200).json(link);
    }

    if (req.method === 'GET') {
      const { userId } = req.query as { userId?: string };

      let links;

      if (userId && typeof userId === 'string') {
        links = await db.link.findMany({
          where: {
            userId,
          },
          include: {
            user: true,
            section: true,
          },
          orderBy: {
            // createdAt: "desc",
            order: 'asc',
          },
        });
      }

      return res.status(200).json(links);
    }

    if (req.method === 'PUT') {
      const { links } = req.body;
      console.log('links', links);

      await Promise.all(
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
      res.status(200).json({ msg: 'link order updated' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}
