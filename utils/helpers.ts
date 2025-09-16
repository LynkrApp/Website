import ccTLDs from './constants/ccltds';
import { SECOND_LEVEL_DOMAINS, SPECIAL_APEX_DOMAINS } from './constants';
import ms from 'ms';

export const getApexDomain = (url: string): string => {
  let domain: string;
  try {
    domain = new URL(url).hostname;
  } catch (e) {
    return '';
  }
  if (SPECIAL_APEX_DOMAINS[domain]) return SPECIAL_APEX_DOMAINS[domain];

  const parts = domain.split('.');
  if (parts.length > 2) {
    const isSecondLevel =
      SECOND_LEVEL_DOMAINS.has(parts[parts.length - 2]) &&
      ccTLDs.has(parts[parts.length - 1]);
    if (isSecondLevel) return parts.slice(-3).join('.');
    return parts.slice(-2).join('.');
  }
  return domain;
};

export const validDomainRegex = new RegExp(
  /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
);

export const timeAgo = (timestamp?: string | number | Date): string => {
  if (!timestamp) return 'Just now';
  const diff = Date.now() - new Date(timestamp).getTime();
  if (diff < 60000) {
    return 'Just now';
  } else if (diff > 82800000) {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year:
        new Date(timestamp).getFullYear() !== new Date().getFullYear()
          ? 'numeric'
          : undefined,
    });
  }
  return ms(diff);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const getInitials = (name: string): string => {
  const words = name.split(' ').filter(Boolean);
  const initials = words.map((word) => word.charAt(0).toUpperCase());
  return initials.join('');
};

export const signalIframe = (): void => {
  if (typeof document === 'undefined') return;
  const iframe = document.getElementById('preview') as HTMLIFrameElement | null;
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage('', '*');
  }
};

export const removeHashFromHexColor = (hexColor: string): string => {
  return hexColor.replace(/^#/, '');
};

// Always return absolute base URL for server/client with robust fallbacks
export const getCurrentBaseURL = (): string => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  const vercelUrl = process.env.VERCEL_URL?.replace(/^https?:\/\//, '');
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  const publicBase = process.env.NEXT_PUBLIC_BASE_URL;
  if (publicBase) {
    try {
      return new URL(publicBase).origin;
    } catch {
      return `https://${publicBase}`;
    }
  }

  const site = process.env.NEXT_PUBLIC_SITE_DOMAIN || 'lynkr.link';
  return `https://${site}`;
};

export type OgStyles = {
  backgroundType?: 'gradient' | 'solid';
  backgroundGradient?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  showAvatar?: boolean;
  showStats?: boolean;
  backgroundOpacity?: number;
};



