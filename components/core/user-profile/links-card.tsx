/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import { getApexDomain } from '@/utils/helpers';
import { GOOGLE_FAVICON_URL } from '@/utils/constants';
import { useState } from 'react';

const LinkCard = (props) => {
  // Legacy button style support
  const isTransparent = props.buttonStyle?.includes('bg-transparent');
  const hasShadowProp = props.buttonStyle?.includes('shadow');

  // Get button style from theme
  const buttonStyleTheme = props.buttonStyleTheme;

  const style = {
    background: isTransparent ? 'transparent' : props.theme.secondary,
    display: props.archived ? 'none' : 'flex',
    border: `1.5px solid ${props.theme.neutral}`,
    boxShadow: hasShadowProp ? `5px 5px 0 0 ${props.theme.neutral}` : '',
    // Apply new button style theme if available
    ...(buttonStyleTheme?.borderRadius && {
      borderRadius: buttonStyleTheme.borderRadius,
    }),
  };

  // Updated button classes with better sizing
  const buttonClasses = `
    flex items-center justify-center transition-all border w-full max-w-md mx-auto py-3 px-4 mb-2
    ${props.buttonStyle || ''}
    ${buttonStyleTheme?.shadow || ''}
    ${buttonStyleTheme?.hover || 'hover:scale-105'}
    ${buttonStyleTheme?.transition || 'transition-all'}
  `.trim();

  const apexDomain = getApexDomain(props.url);
  const faviconUrl = `${GOOGLE_FAVICON_URL}${apexDomain}`;

  const [showNSFWWarning, setShowNSFWWarning] = useState(false);
  const [pendingURL, setPendingURL] = useState(null);

  const handleClicks = (e) => {
    if (props.isNSFWLink) {
      e.preventDefault();
      setShowNSFWWarning(true);
      setPendingURL(props.url);
      props.registerClicks?.(e);
    } else {
      props.registerClicks(e);
    }
  }

  const handleAcceptNSFW = () => {
    setShowNSFWWarning(false);
    window.open(pendingURL, '_blank', 'noopener,noreferrer');
    setPendingURL(null);
  }

  const handleDeclineNSFW = () => {
    setShowNSFWWarning(false);
    setPendingURL(null);
  }

  return (
    <>
    <a
      href={props.url}
      onClick={handleClicks}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClasses}
      style={style}
    >
      <div className="flex items-center w-full">
        {/* Icon/Image container with fixed size */}
        {props.image && (
          <div className="flex-shrink-0 mr-3">
            <Image
              className="rounded-full"
              alt={props.title}
              src={props.image}
              width={32}
              height={32}
            />
          </div>
        )}

        {/* Favicon */}
        {props.showFavicon !== false && props.showFavicon !== undefined && (
          <div className="flex-shrink-0 w-6 h-6 overflow-hidden rounded-full">
            <img
              src={faviconUrl}
              alt={apexDomain}
              width={24}
              height={24}
              className="object-contain w-full h-full"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/icons/link.svg';
              }}
            />
          </div>
        )}

        {/* Text container that fills available space - Apply typography styles */}
        <h2
          style={{
            color: props.theme.accent,
            fontWeight: 'var(--heading-weight, 600)',
            fontFamily: 'inherit',
          }}
          className="w-full text-base text-center md:text-lg"
        >
          {props.title}
        </h2>
      </div>
    </a>

    {/* NSFW Waring Popup */}
    {showNSFWWarning && (
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50'>
        <div className='w-full max-w-sm p-6 text-center bg-white rounded-lg shadow-lg'>
          <h3 className='mb-4 text-lg font-semibold'>
            NSFW Warning
          </h3>
          <p className='mb-4'>
            This link may contain sensitive or not safe for work content.
            Continue Anyway?
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={handleAcceptNSFW} 
              className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
            >
              Yes, Continue
            </button>
            <button 
              onClick={handleDeclineNSFW} 
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              No, Go Back
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default LinkCard;
