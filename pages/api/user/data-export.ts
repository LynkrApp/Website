import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { db } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Fetch all user data including related data
    const userData = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        links: {
          orderBy: {
            order: 'asc',
          },
        },
        sections: {
          include: {
            links: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        accounts: {
          select: {
            provider: true,
            type: true,
            id: true,
          },
        },
      },
    });

    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Structure the export data
    const exportData = {
      exportInfo: {
        exportedAt: new Date().toISOString(),
        dataVersion: '1.0',
        exportType: 'full_account_data',
      },
      profile: {
        id: userData.id,
        name: userData.name,
        handle: userData.handle,
        bio: userData.bio,
        email: userData.email,
        image: userData.image,
        totalViews: userData.totalViews,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
      customization: {
        themePalette: userData.themePalette,
        buttonStyle: userData.buttonStyle,
        typographyTheme: userData.typographyTheme,
        layoutTheme: userData.layoutTheme,
        buttonStyleTheme: userData.buttonStyleTheme,
        linksLocation: userData.linksLocation,
      },
      links: userData.links.map(link => ({
        id: link.id,
        title: link.title,
        url: link.url,
        archived: link.archived,
        order: link.order,
        isSocial: link.isSocial,
        clicks: link.clicks,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt,
        sectionId: link.sectionId,
      })),
      sections: userData.sections.map(section => ({
        id: section.id,
        name: section.name,
        order: section.order,
        visible: section.visible,
        createdAt: section.createdAt,
        updatedAt: section.updatedAt,
        linksCount: section.links.length,
      })),
      linkedAccounts: userData.accounts.map(account => ({
        id: account.id,
        provider: account.provider,
        type: account.type,
      })),
      statistics: {
        totalLinks: userData.links.length,
        activeLinks: userData.links.filter(link => !link.archived).length,
        archivedLinks: userData.links.filter(link => link.archived).length,
        socialLinks: userData.links.filter(link => link.isSocial).length,
        totalClicks: userData.links.reduce((sum, link) => sum + link.clicks, 0),
        totalSections: userData.sections.length,
        linkedAccountsCount: userData.accounts.length,
      },
    };

    // Set headers for file download
    const filename = `lynkr-data-export-${userData.handle || 'user'}-${new Date().toISOString().split('T')[0]}.json`;

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    return res.status(200).json(exportData);
  } catch (error) {
    console.error('Error exporting user data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
