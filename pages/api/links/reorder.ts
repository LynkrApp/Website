import { db } from '@/lib/db';
import serverAuth from '@/lib/serverAuth';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).end();
  }

  try {
    const { currentUser } = await serverAuth(req, res);
    const { links } = req.body;

    if (!Array.isArray(links)) {
      return res.status(400).json({ message: 'Invalid links array' });
    }

    // Verify ownership of all links before performing any updates
    const linkIds = links.map((l: any) => l.id);
    const userLinks = await db.link.findMany({
      where: {
        id: { in: linkIds },
        userId: currentUser.id,
      },
      select: { id: true },
    });

    if (userLinks.length !== links.length) {
      return res.status(403).json({ message: 'Unauthorized to modify some links' });
    }

    // Update link orders in database atomically using a transaction
    const updates = links.map((link: any) =>
      db.link.update({
        where: {
          id: link.id,
        },
        data: {
          order: link.order,
          sectionId: link.sectionId || null,
        },
      })
    );

    await db.$transaction(updates);

    return res.status(200).json({ message: 'Link order updated successfully' });
  } catch (error: any) {
    console.error('REORDER_LINKS_ERROR:', error);
    return res.status(error.message === 'Not signed in' ? 401 : 500).json({
      message: error.message || 'Failed to reorder links',
    });
  }
}
