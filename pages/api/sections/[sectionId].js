import { db } from '@/lib/db';
import serverAuth from '@/lib/serverAuth';

export default async function handler(req, res) {
  if (req.method !== 'PATCH' && req.method !== 'DELETE') {
    return res.status(405).end();
  }

  const { sectionId } = req.query;

  try {
    if (req.method === 'PATCH') {
      const { currentUser } = await serverAuth(req, res);
      const { name, visible } = req.body;

      const section = await db.section.update({
        where: {
          id: sectionId,
          userId: currentUser.id,
        },
        data: {
          ...(name !== undefined && { name }),
          ...(visible !== undefined && { visible }),
        },
      });

      return res.status(200).json(section);
    }

    if (req.method === 'DELETE') {
      const { currentUser } = await serverAuth(req, res);

      // Move all links in this section to no section (sectionId = null)
      await db.link.updateMany({
        where: {
          sectionId: sectionId,
          userId: currentUser.id,
        },
        data: {
          sectionId: null,
        },
      });

      // Delete the section
      await db.section.delete({
        where: {
          id: sectionId,
          userId: currentUser.id,
        },
      });

      return res.status(200).json({ msg: 'section deleted' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}
