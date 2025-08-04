import { useEffect, useState } from 'react';
import { themes, imageThemes, gradientThemes } from '@/utils/themes';
import { CheckMark } from '@/components/utils/checkmark';
import useCurrentUser from '@/hooks/useCurrentUser';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signalIframe } from '@/utils/helpers';

const ThemesPicker = () => {
  const { data: currentUser } = useCurrentUser();
  const [activeTab, setActiveTab] = useState('colors');
  const [displayedThemes, setDisplayedThemes] = useState(themes.slice(0, 9));
  const [showAll, setShowAll] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const themeFromDB = currentUser?.themePalette.name;

  const queryClient = useQueryClient();

  useEffect(() => {
    const storedTheme = themeFromDB
      ? themeFromDB
      : localStorage.getItem('selectedTheme');
    if (storedTheme) {
      const allThemes = [...themes, ...imageThemes, ...gradientThemes];
      const theme = allThemes.find((t) => t.name === storedTheme);
      if (theme) {
        setSelectedTheme(theme);
      }
    }
  }, [themeFromDB]);

  const getCurrentThemes = () => {
    switch (activeTab) {
      case 'images':
        return showAll ? imageThemes : imageThemes.slice(0, 6);
      case 'gradients':
        return showAll ? gradientThemes : gradientThemes.slice(0, 6);
      default:
        return showAll ? themes : themes.slice(0, 9);
    }
  };

  const getMaxInitialThemes = () => {
    switch (activeTab) {
      case 'images':
      case 'gradients':
        return 6;
      default:
        return 9;
    }
  };

  const handleShowMore = () => {
    setShowAll(true);
  };

  const handleShowLess = () => {
    setShowAll(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowAll(false);
  };

  const mutateTheme = useMutation(
    async (theme) => {
      await axios.patch('/api/customize', {
        themePalette: theme,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        signalIframe();
      },
    }
  );

  const handleThemeSelect = async (theme) => {
    await toast.promise(mutateTheme.mutateAsync(theme), {
      loading: 'Changing theme',
      success: 'New theme applied',
      error: 'An error occured',
    });
    setSelectedTheme(theme);
    localStorage.setItem('selectedTheme', theme.name);
  };

  const renderThemeCard = (theme) => {
    if (theme.type === 'image') {
      return (
        <div
          key={theme.name}
          className={`rounded-2xl overflow-hidden cursor-pointer relative z-0 duration-200 w-full border-2 ${
            selectedTheme === theme
              ? 'border-[2.5px] border-blue-500'
              : 'border-gray-200'
          }`}
          onClick={() => handleThemeSelect(theme)}
        >
          <div 
            className="relative h-24 bg-center bg-cover md:h-28"
            style={{ 
              backgroundImage: `url(${theme.backgroundImage})`,
            }}
          >
            <div 
              className="absolute inset-0"
              style={{ backgroundColor: theme.overlay }}
            />
          </div>
          <span className="absolute z-10 px-2 py-1 text-xs font-medium text-white rounded top-2 left-2 bg-black/50">
            {theme.name}
          </span>
          {selectedTheme === theme && (
            <span className="absolute z-10 text-white top-2 right-2">
              <CheckMark />
            </span>
          )}
        </div>
      );
    }

    if (theme.type === 'gradient') {
      return (
        <div
          key={theme.name}
          className={`rounded-2xl overflow-hidden cursor-pointer relative z-0 duration-200 w-full border-2 ${
            selectedTheme === theme
              ? 'border-[2.5px] border-blue-500'
              : 'border-gray-200'
          }`}
          onClick={() => handleThemeSelect(theme)}
        >
          <div 
            className="h-24 md:h-28"
            style={{ 
              backgroundImage: theme.backgroundImage,
            }}
          />
          <span className="absolute z-10 px-2 py-1 text-xs font-medium text-white rounded top-2 left-2 bg-black/50">
            {theme.name}
          </span>
          {selectedTheme === theme && (
            <span className="absolute z-10 text-white top-2 right-2">
              <CheckMark />
            </span>
          )}
        </div>
      );
    }

    // Default color theme
    return (
      <div
        key={theme.name}
        className={`rounded-2xl overflow-hidden cursor-pointer relative z-0 duration-200 w-full border-2 ${
          selectedTheme === theme
            ? 'border-[2.5px] border-blue-500'
            : 'border-primary'
        }`}
        onClick={() => handleThemeSelect(theme)}
      >
        <div className="grid h-24 grid-cols-4 md:h-28">
          {theme.palette.map((color, index) => (
            <div
              key={index}
              className="h-full"
              style={{ background: color }}
            />
          ))}
        </div>
        <span
          style={{ color: theme.palette[2] }}
          className="absolute z-10 text-xs top-2 left-2 text-base-content/80"
        >
          {theme.name}
        </span>
        {selectedTheme === theme && (
          <span
            style={{ color: theme.palette[0] }}
            className="absolute z-10 text-xs top-2 right-2 text-base-content/80"
          >
            <CheckMark />
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="max-w-[640px] mx-auto my-6">
        <h3 className="text-xl font-semibold">Themes</h3>
        
        {/* Tab Navigation */}
        <div className="flex mb-4 border-b border-gray-200">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'colors'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange('colors')}
          >
            Colors
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'gradients'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange('gradients')}
          >
            Gradients
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'images'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange('images')}
          >
            Images
          </button>
        </div>

        <div className="grid w-full max-w-md grid-cols-2 gap-4 p-4 mx-auto my-4 overflow-y-auto bg-white lg:grid-cols-3 rounded-2xl auto-rows-max md:gap-6 md:max-w-2xl lg:max-w-3xl md:basis-3/5">
          {getCurrentThemes()?.map((theme) => renderThemeCard(theme))}
        </div>
        
        {getCurrentThemes().length >= getMaxInitialThemes() && !showAll && (
          <button
            className="block px-4 py-2 mx-auto mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-800"
            onClick={handleShowMore}
          >
            Show More
          </button>
        )}
        {showAll && getCurrentThemes().length > getMaxInitialThemes() && (
          <button
            className="block px-4 py-2 mx-auto mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-800"
            onClick={handleShowLess}
          >
            Show Less
          </button>
        )}
      </div>
    </>
  );
};

export default ThemesPicker;
