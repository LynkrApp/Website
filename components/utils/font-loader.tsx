import { useEffect } from 'react';
import Head from 'next/head';

// Map of theme font family to Google Fonts URL
const fontUrlMap = {
    'Inter': 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    'Playfair Display': 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap',
    'JetBrains Mono': 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap',
    'Nunito': 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap',
    'Poppins': 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap',
    'Roboto': 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
    'Montserrat': 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap',
    'Open Sans': 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap',
    'Lato': 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap',
    'Comfortaa': 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700&display=swap',
    'Crimson Text': 'https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&display=swap',
    'Oswald': 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap',
    'Dancing Script': 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap',
    'Source Sans Pro': 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap',
    'Libre Baskerville': 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap',
    'Outfit': 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap',
    'Merriweather': 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap',
    'Space Grotesk': 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap',
    'Work Sans': 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap',
    'Figtree': 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap',
    'EB Garamond': 'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&display=swap',
    'Bebas Neue': 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
    'Cormorant Garamond': 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap',
    'DM Sans': 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap',
};

// Get the primary font name from a fontFamily string
const extractPrimaryFont = (fontFamily) => {
    if (!fontFamily) return null;
    // Extract the first font in the font stack
    const primaryFont = fontFamily.split(',')[0].trim();
    // Remove quotes if present
    return primaryFont.replace(/['",]+/g, '');
};

const FontLoader = ({ typographyTheme }) => {
    if (!typographyTheme || !typographyTheme.fontFamily) {
        return null;
    }

    const primaryFont = extractPrimaryFont(typographyTheme.fontFamily);

    // Find matching font URL in our map
    const fontUrl = Object.entries(fontUrlMap).find(([fontName]) =>
        primaryFont.includes(fontName)
    )?.[1];

    // If we don't have a URL for this font, don't try to load it
    if (!fontUrl) {
        return null;
    }

    // Add global CSS variables for font weights
    const cssVariables = `
        :root {
            --heading-weight: ${typographyTheme.headingWeight || '700'};
            --body-weight: ${typographyTheme.bodyWeight || '400'};
            --letter-spacing: ${typographyTheme.letterSpacing || 'normal'};
            --line-height: ${typographyTheme.lineHeight || 'normal'};
        }
    `;

    return (
        <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href={fontUrl} rel="stylesheet" />
            <style>{cssVariables}</style>
        </Head>
    );
};

export default FontLoader;
