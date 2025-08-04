import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const session = await getServerSession(req, res, authOptions);

        if (!session?.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { links } = req.body;

        if (!Array.isArray(links)) {
            return res.status(400).json({ message: 'Links must be an array' });
        }

        // Verify all links belong to the authenticated user
        const userLinks = await prisma.link.findMany({
            where: {
                userId: session.user.id,
                id: { in: links.map(link => link.id) }
            }
        });

        if (userLinks.length !== links.length) {
            return res.status(403).json({ message: 'Some links do not belong to you' });
        }

        // Update each link's order and sectionId in a transaction
        await prisma.$transaction(
            links.map((link) =>
                prisma.link.update({
                    where: { id: link.id },
                    data: {
                        order: link.order,
                        sectionId: link.sectionId || null
                    }
                })
            )
        );

        res.status(200).json({ message: 'Links reordered successfully' });
    } catch (error) {
        console.error('Error reordering links:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        await prisma.$disconnect();
    }
}
