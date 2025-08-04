import Image from 'next/image';

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
    ...(buttonStyleTheme?.padding && { padding: buttonStyleTheme.padding }),
  };

  // Combine legacy and new button classes
  const buttonClasses = `
    flex items-center justify-center transition-all border mb-3 w-full max-w-md mx-auto lg:p-1 lg:mb-6
    ${props.buttonStyle || ''}
    ${buttonStyleTheme?.shadow || ''}
    ${buttonStyleTheme?.hover || 'hover:scale-105'}
    ${buttonStyleTheme?.transition || 'transition-all'}
  `.trim();

  return (
    <a
      href={props.url}
      onClick={props.registerClicks}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClasses}
      style={style}
    >
      <div className="flex text-center w-full">
        <div className="w-10 h-10">
          {props.image && (
            <Image
              className="rounded-full"
              alt={props.title}
              src={props.image}
              width={40}
              height={40}
            />
          )}
        </div>
        <h2
          style={{ color: props.theme.accent }}
          className="text-[13px] flex justify-center items-center font-semibold w-full text-gray-700 -ml-10 lg:text-lg"
        >
          {props.title}
        </h2>
      </div>
    </a>
  );
};

export default LinkCard;
