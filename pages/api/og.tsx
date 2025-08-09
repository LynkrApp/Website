/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from '@vercel/og';
import { getUserForOG } from '@/lib/db-edge';
import type { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

// Helper function to ensure text isn't too long
const truncateText = (text: string | null | undefined, maxLength: number) => {
  if (!text) return '';
  return text.length > maxLength
    ? text.substring(0, maxLength - 3) + '...'
    : text;
};

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    // Default styles that match the home page hero gradient
    const defaultStyles = {
      backgroundType: 'gradient',
      backgroundGradient:
        'linear-gradient(to bottom right, #0f172a, #1e293b, #376878)',
      textColor: 'white',
      accentColor: '#3b82f6',
      showAvatar: true,
      showStats: false,
      backgroundOpacity: 1,
    };

    // If username is provided, get user data using the edge-compatible function
    if (username) {
      const user = await getUserForOG(username);

      if (!user) {
        const response = new ImageResponse(
          (
            <div
              style={{
                display: 'flex',
                fontSize: 60,
                color: 'black',
                background: 'white',
                width: '100%',
                height: '100%',
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <span>User not found</span>
            </div>
          ),
          { width: 1200, height: 630 }
        );
        response.headers.set('Content-Type', 'image/png');
        response.headers.set('Cache-Control', 'public, max-age=86400');
        return response;
      }

      // Merge default styles with user custom OG styles
      const styles = user.ogStyles
        ? { ...defaultStyles, ...user.ogStyles }
        : defaultStyles;

      // If the user's theme has colors, use those for styling
      if (user.themePalette?.palette && !styles.backgroundGradient) {
        const themeColors = user.themePalette.palette;
        styles.backgroundGradient = `linear-gradient(to bottom right, ${themeColors[0]}, ${themeColors[1]}, ${themeColors[2]})`;
      }

      const name = truncateText(user.name || user.handle, 50);
      const bio = truncateText(user.bio, 150);
      const imageUrl = user.image || null;

      // Get counts for display in OG image
      const linkCount = user.links?.length || 0;

      // Use PageView count from _count aggregation instead of deprecated totalViews
      const viewCount = user._count?.pageViews || 0;

      // Calculate total clicks across all links
      const totalClicks =
        user.links?.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0;

      const response = new ImageResponse(
        (
          <div
            style={{
              display: 'flex',
              height: '100%',
              width: '100%',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                styles.backgroundType === 'gradient'
                  ? styles.backgroundGradient
                  : styles.backgroundColor,
              padding: '40px',
              position: 'relative', // Add position relative to parent
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '90%',
                textAlign: 'center',
              }}
            >
              {/* Avatar */}
              {styles.showAvatar && imageUrl && (
                <div
                  style={{
                    display: 'flex',
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    marginBottom: 24,
                    border: '4px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={name}
                    width={120}
                    height={120}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}

              {/* Username */}
              <div
                style={{
                  display: 'flex',
                  fontSize: 60,
                  fontWeight: 700,
                  color: styles.textColor || 'white',
                  lineHeight: 1.2,
                  marginBottom: 20,
                  textShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
                }}
              >
                {name}
              </div>

              {/* Bio */}
              {bio && (
                <div
                  style={{
                    display: 'flex',
                    fontSize: 28,
                    color: styles.textColor || 'white',
                    opacity: 0.9,
                    marginBottom: 32,
                    maxWidth: '80%',
                    textShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {bio}
                </div>
              )}

              {/* Stats - Always show stats in OG image regardless of styles.showStats setting */}
              {styles.showStats && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 24,
                    marginTop: 16,
                  }}
                >
                  {/* Link Count */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 16px',
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        fontSize: 24,
                        fontWeight: 600,
                        color: styles.textColor || 'white',
                      }}
                    >
                      {linkCount} Links
                    </div>
                  </div>

                  {/* View Count */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 16px',
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        fontSize: 24,
                        fontWeight: 600,
                        color: styles.textColor || 'white',
                      }}
                    >
                      {viewCount} Views
                    </div>
                  </div>

                  {/* Click Count */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 16px',
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        fontSize: 24,
                        fontWeight: 600,
                        color: styles.textColor || 'white',
                      }}
                    >
                      {totalClicks} Clicks
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Logo watermark - Repositioned to bottom right with actual logo */}
            <div
              style={{
                position: 'absolute',
                bottom: 40,
                right: 40,
                display: 'flex',
                alignItems: 'center',
                opacity: 0.85,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  marginRight: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="https://lynkr.link/logo.png"
                  alt="Lynkr Logo"
                  width={28}
                  height={28}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <span
                style={{
                  display: 'flex',
                  fontSize: 24,
                  fontWeight: 600,
                  color: styles.textColor || 'white',
                }}
              >
                lynkr.link/{user.handle}
              </span>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
      response.headers.set('Content-Type', 'image/png');
      response.headers.set('Cache-Control', 'public, max-age=86400');
      return response;
    }

    // Default OG image when no username is provided
    const response = new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            letterSpacing: '-.02em',
            fontWeight: 700,
            backgroundImage:
              'linear-gradient(to bottom right, #0f172a, #1e293b, #376878)',
          }}
        >
          <div
            style={{
              left: 42,
              top: 42,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                display: 'flex',
                width: 24,
                height: 24,
                background: 'white',
                borderRadius: 8,
              }}
            />
            <span
              style={{
                display: 'flex',
                marginLeft: 8,
                fontSize: 20,
                color: 'white',
              }}
            >
              Lynkr
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              padding: '20px 50px',
              margin: '0 42px',
              fontSize: 40,
              width: 'auto',
              maxWidth: 550,
              textAlign: 'center',
              color: 'white',
              lineHeight: 1.4,
            }}
          >
            <span>
              Create beautiful, organized link pages that drive engagement and
              grow your audience. Free, open source, and packed with powerful
              features.
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
    response.headers.set('Content-Type', 'image/png');
    response.headers.set('Cache-Control', 'public, max-age=86400');
    return response;
  } catch (error) {
    console.error('OG Error:', error);
    const response = new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            fontSize: 40,
            color: 'black',
            background: 'white',
            width: '100%',
            height: '100%',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <span>Error generating image</span>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
    response.headers.set('Content-Type', 'image/png');
    response.headers.set('Cache-Control', 'public, max-age=86400');
    return response;
  }
}
