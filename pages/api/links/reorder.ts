import { getSession } from 'next-auth/react';
import { db } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).end();
  }

  try {
    const session = await getSession({ req });

    if (!session?.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { links } = req.body;

    if (!Array.isArray(links)) {
      return res.status(400).json({ message: 'Invalid links array' });
    }

    // Update link orders in database
    await Promise.all(
      links.map((link) =>
        db.link.update({
          where: {
            id: link.id,
          },
          data: {
            order: link.order,
            sectionId: link.sectionId || null,
          },
        })
      )
    );

    return res.status(200).json({ message: 'Link order updated successfully' });
  } catch (error) {
    console.error('Error reordering links:', error);
    return res.status(500).json({ message: 'Failed to reorder links' });
  }
}
