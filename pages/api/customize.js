import { db } from '@/lib/db';
import serverAuth from '@/lib/serverAuth';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).end();
  }

  try {
    const { currentUser } = await serverAuth(req, res);
    const { 
      buttonStyle, 
      themePalette, 
      typographyTheme, 
      layoutTheme, 
      buttonStyleTheme 
    } = req.body;

    const updateData = {};
    
    if (buttonStyle !== undefined) updateData.buttonStyle = buttonStyle;
    if (themePalette !== undefined) updateData.themePalette = themePalette;
    if (typographyTheme !== undefined) updateData.typographyTheme = typographyTheme;
    if (layoutTheme !== undefined) updateData.layoutTheme = layoutTheme;
    if (buttonStyleTheme !== undefined) updateData.buttonStyleTheme = buttonStyleTheme;

    const updatedCustomizations = await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: updateData,
    });

    return res.status(200).json(updatedCustomizations);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
