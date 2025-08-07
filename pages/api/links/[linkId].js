import { db } from '@/lib/db';

export default async function handler(req, res) {
  try {
    const { linkId } = req.query;

    if (!linkId || typeof linkId !== 'string') {
      throw new Error('Invalid ID');
    }

    if (req.method === 'PATCH') {
      const {
        newTitle,
        newUrl,
        archived,
        sectionId,
        newShowFavicon,
        newIsSocial,
      } = req.body;

      // Enhanced logging for debugging
      console.log('PATCH request body:', req.body);
      console.log(
        'showFavicon value received:',
        newShowFavicon,
        'type:',
        typeof newShowFavicon
      );

      const updatedLink = await db.link.update({
        where: {
          id: linkId,
        },
        data: {
          ...(newTitle !== undefined && { title: newTitle }),
          ...(newUrl !== undefined && { url: newUrl }),
          ...(archived !== undefined && { archived }),
          ...(sectionId !== undefined && { sectionId }),
          // Ensure explicit boolean conversion
          ...(newShowFavicon !== undefined && {
            showFavicon: newShowFavicon === true,
          }),
          ...(newIsSocial !== undefined && { isSocial: newIsSocial === true }),
        },
      });

      console.log('Updated link:', updatedLink);
      return res.status(200).json(updatedLink);
    } else if (req.method === 'DELETE') {
      await db.link.delete({
        where: {
          id: linkId,
        },
      });

      return res.status(204).end();
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
