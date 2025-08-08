/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, useMemo } from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import LinkCard from '@/components/core/user-profile/links-card';
import Link from 'next/link';
import Loader from '@/components/utils/loading-spinner';
import NotFound from '@/components/utils/not-found';
import useLinks from '@/hooks/useLinks';
import useSections from '@/hooks/useSections';
import { SocialCards } from '@/components/core/user-profile/social-cards';
import useCurrentUser from '@/hooks/useCurrentUser';
import AnimatedBackground from '@/components/core/animated-backgrounds/animated-background';
import FontLoader from '@/components/utils/font-loader';
import { X } from 'lucide-react';

const PreviewMobile = ({ close }) => {
  const [, setIsDataLoaded] = useState(false);

  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();

  const { data: userLinks } = useLinks(currentUser?.id);

  const { data: sections } = useSections(currentUser?.id);

  const theme = useMemo(
    () => ({
      primary: currentUser?.themePalette.palette[0],
      secondary: currentUser?.themePalette.palette[1],
      accent: currentUser?.themePalette.palette[2],
      neutral: currentUser?.themePalette.palette[3],
    }),
    [currentUser?.themePalette.palette]
  );

  const socialLinks = useMemo(
    () =>
      Array.isArray(userLinks)
        ? userLinks.filter((link: any) => link.isSocial && !link.archived)
        : [],
    [userLinks]
  );

  const nonSocialLinks = useMemo(
    () =>
      Array.isArray(userLinks)
        ? userLinks.filter((link: any) => !link.isSocial)
        : [],
    [userLinks]
  );

  useEffect(() => {
    if (currentUser && userLinks && sections) {
      setIsDataLoaded(true);
    }
  }, [currentUser, userLinks, sections]);

  if (isUserLoading) {
    return (
      <Loader
        message={'Loading...'}
        bgColor="black"
        textColor="text-black"
        width={40}
        height={40}
        strokeWidth={2}
      />
    );
  }

  const getBackgroundStyle = () => {
    const themePalette = currentUser?.themePalette;

    if (themePalette?.type === 'image') {
      return {
        backgroundImage: `url(${themePalette.backgroundImage})`,
        backgroundSize: 'cover' as const,
        backgroundPosition: 'center' as const,
        backgroundRepeat: 'no-repeat' as const,
        // position: 'relative',
      };
    }

    if (themePalette?.type === 'gradient') {
      return {
        backgroundImage: themePalette.backgroundImage as string,
      };
    }

    if (themePalette?.type === 'pattern') {
      return {
        backgroundColor: themePalette.backgroundColor as string,
        backgroundImage: themePalette.backgroundImage as string,
        backgroundSize: (themePalette.backgroundSize || 'auto') as string,
        backgroundPosition: 'center' as const,
        backgroundRepeat: 'repeat' as const,
      } as React.CSSProperties;
    }

    if (themePalette?.type === 'animated') {
      // For animated themes, let AnimatedBackground component handle the styling
      // Only return basic background for gradient animations (which use CSS animations)
      if (themePalette.animation === 'gradient') {
        return {
          backgroundColor: themePalette.backgroundColor as string,
          backgroundImage: themePalette.backgroundImage as string,
          backgroundSize: (themePalette.backgroundSize ||
            '400% 400%') as string,
        } as React.CSSProperties;
      }
      // For other animations (particles, matrix, pulse), return empty object - let AnimatedBackground handle it
      return {};
    }

    return {
      background: theme.primary as string,
    } as React.CSSProperties;
  };

  const getContainerClasses = () => {
    const layoutTheme = currentUser?.layoutTheme;
    const baseClasses =
      'relative z-10 flex flex-col items-center justify-center w-full max-w-3xl mx-auto mt-10 lg:mt-16';

    if (layoutTheme?.layout === 'centered-narrow') {
      return `${baseClasses} px-8 max-w-sm`;
    }
    if (layoutTheme?.layout === 'offset-left') {
      return `${baseClasses} px-4 items-start`;
    }
    if (layoutTheme?.layout === 'offset-right') {
      return `${baseClasses} px-4 items-end`;
    }
    if (layoutTheme?.layout === 'full-width') {
      return `${baseClasses} px-2 max-w-full`;
    }

    return `${baseClasses} px-8`;
  };

  const getTypographyStyles = () => {
    const typographyTheme = currentUser?.typographyTheme;
    if (!typographyTheme) return {};

    return {
      fontFamily: typographyTheme.fontFamily || 'inherit',
      letterSpacing: typographyTheme.letterSpacing || 'normal',
      lineHeight: typographyTheme.lineHeight || 'normal',
      '--heading-weight': typographyTheme.headingWeight || '700',
      '--body-weight': typographyTheme.bodyWeight || '400',
    };
  };

  const shouldShowOverlay = () => {
    const themePalette = currentUser?.themePalette;
    return themePalette?.type === 'image' && themePalette?.overlay;
  };

  if (!currentUser?.id) {
    return <NotFound />;
  }

  return (
    <>
      <FontLoader typographyTheme={currentUser?.typographyTheme} />
      <AnimatedBackground
        theme={
          currentUser?.themePalette?.type === 'animated'
            ? currentUser.themePalette
            : null
        }
      >
        <section
          style={{ ...getBackgroundStyle(), ...getTypographyStyles() }}
          className={`h w-[100vw] no-scrollbar overflow-auto relative ${
            currentUser?.themePalette?.type === 'animated' &&
            currentUser.themePalette.animation === 'gradient'
              ? 'animated-gradient'
              : ''
          }`}
        >
          {shouldShowOverlay() && (
            <div
              className="absolute inset-0 z-0"
              style={{ backgroundColor: currentUser?.themePalette?.overlay }}
            />
          )}
          <div className={getContainerClasses()}>
            <Avatar.Root
              className="inline-flex h-[70px] w-[70px] border-2 border-blue-300
              items-center justify-center overflow-hidden rounded-full align-middle lg:w-[96px] lg:h-[96px]"
            >
              <Avatar.Image
                className="h-full w-full rounded-[inherit] object-cover"
                src={currentUser && currentUser?.image}
                referrerPolicy="no-referrer"
                alt="avatar"
              />
              <Avatar.Fallback
                className="flex items-center justify-center w-full h-full text-xl font-medium text-white leading-1 bg-slate-900"
                delayMs={100}
              >
                @
              </Avatar.Fallback>
            </Avatar.Root>
            <p
              style={{
                color: theme.accent,
                fontWeight: 'var(--heading-weight)',
              }}
              className="mt-4 mb-2 text-sm font-bold text-center text-white lg:text-xl lg:mt-4"
            >
              {currentUser?.name}
            </p>
            {currentUser?.bio && (
              <p
                style={{
                  color: theme.accent,
                  fontWeight: 'var(--body-weight)',
                }}
                className="w-[150px] truncate text-center text-sm mt-1 mb-4 lg:text-xl lg:mb-4 lg:w-[500px]"
              >
                {currentUser?.bio}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mb-8 min-w-max lg:w-fit lg:gap-4">
              {socialLinks?.map(({ title, url }) => (
                <SocialCards
                  key={title}
                  title={title}
                  url={url}
                  color={theme.accent}
                  registerClicks={() => {}}
                />
              ))}
            </div>

            {/* Render sections with their links */}
            {sections
              ?.filter((section) => section.visible)
              .map((section) => {
                const sectionLinks =
                  section.links?.filter(
                    (link) => !link.isSocial && !link.archived
                  ) || [];

                if (sectionLinks.length === 0) return null;

                return (
                  <div key={section.id} className="w-full max-w-md mb-6">
                    <h3
                      style={{ color: theme.accent }}
                      className="mb-4 text-lg font-semibold text-center"
                    >
                      {section.name}
                    </h3>
                    {sectionLinks.map(({ id, ...link }) => (
                      <LinkCard
                        buttonStyle={currentUser?.buttonStyle}
                        buttonStyleTheme={currentUser?.buttonStyleTheme}
                        theme={theme}
                        id={id}
                        key={id}
                        {...link}
                      />
                    ))}
                  </div>
                );
              })}

            {/* Render links without sections */}
            {(Array.isArray(userLinks) ? userLinks : [])
              .filter(
                (link: any) =>
                  !link.isSocial && !link.sectionId && !link.archived
              )
              .map(({ id, ...link }: any) => (
                <LinkCard
                  buttonStyle={currentUser?.buttonStyle}
                  buttonStyleTheme={currentUser?.buttonStyleTheme}
                  theme={theme}
                  id={id}
                  key={id}
                  {...link}
                />
              ))}

            {Array.isArray(userLinks) &&
              userLinks.filter((link: any) => !link.archived).length === 0 && (
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
          <div className="mt-10" />
          {nonSocialLinks?.length > 0 && (
            <footer className="relative left-1/2 bottom-0 transform -translate-x-1/2 w-[200px]">
              <p
                style={{ color: theme.accent }}
                className="text-sm text-center text-semibold lg:text-lg"
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
          )}
          <div className="absolute rounded-full top-2 right-2 transform-translate-x-1/2 lg:hidden">
            <button
              onClick={close}
              style={{ background: `${theme.neutral}` }}
              className="flex justify-center items-center w-[45px] h-[45px] rounded-full bg-gray-500 text-black text-center font-bold text-lg shadow-lg hover:bg-slate-600"
            >
              <X color="white" size={30} />
            </button>
          </div>
        </section>
      </AnimatedBackground>
    </>
  );
};

export default PreviewMobile;
