import { db } from '@/lib/db';
import serverAuth from '@/lib/serverAuth';

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET' && req.method !== 'PUT' && req.method !== 'DELETE') {
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

      let sections;

      if (userId && typeof userId === 'string') {
        sections = await db.section.findMany({
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
      }

      return res.status(200).json(sections);
    }

    if (req.method === 'PUT') {
      const { sections } = req.body;

      await Promise.all(
        sections.map(({ id }, index) =>
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
      res.status(200).json({ msg: 'section order updated' });
    }

    if (req.method === 'DELETE') {
      const { currentUser } = await serverAuth(req, res);
      const { sectionId } = req.query;

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
