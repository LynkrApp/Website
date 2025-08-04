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
    if (!layout) return "relative z-10 flex flex-col items-center justify-center w-full max-w-3xl px-8 mx-auto mt-4 lg:mt-16";

    const alignmentClass = layout.alignment === 'left' ? 'items-start' : 'items-center';
    const spacingClass = layout.spacing === 'tight' ? 'gap-2' : layout.spacing === 'loose' ? 'gap-6' : 'gap-4';
    const widthClass = layout.containerWidth || 'max-w-3xl';

    return `relative z-10 flex flex-col ${alignmentClass} justify-center w-full ${widthClass} px-8 mx-auto mt-4 lg:mt-16 ${spacingClass}`;
  };

  const getTypographyStyles = () => {
    const typography = fetchedUser?.typographyTheme;
    if (!typography) return {};

    return {
      fontFamily: typography.fontFamily,
      letterSpacing: typography.letterSpacing,
      lineHeight: typography.lineHeight,
    };
  };

  return (
    <>
      <Head>
        <title> @{handle} | Lynkr</title>
      </Head>
      {!query.isIframe ? (
        <Script
          defer
          src="https://unpkg.com/@tinybirdco/flock.js"
          data-host="https://api.tinybird.co"
          data-token={process.env.NEXT_PUBLIC_DATA_TOKEN}
        />
      ) : (
        ''
      )}
      <AnimatedBackground theme={fetchedUser?.themePalette?.type === 'animated' ? fetchedUser.themePalette : null}>
        <section
          style={getBackgroundStyle()}
          className={`h-[100vh] w-[100vw] no-scrollbar overflow-auto relative ${fetchedUser?.themePalette?.type === 'animated' && fetchedUser.themePalette.animation === 'gradient'
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
            style={getTypographyStyles()}
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
            <Avatar.Root
              className="inline-flex h-[70px] w-[70px] border-2 border-blue-300
						items-center justify-center overflow-hidden rounded-full align-middle lg:w-[96px] lg:h-[96px]"
            >
              <Avatar.Image
                className="h-full w-full rounded-[inherit] object-cover"
                src={fetchedUser && fetchedUser?.image}
                referrerPolicy="no-referrer"
                alt="avatar"
              />
              <Avatar.Fallback
                className="leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
                delayMs={100}
              >
                @
              </Avatar.Fallback>
            </Avatar.Root>
            <p
              style={{ color: theme.accent }}
              className="mt-4 mb-2 text-sm font-bold text-center text-white lg:text-xl lg:mt-4"
            >
              {fetchedUser?.name}
            </p>
            {fetchedUser?.bio && (
              <p
                style={{ color: theme.accent }}
                className="w-[150px] truncate text-center text-sm mt-1 mb-4 lg:text-xl lg:mb-4 lg:w-[600px] "
              >
                {fetchedUser?.bio}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8 min-w-max lg:w-fit lg:gap-4">
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

            {/* Render sections with their links */}
            {sections
              ?.filter((section) => section.visible)
              .map((section) => {
                const sectionLinks = section.links?.filter((link) => !link.isSocial && !link.archived) || [];

                if (sectionLinks.length === 0) return null;

                return (
                  <div key={section.id} className="flex flex-col items-center w-full max-w-md mb-6">
                    <h3
                      style={{ color: theme.accent }}
                      className="items-center justify-center mb-4 text-lg font-semibold text-center"
                    >
                      {section.name}
                    </h3>
                    <div className="flex flex-col items-center w-full">
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
            <div className="flex flex-col items-center w-full max-w-md">
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
          <div className="my-10 lg:my-24" />
          {userLinks?.filter(link => !link.archived).length > 0 ? (
            <footer className="relative left-1/2 bottom-0 transform -translate-x-1/2 w-[200px]">
              <p
                style={{ color: theme.accent }}
                className="text-sm text-center text-semibold w lg:text-lg"
              >
                Made with{' '}
                <Link
                  className="font-semibold"
                  target="_blank"
                  href="https://lynkr.link"
                >
                  Lynkr
                </Link>
              </p>
            </footer>
          ) : (
            ''
          )}
        </section>
      </AnimatedBackground>
    </>
  );
};

export default ProfilePage;
