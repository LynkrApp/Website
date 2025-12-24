import { db } from '@/lib/db';
import serverAuth from '@/lib/serverAuth';

export default async function handler(req, res) {
  try {
    const { currentUser } = await serverAuth(req, res);
    const { linkId } = req.query;

    if (!linkId || typeof linkId !== 'string') {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    // Verify ownership
    const link = await db.link.findUnique({
      where: {
        id: linkId,
      },
    });

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    if (link.userId !== currentUser.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (req.method === 'PATCH') {
      const {
        newTitle,
        newUrl,
        archived,
        sectionId,
        newShowFavicon,
        newIsSocial,
        newIsNSFW,
      } = req.body;

      const updatedLink = await db.link.update({
        where: {
          id: linkId,
        },
        data: {
          ...(newTitle !== undefined && { title: newTitle }),
          ...(newUrl !== undefined && { url: newUrl }),
          ...(archived !== undefined && { archived }),
          ...(sectionId !== undefined && { sectionId }),
          ...(newShowFavicon !== undefined && {
            showFavicon: Boolean(newShowFavicon),
          }),
          ...(newIsSocial !== undefined && { isSocial: Boolean(newIsSocial) }),
          ...(newIsNSFW !== undefined && { isNSFWLink: Boolean(newIsNSFW) }),
        },
      });

      return res.status(200).json(updatedLink);
    } else if (req.method === 'DELETE') {
      await db.link.delete({
        where: {
          id: linkId,
        },
      });

      return res.status(204).end();
    }

    return res.status(405).end();
  } catch (error: any) {
    console.error('LINK_ID_ERROR:', error);
    return res.status(error.message === 'Not signed in' ? 401 : 400).json({
      message: error.message || 'Error processing request',
    });
  }
}
