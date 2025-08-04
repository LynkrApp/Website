import React from 'react';
import Head from 'next/head';

// Default configuration for Lynkr
const defaultConfig = {
  siteName: 'Lynkr',
  domain: 'lynkr.link',
  fallbackDomains: ['lynkr.ca', 'link.re'],
  themeColor: '#3B82F6', // Blue-600
  tileColor: '#1E40AF', // Blue-800
  twitterHandle: '@HeyLynkr',
  defaultImage: '/og.png',
  description: 'Create beautiful, organized link pages that drive engagement and grow your audience. Free, open source, and packed with powerful features.'
};

export const MetaTags = ({ 
  title, 
  description = defaultConfig.description, 
  image,
  type = 'website',
  url,
  noIndex = false,
  twitterCard = 'summary_large_image'
}) => {
  // Build full title
  const fullTitle = title ? `${title} | ${defaultConfig.siteName}` : `${defaultConfig.siteName} | The Ultimate Free Link in Bio Platform`;
  
  // Default image fallback
  const ogImage = image || defaultConfig.defaultImage;
  
  // Build image URLs for all domains
  const imageUrls = [
    `https://${defaultConfig.domain}${ogImage}`,
    ...defaultConfig.fallbackDomains.map(domain => `https://${domain}${ogImage}`)
  ];
  
  // Build canonical URLs
  const canonicalUrls = url ? [
    `https://${defaultConfig.domain}${url}`,
    ...defaultConfig.fallbackDomains.map(domain => `https://${domain}${url}`)
  ] : [
    `https://${defaultConfig.domain}/`,
    ...defaultConfig.fallbackDomains.map(domain => `https://${domain}/`)
  ];

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
      <meta name="apple-mobile-web-app-title" content={title || defaultConfig.siteName} />
      <meta name="application-name" content={defaultConfig.siteName} />
      
      {/* SEO */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      <link rel="canonical" href={canonicalUrls[0]} />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={defaultConfig.siteName} />
      <meta property="og:title" content={title || defaultConfig.siteName} />
      <meta property="og:description" content={description} />
      {canonicalUrls.map((canonicalUrl, index) => (
        <meta key={`og-url-${index}`} property="og:url" content={canonicalUrl} />
      ))}
      {imageUrls.map((imageUrl, index) => (
        <meta key={`og-image-${index}`} property="og:image" content={imageUrl} />
      ))}
      <meta property="og:image:alt" content={`${defaultConfig.siteName} - ${description}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={defaultConfig.twitterHandle} />
      <meta name="twitter:creator" content={defaultConfig.twitterHandle} />
      <meta name="twitter:title" content={title || defaultConfig.siteName} />
      <meta name="twitter:description" content={description} />
      {canonicalUrls.map((canonicalUrl, index) => (
        <meta key={`twitter-domain-${index}`} property="twitter:domain" content={canonicalUrl} />
      ))}
      <meta property="twitter:url" content={canonicalUrls[0]} />
      {imageUrls.map((imageUrl, index) => (
        <meta key={`twitter-image-${index}`} name="twitter:image" content={imageUrl} />
      ))}
      <meta name="twitter:image:alt" content={`${defaultConfig.siteName} - ${description}`} />
      
      {/* Platform-specific Open Graph Tags */}
      
      {/* LinkedIn */}
      <meta property="og:linkedin:title" content={title || defaultConfig.siteName} />
      <meta property="og:linkedin:description" content={description} />
      {imageUrls.map((imageUrl, index) => (
        <meta key={`linkedin-image-${index}`} property="og:linkedin:image" content={imageUrl} />
      ))}
      
      {/* Facebook */}
      <meta property="og:facebook:title" content={title || defaultConfig.siteName} />
      <meta property="og:facebook:description" content={description} />
      {imageUrls.map((imageUrl, index) => (
        <meta key={`facebook-image-${index}`} property="og:facebook:image" content={imageUrl} />
      ))}
      
      {/* Instagram */}
      <meta property="og:instagram:title" content={title || defaultConfig.siteName} />
      <meta property="og:instagram:description" content={description} />
      {imageUrls.map((imageUrl, index) => (
        <meta key={`instagram-image-${index}`} property="og:instagram:image" content={imageUrl} />
      ))}
      
      {/* Pinterest */}
      <meta property="og:pinterest:title" content={title || defaultConfig.siteName} />
      <meta property="og:pinterest:description" content={description} />
      {imageUrls.map((imageUrl, index) => (
        <meta key={`pinterest-image-${index}`} property="og:pinterest:image" content={imageUrl} />
      ))}
      
      {/* Favicons and App Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" sizes="16x16" href="/favicon.ico" />
      <link rel="icon" sizes="32x32" href="/favicon.ico" />
      <link rel="icon" sizes="96x96" href="/favicon.ico" />
      <link rel="icon" sizes="192x192" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicon.ico" />
      <meta name="msapplication-TileImage" content="/favicon.ico" />
      
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

export const ProfilePageMeta = ({ handle, name, bio, ...props }) => (
  <MetaTags
    title={name ? `${name} (@${handle})` : `@${handle}`}
    description={bio || `Check out ${name || handle}'s links on Lynkr - the ultimate link in bio platform.`}
    url={`/${handle}`}
    {...props}
  />
);

export const AuthPageMeta = ({ pageType, ...props }) => {
  const titles = {
    login: 'Sign In',
    register: 'Get Started',
    onboarding: 'Create Your Profile'
  };
  
  return (
    <MetaTags
      title={titles[pageType] || 'Authentication'}
      description="Join thousands of creators using Lynkr to showcase their links in style."
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
    settings: 'Settings'
  };
  
  return (
    <MetaTags
      title={titles[pageType] || 'Admin'}
      description="Manage your Lynkr profile and links."
      noIndex={true}
      {...props}
    />
  );
};
