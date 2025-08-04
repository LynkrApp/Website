import { useState, useEffect } from 'react';
import Navbar from '@/components/root/navbar';
import Footer from '@/components/root/footer';
import { MetaTags } from '@/components/meta/metadata';
import NProgress from '@/components/utils/nprogress';
import { useRouter } from 'next/router';

const BaseLayout = ({
  children,
  className = "",
  navbarProps = {},
  footerProps = {},
  metaProps = {},
  showNavbar = true,
  showFooter = true,
  fullHeight = false,
  backgroundPattern = true
}) => {
  const router = useRouter();
  const [isRouteChanging, setIsRouteChanging] = useState(false);

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

  const getBackgroundClasses = () => {
    if (!backgroundPattern) return '';
    return 'bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]';
  };

  const getContainerClasses = () => {
    const baseClasses = `relative ${fullHeight ? 'min-h-screen' : ''} ${getBackgroundClasses()}`;
    return `${baseClasses} ${className}`;
  };

  return (
    <>
      {/* Meta tags */}
      <MetaTags {...metaProps} />

      {/* Loading progress bar */}
      <NProgress isRouteChanging={isRouteChanging} />

      {/* Main container with flex layout */}
      <div className={`flex flex-col ${fullHeight ? 'min-h-screen' : ''}`}>
        {/* Navbar - fixed at top */}
        {showNavbar && (
          <Navbar
            transparent={navbarProps.transparent || false}
            className={navbarProps.className || ''}
            {...navbarProps}
          />
        )}

        {/* Main content - takes remaining space */}
        <main className={`flex-1 ${getBackgroundClasses()} ${className}`}>
          <div className={showNavbar ? 'pt-16' : ''}>
            {children}
          </div>
        </main>

        {/* Footer - always at bottom */}
        {showFooter && (
          <Footer
            className={footerProps.className || ''}
            {...footerProps}
          />
        )}
      </div>
    </>
  );
};

// Specialized layouts for different page types
export const HomeLayout = ({ children, ...props }) => (
  <BaseLayout
    className="bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
    navbarProps={{ transparent: true }}
    fullHeight={true}
    {...props}
  >
    {children}
  </BaseLayout>
);

export const PageLayout = ({ children, ...props }) => (
  <BaseLayout
    navbarProps={{ transparent: false }}
    fullHeight={true}
    {...props}
  >
    {children}
  </BaseLayout>
);

export const AuthLayout = ({ children, ...props }) => (
  <BaseLayout
    showFooter={false}
    navbarProps={{ transparent: false }}
    backgroundPattern={false}
    className="min-h-screen"
    {...props}
  >
    {children}
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
    fullHeight={false}
    {...props}
  >
    <div className="max-w-4xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
      <div className="p-8 bg-white border border-gray-200 shadow-sm rounded-xl lg:p-12">
        {children}
      </div>
    </div>
  </BaseLayout>
);

export const ContentLayout = ({ children, title, description, maxWidth = "4xl", ...props }) => (
  <BaseLayout
    metaProps={{
      title,
      description: description || `${title} - Lynkr`
    }}
    navbarProps={{ transparent: false }}
    fullHeight={false}
    {...props}
  >
    <div className={`max-w-${maxWidth} mx-auto px-4 py-16 sm:px-6 lg:px-8`}>
      <div className="p-8 bg-white border border-gray-200 shadow-sm rounded-xl lg:p-12">
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
        {children}
      </div>
    </div>
  </BaseLayout>
);

// Marketing/Feature pages layout
export const MarketingLayout = ({ children, hero, ...props }) => (
  <BaseLayout
    navbarProps={{ transparent: !!hero }}
    fullHeight={true}
    {...props}
  >
    {hero && (
      <section className="relative pt-16 pb-24 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
        {hero}
      </section>
    )}
    <div className={hero ? '' : 'pt-24'}>
      {children}
    </div>
  </BaseLayout>
);

// Error pages layout
export const ErrorLayout = ({ children, ...props }) => (
  <BaseLayout
    navbarProps={{ transparent: false }}
    showFooter={false}
    fullHeight={true}
    backgroundPattern={false}
    className="flex items-center justify-center min-h-screen bg-gray-50"
    {...props}
  >
    {children}
  </BaseLayout>
);

export default BaseLayout;
