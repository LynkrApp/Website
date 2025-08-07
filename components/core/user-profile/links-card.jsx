/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import { getApexDomain } from '@/utils/helpers';
import { GOOGLE_FAVICON_URL } from '@/utils/constants';

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
    ...(buttonStyleTheme?.borderRadius && { borderRadius: buttonStyleTheme.borderRadius }),
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

  return (
    <a
      href={props.url}
      onClick={props.registerClicks}
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
                // Fallback to a default icon if favicon fails to load
                e.target.src = '/icons/link.svg';
              }}
            />
          </div>
        )}

        {/* Text container that fills available space - Apply typography styles */}
        <h2
          style={{
            color: props.theme.accent,
            fontWeight: 'var(--heading-weight, 600)',
            fontFamily: 'inherit'
          }}
          className="w-full text-base text-center md:text-lg"
        >
          {props.title}
        </h2>
      </div>
    </a>
  );
};

export default LinkCard;
