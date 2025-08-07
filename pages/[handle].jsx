/* eslint-disable @next/next/no-img-element */
import LinkCard from '@/components/core/user-profile/links-card';
import * as Avatar from '@radix-ui/react-avatar';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import useUser from '@/hooks/useUser';
import Loader from '@/components/utils/loading-spinner';
import NotFound from '@/components/utils/not-found';
import useLinks from '@/hooks/useLinks';
import useSections from '@/hooks/useSections';
import Script from 'next/script';
import { SocialCards } from '@/components/core/user-profile/social-cards';
import Head from 'next/head';
import AnimatedBackground from '@/components/core/animated-backgrounds/animated-background';
import { ProfilePageMeta } from '@/components/meta/metadata';
import TabbedSections from '@/components/core/user-profile/tabbed-sections';

const ProfilePage = () => {
  const { query } = useRouter();
  const { handle } = query;

  const {
    data: fetchedUser,
    isLoading: isUserLoading,
    isFetching: isUserFetching,
  } = useUser(handle);

  const { data: userLinks, isFetching: isLinksFetching } = useLinks(
    fetchedUser?.id
  );

  const { data: sections, isFetching: isSectionsFetching } = useSections(
    fetchedUser?.id
  );

  const queryClient = useQueryClient();
  const [, setIsDataLoaded] = useState(false);

  const mutation = useMutation(
    async (id) => {
      await axios.patch(`/api/analytics/clicks/${id}`);
    },
    {
      onError: (error) => {
        toast.error(
          (error.response && error.response.data.message) || 'An error occurred'
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['links', fetchedUser?.id] });
        queryClient.invalidateQueries({ queryKey: ['users', fetchedUser?.id] });
      },
    }
  );

  const handleRegisterClick = async (id) => {
    await mutation.mutateAsync(id);
  };

  useEffect(() => {
    window.addEventListener('message', () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    });

    return () => {
      window.removeEventListener('message', () => {
        queryClient.invalidateQueries({ queryKey: ['links'] });
        queryClient.invalidateQueries({ queryKey: ['users'] });
      });
    };
  }, [queryClient]);

  useEffect(() => {
    if (fetchedUser && userLinks && sections) {
      setIsDataLoaded(true);
    }
  }, [fetchedUser, userLinks, sections]);

  // Track page view when component mounts
  useEffect(() => {
    if (fetchedUser?.handle) {
      const trackPageView = async () => {
        try {
          await axios.post('/api/analytics/views', {
            handle: fetchedUser.handle,
          });
        } catch (err) {
          console.error('Failed to track page view:', err);
        }
      };

      trackPageView();
    }
  }, [fetchedUser?.handle]);

  if (isUserLoading) {
    return <Loader message={'Loading...'} bgColor="black" textColor="black" />;
  }

  if (!fetchedUser?.id) {
    return <NotFound />;
  }

  const buttonStyle = fetchedUser?.buttonStyle;
  const buttonStyleTheme = fetchedUser?.buttonStyleTheme;
  const theme = {
    primary: fetchedUser?.themePalette.palette[0],
    secondary: fetchedUser?.themePalette.palette[1],
    accent: fetchedUser?.themePalette.palette[2],
    neutral: fetchedUser?.themePalette.palette[3],
  };

  const getBackgroundStyle = () => {
    const themePalette = fetchedUser?.themePalette;

    if (themePalette?.type === 'image') {
      return {
        backgroundImage: `url(${themePalette.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      };
    }

    if (themePalette?.type === 'gradient') {
      return {
        backgroundImage: themePalette.backgroundImage,
      };
    }

    if (themePalette?.type === 'pattern') {
      return {
        backgroundColor: themePalette.backgroundColor,
        backgroundImage: themePalette.backgroundImage,
        backgroundSize: themePalette.backgroundSize || 'auto',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
      };
    }

    if (themePalette?.type === 'animated') {
      // For animated themes, let AnimatedBackground component handle the styling
      // Only return basic background for gradient animations (which use CSS animations)
      if (themePalette.animation === 'gradient') {
        return {
          backgroundColor: themePalette.backgroundColor,
          backgroundImage: themePalette.backgroundImage,
          backgroundSize: themePalette.backgroundSize || '400% 400%',
        };
      }
      // For other animations (particles, matrix, pulse), return empty object - let AnimatedBackground handle it
      return {};
    }

    return {
      background: theme.primary,
    };
  };

  const shouldShowOverlay = () => {
    const themePalette = fetchedUser?.themePalette;
    return (themePalette?.type === 'image' || themePalette?.type === 'pattern') && themePalette?.overlay;
  };

  const getContainerClasses = () => {
    const layout = fetchedUser?.layoutTheme;
    if (!layout) return "relative z-10 flex flex-col items-center justify-center w-full max-w-2xl px-4 mx-auto mt-6 md:mt-10";

    const alignmentClass = layout.alignment === 'left' ? 'items-start' : 'items-center';
    const spacingClass = layout.spacing === 'tight' ? 'gap-3' : layout.spacing === 'loose' ? 'gap-8' : 'gap-5';
    const widthClass = layout.containerWidth || 'max-w-2xl';

    return `relative z-10 flex flex-col ${alignmentClass} justify-center w-full ${widthClass} px-4 mx-auto mt-6 md:mt-10 ${spacingClass}`;
  };

  const getTypographyStyles = () => {
    const typography = fetchedUser?.typographyTheme;
    if (!typography) return {};

    return {
      fontFamily: typography.fontFamily || 'inherit',
      letterSpacing: typography.letterSpacing || 'normal',
      lineHeight: typography.lineHeight || 'normal',
    };
  };

  // Get CSS variables for typography weights
  const getTypographyVariables = () => {
    const typography = fetchedUser?.typographyTheme;
    if (!typography) return {};

    return {
      '--heading-weight': typography.headingWeight || '700',
      '--body-weight': typography.bodyWeight || '400',
    };
  };

  return (
    <>
      <ProfilePageMeta
        handle={handle}
        name={fetchedUser?.name}
        bio={fetchedUser?.bio || 'Welcome to Lynkr'}
        user={fetchedUser}
      />
      {!query.isIframe ? (
        <Script
          defer
          data-host="https://api.tinybird.co"
          data-token={process.env.NEXT_PUBLIC_DATA_TOKEN}
        />
      ) : (
        ''
      )}
      <AnimatedBackground theme={fetchedUser?.themePalette?.type === 'animated' ? fetchedUser.themePalette : null}>
        <section
          style={getBackgroundStyle()}
          className={`min-h-screen w-full no-scrollbar overflow-auto relative ${fetchedUser?.themePalette?.type === 'animated' && fetchedUser.themePalette.animation === 'gradient'
            ? 'animated-gradient'
            : ''
            }`}
        >
          {shouldShowOverlay() && (
            <div
              className="absolute inset-0 z-0"
              style={{ backgroundColor: fetchedUser?.themePalette?.overlay }}
            />
          )}
          <div
            className={getContainerClasses()}
            style={{ ...getTypographyStyles(), ...getTypographyVariables() }}
          >
            {(isLinksFetching || isUserFetching || isSectionsFetching) && (
              <div className="absolute -top-5 left-2">
                <Loader
                  strokeWidth={7}
                  width={15}
                  height={15}
                  bgColor={theme.accent}
                />
              </div>
            )}

            {/* Profile Header - MUCH LARGER */}
            <div className="flex flex-col items-center mb-4">
              {/* Significantly larger Avatar */}
              <Avatar.Root
                className="inline-flex items-center justify-center w-32 h-32 overflow-hidden align-middle border-2 border-blue-300 rounded-full sm:h-36 sm:w-36"
              >
                <Avatar.Image
                  className="h-full w-full rounded-[inherit] object-cover"
                  src={fetchedUser && fetchedUser?.image}
                  referrerPolicy="no-referrer"
                  alt="avatar"
                />
                <Avatar.Fallback
                  className="flex items-center justify-center w-full h-full text-2xl font-medium bg-white leading-1"
                  delayMs={100}
                >
                  @
                </Avatar.Fallback>
              </Avatar.Root>

              {/* Larger name with proper font weight */}
              <h1
                style={{ color: theme.accent, fontWeight: 'var(--heading-weight)' }}
                className="mt-5 mb-2 text-2xl font-bold text-center sm:text-3xl"
              >
                {fetchedUser?.name}
              </h1>

              {/* Larger bio text with proper font weight */}
              {fetchedUser?.bio && (
                <div
                  style={{ color: theme.accent, fontWeight: 'var(--body-weight)' }}
                  className="w-full max-w-md text-center"
                >
                  {fetchedUser.bio.split('\n').map((line, i) => (
                    line.trim() ? (
                      <p key={i} className="text-base sm:text-lg">
                        {line}
                      </p>
                    ) : <br key={i} />
                  ))}
                </div>
              )}
            </div>

            {/* Social Links - Now properly sized */}
            <div className="flex flex-wrap items-center justify-center w-full gap-3 mb-4">
              {userLinks
                ?.filter((link) => link.isSocial && !link.archived)
                .map(({ id, title, url }) => {
                  return (
                    <SocialCards
                      key={title}
                      title={title}
                      url={url}
                      color={theme.accent}
                      registerClicks={() => handleRegisterClick(id)}
                    />
                  );
                })}
            </div>

            {/* Render sections based on layout mode */}
            {fetchedUser?.layoutTheme?.displayMode === 'tabbed' ? (
              <TabbedSections
                sections={sections}
                userLinks={userLinks}
                theme={theme}
                buttonStyle={buttonStyle}
                buttonStyleTheme={buttonStyleTheme}
                handleRegisterClick={handleRegisterClick}
              />
            ) : (
              <>
                {/* Render sections with their links (original layout) */}
                {sections
                  ?.filter((section) => section.visible)
                  .map((section) => {
                    const sectionLinks = section.links?.filter((link) => !link.isSocial && !link.archived) || [];

                    if (sectionLinks.length === 0) return null;

                    return (
                      <div key={section.id} className="flex flex-col items-center w-full max-w-md my-3">
                        <h3
                          style={{ color: theme.accent, fontWeight: 'var(--heading-weight)' }}
                          className="items-center justify-center mb-4 text-xl font-semibold text-center sm:text-2xl"
                        >
                          {section.name}
                        </h3>
                        <div className="flex flex-col items-center w-full gap-3 sm:gap-4">
                          {sectionLinks.map(({ id, ...link }) => (
                            <LinkCard
                              buttonStyle={buttonStyle}
                              buttonStyleTheme={buttonStyleTheme}
                              theme={theme}
                              id={id}
                              key={id}
                              {...link}
                              registerClicks={() => handleRegisterClick(id)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}

                {/* Render links without sections */}
                <div className="flex flex-col items-center w-full max-w-md gap-3 sm:gap-4">
                  {userLinks
                    ?.filter((link) => !link.isSocial && !link.sectionId && !link.archived)
                    .map(({ id, ...link }) => (
                      <LinkCard
                        buttonStyle={buttonStyle}
                        buttonStyleTheme={buttonStyleTheme}
                        theme={theme}
                        id={id}
                        key={id}
                        {...link}
                        registerClicks={() => handleRegisterClick(id)}
                      />
                    ))}
                </div>
              </>
            )}

            {userLinks?.filter(link => !link.archived).length === 0 && (
              <div className="flex justify-center">
                <h3
                  style={{ color: theme.neutral }}
                  className="pt-8 font-semibold text-white text-md lg:text-2xl"
                >
                  Hello World 🚀
                </h3>
              </div>
            )}
          </div>

          {/* Footer with proper spacing */}
          {userLinks?.filter(link => !link.archived).length > 0 && (
            <footer className="w-full py-8 mt-4 text-center">
              <p
                style={{ color: theme.accent }}
                className="text-base"
              >
                Made with{' '}
                <Link
                  className="font-semibold hover:underline"
                  target="_blank"
                  href="https://lynkr.link"
                >
                  Lynkr
                </Link>
              </p>
            </footer>
          )}
        </section>
      </AnimatedBackground>
    </>
  );
};

export default ProfilePage;