import { useState, useEffect } from 'react';
import Navbar from '@/components/root/navbar';
import Footer from '@/components/root/footer';
import { MetaTags } from '@/components/meta/metadata';
import NProgress from '@/components/utils/nprogress';
import { useRouter } from 'next/router';

// Background pattern types
const PATTERNS = {
  DOTS: 'pattern-dots',
  GRID: 'pattern-grid',
  TOPOGRAPHY: 'pattern-topography',
  WAVE: 'pattern-wave',
  RADIAL: 'bg-gradient-to-br from-slate-900 via-slate-800 to-[#376878]',
  NONE: ''
};

// Theme configurations
const THEMES = {
  LIGHT: {
    bg: 'bg-(#fff)',
    text: 'text-gray-900',
    navbar: {},
    footer: {}
  },
  DARK: {
    bg: 'bg-gray-900',
    text: 'text-white',
    navbar: { className: 'bg-gray-900 border-gray-800 text-white' },
    footer: { className: 'bg-gray-900 text-white' }
  },
  BLUE: {
    bg: 'bg-blue-50',
    text: 'text-gray-900',
    navbar: { className: 'from-blue-600 to-indigo-600' },
    footer: { className: 'bg-blue-900 text-white' }
  }
};

const BaseLayout = ({
  children,
  className = "",
  navbarProps = {},
  footerProps = {},
  metaProps = {},
  showNavbar = true,
  showFooter = true,
  fullHeight = false,
  backgroundPattern = 'RADIAL', // Default pattern
  theme = 'LIGHT', // Default theme
  containerWidth = 'DEFAULT', // DEFAULT, NARROW, SLIM
  contentAnimation = false, // Enable content animation
  glassmorphism = false, // Enable glass effect for navbar
  stickyFooter = false // Pin footer to bottom
}) => {
  const router = useRouter();
  const [isRouteChanging, setIsRouteChanging] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle route changes for loading states
  useEffect(() => {
    const handleRouteChangeStart = () => setIsRouteChanging(true);
    const handleRouteChangeEnd = () => setIsRouteChanging(false);

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeEnd);
    router.events.on('routeChangeError', handleRouteChangeEnd);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeEnd);
      router.events.off('routeChangeError', handleRouteChangeEnd);
    };
  }, [router]);

  // For hydration and animations
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get the active theme configuration
  const activeTheme = THEMES[theme] || THEMES.LIGHT;

  // Get the pattern class
  const patternClass = typeof backgroundPattern === 'string'
    ? (PATTERNS[backgroundPattern] || PATTERNS.NONE)
    : PATTERNS.NONE;

  // Get container class based on width preference
  const getContainerClass = () => {
    switch (containerWidth) {
      case 'NARROW': return 'container-narrow';
      case 'SLIM': return 'container-slim';
      default: return 'container-base';
    }
  };

  // Animation class for content
  const getAnimationClass = () => {
    if (!contentAnimation || !mounted) return '';
    return 'animate-fade-in';
  };

  // Enhanced navbar props with glass effect if enabled
  const enhancedNavbarProps = {
    ...activeTheme.navbar,
    ...navbarProps,
    className: `${glassmorphism ? 'glass-effect' : ''} ${navbarProps.className || ''} ${activeTheme.navbar.className || ''}`
  };

  // Enhanced footer props
  const enhancedFooterProps = {
    ...activeTheme.footer,
    ...footerProps,
    className: `${footerProps.className || ''} ${activeTheme.footer.className || ''}`
  };

  return (
    <>
      {/* Meta tags */}
      <MetaTags {...metaProps} />

      {/* Loading progress bar */}
      <NProgress isRouteChanging={isRouteChanging} />

      {/* Main container with flex layout */}
      <div className={`flex flex-col ${fullHeight ? 'min-h-screen' : ''} ${activeTheme.bg} ${activeTheme.text}`}>
        {/* Navbar - fixed at top */}
        {showNavbar && (
          <div className="sticky top-0 z-50">
            <Navbar
              transparent={navbarProps.transparent || false}
              {...enhancedNavbarProps}
            />
          </div>
        )}

        {/* Background pattern container with responsive padding */}
        <div className={`flex-1 ${patternClass}`}>
          {/* Main content area with animation */}
          <main className={`${showNavbar ? 'pt-10 md:pt-16' : ''} ${getAnimationClass()}`}>
            {/* Content container with appropriate width */}
            {children}
          </main>
        </div>

        {/* Footer - always at bottom */}
        {showFooter && (
          <div className={stickyFooter ? 'mt-auto' : ''}>
            <Footer {...enhancedFooterProps} />
          </div>
        )}
      </div>
    </>
  );
};

// Specialized layouts for different page types
export const HomeLayout = ({ children, ...props }) => (
  <BaseLayout
    backgroundPattern="NONE"
    navbarProps={{ transparent: true }}
    fullHeight={true}
    contentAnimation={true}
    glassmorphism={true}
    {...props}
  >
    {children}
  </BaseLayout>
);

export const PageLayout = ({ children, containerWidth = 'DEFAULT', ...props }) => (
  <BaseLayout
    navbarProps={{ transparent: false }}
    fullHeight={true}
    containerWidth={containerWidth}
    contentAnimation={true}
    {...props}
  >
    <div className={containerWidth === 'DEFAULT' ? 'container-base' :
      containerWidth === 'NARROW' ? 'container-narrow' : 'container-slim'}>
      {children}
    </div>
  </BaseLayout>
);

export const AuthLayout = ({ children, ...props }) => (
  <BaseLayout
    showFooter={false}
    navbarProps={{ transparent: false }}
    backgroundPattern="WAVE"
    className="min-h-screen"
    contentAnimation={true}
    {...props}
  >
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      <div className="w-full max-w-md p-8 mx-auto glass-card rounded-xl">
        {children}
      </div>
    </div>
  </BaseLayout>
);

export const LegalLayout = ({ children, title, ...props }) => (
  <BaseLayout
    metaProps={{
      title,
      description: `${title} - Lynkr`,
      noIndex: false
    }}
    navbarProps={{ transparent: false }}
    backgroundPattern="DOTS"
    containerWidth="NARROW"
    {...props}
  >
    <div className="container-narrow">
      <div className="p-8 bg-[#f8eeee] border border-gray-200 shadow-sm rounded-xl lg:p-12">
        {children}
      </div>
    </div>
  </BaseLayout>
);

export const ContentLayout = ({
  children,
  title,
  description,
  containerWidth = "NARROW",
  backgroundPattern = "GRID",
  ...props
}) => (
  <BaseLayout
    metaProps={{
      title,
      description: description || `${title} - Lynkr`
    }}
    navbarProps={{ transparent: false }}
    backgroundPattern={backgroundPattern}
    containerWidth={containerWidth}
    contentAnimation={true}
    {...props}
  >
    <div className={containerWidth === 'DEFAULT' ? 'container-base' :
      containerWidth === 'NARROW' ? 'container-narrow' : 'container-slim'}>
      <div className="section-padding bg-[#f8eeee]">
        <div className="p-8 lg:p-12">
          {title && (
            <div className="pb-8 mb-8 border-b border-gray-200">
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {title}
              </h1>
              {description && (
                <p className="mt-4 text-lg text-gray-600">
                  {description}
                </p>
              )}
            </div>
          )}
          <div className="animate-slide-up">
            {children}
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>
);

// Error pages layout
export const ErrorLayout = ({ children, ...props }) => (
  <BaseLayout
    navbarProps={{ transparent: false }}
    showFooter={false}
    fullHeight={true}
    backgroundPattern="TOPOGRAPHY"
    className="flex items-center justify-center min-h-screen"
    contentAnimation={true}
    {...props}
  >
    <div className="container-slim">
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
        {children}
      </div>
    </div>
  </BaseLayout>
);

export default BaseLayout;
