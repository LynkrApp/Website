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

    // Fetch all user data for viewing (similar to export but formatted for UI)
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

    // Calculate statistics
    const totalClicks = userData.links.reduce((sum, link) => sum + link.clicks, 0);
    const activeLinks = userData.links.filter(link => !link.archived);
    const archivedLinks = userData.links.filter(link => link.archived);
    const socialLinks = userData.links.filter(link => link.isSocial);

    // Structure the data for viewing
    const viewData = {
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
        links: section.links.map(link => ({
          id: link.id,
          title: link.title,
          url: link.url,
          archived: link.archived,
          clicks: link.clicks,
        })),
      })),
      linkedAccounts: userData.accounts.map(account => ({
        id: account.id,
        provider: account.provider,
        type: account.type,
      })),
      statistics: {
        totalLinks: userData.links.length,
        activeLinks: activeLinks.length,
        archivedLinks: archivedLinks.length,
        socialLinks: socialLinks.length,
        totalClicks,
        totalSections: userData.sections.length,
        linkedAccountsCount: userData.accounts.length,
        averageClicksPerLink: userData.links.length > 0 ? Math.round(totalClicks / userData.links.length) : 0,
      },
    };

    return res.status(200).json(viewData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
