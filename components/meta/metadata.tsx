import React from 'react';
import Head from 'next/head';
import { getCurrentBaseURL } from '@/utils/helpers';

// Default configuration for Lynkr
const defaultConfig = {
  siteName: 'Lynkr',
  domain: 'lynkr.link',
  fallbackDomains: ['lynkr.ca', 'link.re'],
  themeColor: '#3B82F6', // Blue-600
  tileColor: '#1E40AF', // Blue-800
  twitterHandle: '@HeyLynkr',
  defaultImage: '/og.png',
  description:
    'Create beautiful, organized link pages that drive engagement and grow your audience. Free, open source, and packed with powerful features.',
};

export const MetaTags = ({
  title,
  description = defaultConfig.description,
  image,
  type = 'website',
  url,
  noIndex = false,
  twitterCard = 'summary_large_image',
  handle = null,
  ogStylesApplied = false,
}) => {
  // Build full title
  const fullTitle = title
    ? `${title} | ${defaultConfig.siteName}`
    : `${defaultConfig.siteName} | The Ultimate Free Link in Bio Platform`;

  // Get base URL (absolute) with robust env fallbacks
  const baseUrl = getCurrentBaseURL();

  // Use dynamic OG image if handle is provided, with timestamp to prevent caching
  const timestamp = Date.now();
  const ogImage = handle
    ? `${baseUrl}/api/og?username=${encodeURIComponent(handle)}&t=${timestamp}`
    : image || defaultConfig.defaultImage;

  // Use single canonical image URL
  const canonicalImageUrl = ogImage.startsWith('http')
    ? ogImage
    : `${baseUrl}${ogImage}`;

  // Use single canonical URL
  const canonicalUrl = url ? `${baseUrl}${url}` : `${baseUrl}/`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />

      {/* Theme and App Configuration */}
      <meta name="theme-color" content={defaultConfig.themeColor} />
      <meta name="msapplication-TileColor" content={defaultConfig.tileColor} />
      <meta
        name="apple-mobile-web-app-title"
        content={title || defaultConfig.siteName}
      />
      <meta name="application-name" content={defaultConfig.siteName} />

      {/* SEO */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={defaultConfig.siteName} />
      <meta property="og:title" content={title || defaultConfig.siteName} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={canonicalImageUrl} />
      <meta property="og:image:secure_url" content={canonicalImageUrl} />
      <meta
        property="og:image:alt"
        content={`${defaultConfig.siteName} - ${description}`}
      />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={defaultConfig.twitterHandle} />
      <meta name="twitter:creator" content={defaultConfig.twitterHandle} />
      <meta name="twitter:title" content={title || defaultConfig.siteName} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:domain" content={defaultConfig.domain} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:image" content={canonicalImageUrl} />
      <meta name="twitter:image:src" content={canonicalImageUrl} />
      <meta
        name="twitter:image:alt"
        content={`${defaultConfig.siteName} - ${description}`}
      />

      {/* Favicons and App Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" sizes="32x32" href="/favicon-32x32.png" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <meta name="msapplication-TileImage" content="/mstile-144x144.png" />

      {/* PWA Support */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    </Head>
  );
};

// Convenience exports for common page types
export const HomePageMeta = (props) => (
  <MetaTags
    title=""
    description="The ultimate free & open source link in bio platform. Create beautiful, organized link pages that drive engagement and grow your audience."
    {...props}
  />
);

export const ProfilePageMeta = ({ handle, name, bio, user, ...props }) => {
  // Check if user has custom OG styles defined
  const hasCustomOgStyles =
    user?.ogStyles && Object.keys(user.ogStyles).length > 0;

  return (
    <MetaTags
      title={name ? `${name} (@${handle})` : `@${handle}`}
      description={
        bio ||
        `Check out ${name || handle}'s links on Lynkr - the ultimate link in bio platform.`
      }
      image={defaultConfig.defaultImage}
      url={`/${handle}`}
      handle={handle}
      ogStylesApplied={hasCustomOgStyles}
      {...props}
    />
  );
};

export const AuthPageMeta = ({ pageType, ...props }) => {
  const titles = {
    login: 'Sign In',
    register: 'Get Started',
    onboarding: 'Create Your Profile',
  };

  return (
    <MetaTags
      title={titles[pageType] || 'Authentication'}
      description="Join thousands of creators using Lynkr to showcase their links in style."
      image={defaultConfig.defaultImage}
      url={'/'}
      noIndex={true}
      {...props}
    />
  );
};

export const AdminPageMeta = ({ pageType, ...props }) => {
  const titles = {
    dashboard: 'Dashboard',
    analytics: 'Analytics',
    customize: 'Customize',
    settings: 'Settings',
  };

  return (
    <MetaTags
      title={titles[pageType] || 'Admin'}
      description="Manage your Lynkr profile and links."
      image={defaultConfig.defaultImage}
      url={'/admin'}
      noIndex={true}
      {...props}
    />
  );
};
