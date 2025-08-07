import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { db } from '@/lib/db'; // Change from prisma to db

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { sections } = req.body;

    if (!sections || !Array.isArray(sections)) {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    // Verify user owns all sections
    const userSections = await db.section.findMany({
      // Change from prisma to db
      where: {
        userId: session.user.id,
        id: { in: sections.map((s) => s.id) },
      },
    });

    if (userSections.length !== sections.length) {
      return res
        .status(403)
        .json({ message: 'Unauthorized to modify some sections' });
    }

    // Update all sections in a transaction
    const updates = sections.map((section) =>
      db.section.update({
        // Change from prisma to db
        where: { id: section.id },
        data: { order: section.order },
      })
    );

    await db.$transaction(updates); // Change from prisma to db

    return res.status(200).json({ message: 'Sections reordered successfully' });
  } catch (error) {
    console.error('Error reordering sections:', error);
    return res.status(500).json({ message: 'Failed to reorder sections' });
  }
}
