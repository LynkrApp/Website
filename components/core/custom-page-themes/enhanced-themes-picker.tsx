import { useEffect, useState } from 'react';
import {
  themes,
  imageThemes,
  gradientThemes,
  patternThemes,
  typographyThemes,
  layoutThemes,
  animatedThemes,
  buttonStyles,
} from '@/utils/themes';
import { CheckMark } from '@/components/utils/checkmark';
import useCurrentUser from '@/hooks/useCurrentUser';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signalIframe } from '@/utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';
import OgImageEditor from '../og-customizer/og-image-editor';

const EnhancedThemesPicker = () => {
  const { data: currentUser } = useCurrentUser();
  const [activeTab, setActiveTab] = useState('colors');
  const [showAll, setShowAll] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedTypography, setSelectedTypography] = useState(null);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [selectedButtonStyle, setSelectedButtonStyle] = useState(null);

  const themeFromDB = currentUser?.themePalette?.name;
  const queryClient = useQueryClient();

  useEffect(() => {
    // Load theme from database
    const dbTheme = currentUser?.themePalette;
    const dbTypography = currentUser?.typographyTheme;
    const dbLayout = currentUser?.layoutTheme;
    const dbButtonStyle = currentUser?.buttonStyleTheme;

    // Set main theme (colors, gradients, images, patterns, animated)
    if (dbTheme?.name) {
      const allMainThemes = [
        ...themes,
        ...imageThemes,
        ...gradientThemes,
        ...patternThemes,
        ...animatedThemes,
      ];
      const theme = allMainThemes.find((t) => t.name === dbTheme.name);
      if (theme) setSelectedTheme(theme);
    }

    // Set typography theme
    if (dbTypography?.name) {
      const typography = typographyThemes.find(
        (t) => t.name === dbTypography.name
      );
      if (typography) setSelectedTypography(typography);
    }

    // Set layout theme
    if (dbLayout?.name) {
      const layout = layoutThemes.find((t) => t.name === dbLayout.name);
      if (layout) setSelectedLayout(layout);
    }

    // Set button style theme
    if (dbButtonStyle?.name) {
      const buttonStyle = buttonStyles.find(
        (t) => t.name === dbButtonStyle.name
      );
      if (buttonStyle) setSelectedButtonStyle(buttonStyle);
    } else if (currentUser?.buttonStyle) {
      // Handle legacy button styles
      const legacyButtonStyle = buttonStyles.find(
        (t) => t.css === currentUser.buttonStyle
      );
      if (legacyButtonStyle) setSelectedButtonStyle(legacyButtonStyle);
    }
  }, [currentUser]);

  const getCurrentThemes = () => {
    switch (activeTab) {
      case 'images':
        return showAll ? imageThemes : imageThemes.slice(0, 6);
      case 'gradients':
        return showAll ? gradientThemes : gradientThemes.slice(0, 6);
      case 'patterns':
        return showAll ? patternThemes : patternThemes.slice(0, 6);
      case 'animated':
        return showAll ? animatedThemes : animatedThemes.slice(0, 6);
      case 'typography':
        return typographyThemes;
      case 'layouts':
        return layoutThemes;
      case 'buttons':
        return buttonStyles;
      default:
        return showAll ? themes : themes.slice(0, 9);
    }
  };

  const getMaxInitialThemes = () => {
    switch (activeTab) {
      case 'images':
      case 'gradients':
      case 'patterns':
      case 'animated':
        return 6;
      case 'typography':
      case 'layouts':
      case 'buttons':
        return 50; // Show all for these categories
      default:
        return 9;
    }
  };

  const mutateTheme = useMutation(
    async (theme: any) => {
      const updateData: any = {};

      // Determine which field to update based on theme type
      if (theme.type === 'typography') {
        updateData.typographyTheme = theme;
      } else if (theme.type === 'layout') {
        updateData.layoutTheme = theme;
      } else if (theme.type === 'button') {
        updateData.buttonStyleTheme = theme;
        // Also update legacy buttonStyle field for backwards compatibility
        if (theme.css) {
          updateData.buttonStyle = theme.css;
        }
      } else {
        // Color, gradient, image, pattern, animated themes go to themePalette
        updateData.themePalette = theme;
      }

      await axios.patch('/api/customize', updateData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        signalIframe();
      },
    }
  );

  const handleThemeSelect = async (theme: any) => {
    const loadingMessage = `Applying ${theme.type === 'typography' ? 'typography' : theme.type === 'layout' ? 'layout' : theme.type === 'button' ? 'button style' : 'theme'}...`;
    const successMessage = `${theme.type === 'typography' ? 'Typography' : theme.type === 'layout' ? 'Layout' : theme.type === 'button' ? 'Button style' : 'Theme'} applied successfully!`;

    await toast.promise(mutateTheme.mutateAsync(theme), {
      loading: loadingMessage,
      success: successMessage,
      error: 'Failed to apply changes',
    });

    // Update local state based on theme type
    if (theme.type === 'typography') {
      setSelectedTypography(theme);
    } else if (theme.type === 'layout') {
      setSelectedLayout(theme);
    } else if (theme.type === 'button') {
      setSelectedButtonStyle(theme);
    } else {
      setSelectedTheme(theme);
    }

    localStorage.setItem(
      `selected${theme.type === 'typography' ? 'Typography' : theme.type === 'layout' ? 'Layout' : theme.type === 'button' ? 'ButtonStyle' : 'Theme'}`,
      theme.name
    );
  };

  const renderThemeCard = (theme) => {
    // Pattern themes
    if (theme.type === 'pattern') {
      return (
        <motion.div
          key={theme.name}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`rounded-2xl overflow-hidden cursor-pointer relative duration-200 w-full border-2 ${
            selectedTheme?.name === theme.name
              ? 'border-blue-500 ring-2 ring-blue-200'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handleThemeSelect(theme)}
        >
          <div
            className="h-24 md:h-28"
            style={{
              backgroundColor: theme.backgroundColor,
              backgroundImage: theme.backgroundImage,
              backgroundSize: theme.backgroundSize || 'auto',
            }}
          />
          <span className="absolute z-10 px-2 py-1 text-xs font-medium text-white rounded top-2 left-2 bg-black/60">
            {theme.name}
          </span>
          {selectedTheme?.name === theme.name && (
            <span className="absolute z-10 text-white top-2 right-2">
              <CheckMark />
            </span>
          )}
        </motion.div>
      );
    }

    // Animated themes
    if (theme.type === 'animated') {
      return (
        <motion.div
          key={theme.name}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`rounded-2xl overflow-hidden cursor-pointer relative duration-200 w-full border-2 ${
            selectedTheme?.name === theme.name
              ? 'border-blue-500 ring-2 ring-blue-200'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handleThemeSelect(theme)}
        >
          <div
            className="relative h-24 md:h-28"
            style={{
              backgroundColor: theme.backgroundColor,
              backgroundImage: theme.backgroundImage,
              backgroundSize: theme.backgroundSize || 'auto',
            }}
          >
            {/* Animation indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm"
              />
            </div>
          </div>
          <span className="absolute z-10 px-2 py-1 text-xs font-medium text-white rounded top-2 left-2 bg-black/60">
            {theme.name}
          </span>
          {selectedTheme?.name === theme.name && (
            <span className="absolute z-10 text-white top-2 right-2">
              <CheckMark />
            </span>
          )}
        </motion.div>
      );
    }

    // Typography themes
    if (theme.type === 'typography') {
      return (
        <motion.div
          key={theme.name}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`p-4 rounded-2xl cursor-pointer relative duration-200 w-full border-2 bg-white ${
            selectedTypography?.name === theme.name
              ? 'border-blue-500 ring-2 ring-blue-200'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handleThemeSelect(theme)}
        >
          <div style={{ fontFamily: theme.fontFamily }}>
            <h3
              className="mb-2 text-lg"
              style={{
                fontWeight: theme.headingWeight,
                letterSpacing: theme.letterSpacing,
              }}
            >
              {theme.name}
            </h3>
            <p
              className="text-sm text-gray-600"
              style={{
                fontWeight: theme.bodyWeight,
                lineHeight: theme.lineHeight,
              }}
            >
              Sample text preview
            </p>
          </div>
          {selectedTypography?.name === theme.name && (
            <span className="absolute text-blue-500 top-2 right-2">
              <CheckMark />
            </span>
          )}
        </motion.div>
      );
    }

    // Layout themes
    if (theme.type === 'layout') {
      return (
        <motion.div
          key={theme.name}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`p-4 rounded-2xl cursor-pointer relative duration-200 w-full border-2 bg-gray-50 ${
            selectedLayout?.name === theme.name
              ? 'border-blue-500 ring-2 ring-blue-200'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handleThemeSelect(theme)}
        >
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900">{theme.name}</h3>
            <div
              className={`space-y-1 ${theme.containerWidth === 'max-w-sm' ? 'max-w-16' : theme.containerWidth === 'max-w-lg' ? 'max-w-20' : 'max-w-24'}`}
            >
              <div
                className={`h-2 bg-gray-300 rounded ${theme.cardStyle === 'pill' ? 'rounded-full' : theme.cardStyle === 'minimal' ? 'rounded-sm' : 'rounded'}`}
              />
              <div
                className={`h-2 bg-gray-300 rounded ${theme.cardStyle === 'pill' ? 'rounded-full' : theme.cardStyle === 'minimal' ? 'rounded-sm' : 'rounded'}`}
              />
              <div
                className={`h-2 bg-gray-300 rounded ${theme.cardStyle === 'pill' ? 'rounded-full' : theme.cardStyle === 'minimal' ? 'rounded-sm' : 'rounded'}`}
              />
            </div>
            <div className="text-xs text-gray-500">
              {theme.alignment} • {theme.spacing}
            </div>
          </div>
          {selectedLayout?.name === theme.name && (
            <span className="absolute text-blue-500 top-2 right-2">
              <CheckMark />
            </span>
          )}
        </motion.div>
      );
    }

    // Button styles
    if (theme.type === 'button') {
      return (
        <motion.div
          key={theme.name}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`p-4 rounded-2xl cursor-pointer relative duration-200 w-full border-2 bg-white ${
            selectedButtonStyle?.name === theme.name
              ? 'border-blue-500 ring-2 ring-blue-200'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handleThemeSelect(theme)}
        >
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">{theme.name}</h3>
            <button
              className={`
                bg-blue-500 text-white text-sm pointer-events-none
                ${theme.shadow || ''}
                ${theme.background || ''}
                ${theme.border || ''}
              `}
              style={{
                borderRadius: theme.borderRadius,
                padding: theme.padding,
              }}
            >
              Sample Button
            </button>
          </div>
          {selectedButtonStyle?.name === theme.name && (
            <span className="absolute text-blue-500 top-2 right-2">
              <CheckMark />
            </span>
          )}
        </motion.div>
      );
    }

    // Default handling for existing themes (image, gradient, color)
    if (theme.type === 'image') {
      return (
        <motion.div
          key={theme.name}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`rounded-2xl overflow-hidden cursor-pointer relative duration-200 w-full border-2 ${
            selectedTheme?.name === theme.name
              ? 'border-blue-500 ring-2 ring-blue-200'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handleThemeSelect(theme)}
        >
          <div
            className="relative h-24 bg-center bg-cover md:h-28"
            style={{ backgroundImage: `url(${theme.backgroundImage})` }}
          >
            <div
              className="absolute inset-0"
              style={{ backgroundColor: theme.overlay }}
            />
          </div>
          <span className="absolute z-10 px-2 py-1 text-xs font-medium text-white rounded top-2 left-2 bg-black/60">
            {theme.name}
          </span>
          {selectedTheme?.name === theme.name && (
            <span className="absolute z-10 text-white top-2 right-2">
              <CheckMark />
            </span>
          )}
        </motion.div>
      );
    }

    if (theme.type === 'gradient') {
      return (
        <motion.div
          key={theme.name}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`rounded-2xl overflow-hidden cursor-pointer relative duration-200 w-full border-2 ${
            selectedTheme?.name === theme.name
              ? 'border-blue-500 ring-2 ring-blue-200'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handleThemeSelect(theme)}
        >
          <div
            className="h-24 md:h-28"
            style={{ backgroundImage: theme.backgroundImage }}
          />
          <span className="absolute z-10 px-2 py-1 text-xs font-medium text-white rounded top-2 left-2 bg-black/60">
            {theme.name}
          </span>
          {selectedTheme?.name === theme.name && (
            <span className="absolute z-10 text-white top-2 right-2">
              <CheckMark />
            </span>
          )}
        </motion.div>
      );
    }

    // Default color theme
    return (
      <motion.div
        key={theme.name}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`rounded-2xl overflow-hidden cursor-pointer relative duration-200 w-full border-2 ${
          selectedTheme?.name === theme.name
            ? 'border-blue-500 ring-2 ring-blue-200'
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => handleThemeSelect(theme)}
      >
        <div className="grid h-24 grid-cols-4 md:h-28">
          {theme.palette.map((color, index) => (
            <div key={index} className="h-full" style={{ background: color }} />
          ))}
        </div>
        <span
          style={{ color: theme.palette[2] }}
          className="absolute z-10 text-xs top-2 left-2"
        >
          {theme.name}
        </span>
        {selectedTheme?.name === theme.name && (
          <span className="absolute z-10 top-2 right-2">
            <CheckMark />
          </span>
        )}
      </motion.div>
    );
  };

  const tabConfig = [
    { key: 'colors', label: 'Colors', icon: '🎨' },
    { key: 'gradients', label: 'Gradients', icon: '🌈' },
    { key: 'images', label: 'Images', icon: '🖼️' },
    { key: 'patterns', label: 'Patterns', icon: '⚡' },
    { key: 'animated', label: 'Animated', icon: '✨' },
    { key: 'typography', label: 'Typography', icon: '✍️' },
    { key: 'layouts', label: 'Layouts', icon: '📐' },
    { key: 'buttons', label: 'Buttons', icon: '🔘' },
    { key: 'og', label: 'Meta Image', icon: '🔗' },
  ];

  return (
    <div className="max-w-[640px] mx-auto my-6">
      <h3 className="mb-4 text-xl font-semibold">Customize Your Profile</h3>

      {/* Enhanced Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabConfig.map((tab) => (
          <button
            key={tab.key}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => {
              setActiveTab(tab.key);
              setShowAll(false);
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Theme Grid or OG Image Editor */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'og' ? (
            <OgImageEditor />
          ) : (
            <div
              className={`grid gap-4 p-4 mx-auto my-4 overflow-y-auto bg-white rounded-2xl ${
                ['typography', 'layouts', 'buttons'].includes(activeTab)
                  ? 'grid-cols-1 md:grid-cols-2'
                  : 'grid-cols-2 lg:grid-cols-3'
              } auto-rows-max md:gap-6`}
            >
              {getCurrentThemes()?.map((theme) => renderThemeCard(theme))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Show More/Less Buttons */}
      {activeTab !== 'og' &&
        getCurrentThemes().length >= getMaxInitialThemes() &&
        !showAll &&
        !['typography', 'layouts', 'buttons'].includes(activeTab) && (
          <button
            className="block px-6 py-3 mx-auto mt-4 font-medium text-white transition-colors duration-200 bg-blue-600 rounded-xl hover:bg-blue-700"
            onClick={() => setShowAll(true)}
          >
            Show More
          </button>
        )}
      {activeTab !== 'og' &&
        showAll &&
        getCurrentThemes().length > getMaxInitialThemes() && (
          <button
            className="block px-6 py-3 mx-auto mt-4 font-medium text-white transition-colors duration-200 bg-gray-600 rounded-xl hover:bg-gray-700"
            onClick={() => setShowAll(false)}
          >
            Show Less
          </button>
        )}
    </div>
  );
};

export default EnhancedThemesPicker;
