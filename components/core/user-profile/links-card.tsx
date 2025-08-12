/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import { getApexDomain } from '@/utils/helpers';
import { GOOGLE_FAVICON_URL } from '@/utils/constants';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { IoWarning, IoShieldCheckmark } from 'react-icons/io5';

const Warning = IoWarning as React.ComponentType<React.SVGProps<SVGSVGElement>>;

const ShieldCheckmark = IoShieldCheckmark as React.ComponentType<
  React.SVGProps<SVGSVGElement>
>;

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
  };

  const handleAcceptNSFW = () => {
    setShowNSFWWarning(false);
    window.open(pendingURL, '_blank', 'noopener,noreferrer');
    setPendingURL(null);
  };

  const handleDeclineNSFW = () => {
    setShowNSFWWarning(false);
    setPendingURL(null);
  };

  const onConfirm = handleAcceptNSFW;
  const onClose = handleDeclineNSFW;

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
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 z-40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-3"
                >
                  <Warning className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white">
                  Adult Content Warning
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="text-center space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    This Profile Contains 18+ Content
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    This profile may contain explicit adult content, nudity,
                    sexual themes, or other material intended for mature
                    audiences only.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-800">
                      <strong>Age Verification Required:</strong> You must be 18
                      years or older to view this content. By continuing, you
                      confirm that you meet this requirement.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onConfirm}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg"
                  >
                    <ShieldCheckmark className="w-5 h-5" />
                    I'm 18+, Continue
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200 border border-gray-300"
                  >
                    Go Back
                  </motion.button>
                </div>

                <p className="text-xs text-gray-500 text-center pt-2 border-t border-gray-100">
                  By proceeding, you acknowledge that you are of legal age and
                  consent to viewing adult content.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default LinkCard;
