import serverAuth from '@/lib/serverAuth';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  try {
    const { currentUser } = await serverAuth(req, res);

    // Sanitize response to prevent any accidental exposure
    const safeUser = {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      handle: currentUser.handle,
      image: currentUser.image,
      bio: currentUser.bio,
      createdAt: currentUser.createdAt,
      updatedAt: currentUser.updatedAt,
      accounts: currentUser.accounts.map((acc: any) => ({
        id: acc.id,
        provider: acc.provider,
        userRole: acc.userRole,
        isBanned: acc.isBanned,
      })),
    };

    res.status(200).json(safeUser);
    return;
  } catch (error) {
    // Use 401 for unauthenticated to avoid confusion
    res.status(401).end();
    return;
  }
}
