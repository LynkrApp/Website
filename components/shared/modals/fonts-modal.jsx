import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import closeSVG from '@/public/close_button.svg';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { typographyThemes } from '@/utils/themes';

export const FontsModal = ({ onSelectFont }) => {
  const [selectedFont, setSelectedFont] = useState('');
  const queryClient = useQueryClient();

  // Apply font mutation
  const mutateFont = useMutation(
    async (fontName) => {
      // Find the theme object from our predefined themes
      const selectedTheme = typographyThemes.find(
        (theme) => theme.name === fontName
      );
      if (!selectedTheme) return;

      await axios.patch('/api/customize', {
        typographyTheme: selectedTheme,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        toast.success('Font applied successfully!');
        // Add iframe signal if needed
      },
      onError: () => {
        toast.error('Failed to apply font');
      },
    }
  );

  const handleFontSelect = (fontName) => {
    setSelectedFont(fontName);
  };

  const handleSave = () => {
    if (selectedFont) {
      mutateFont.mutate(selectedFont);
      if (onSelectFont) onSelectFont(selectedFont);
    }
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 backdrop-blur-sm bg-gray-800 bg-opacity-50 sm:w-full">
        <Dialog.Content className="contentShow fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 sm:p-8 lg:max-w-3xl w-[350px] sm:w-[500px] shadow-lg md:max-w-lg max-md:max-w-lg focus:outline-none">
          <div className="flex flex-row justify-between items-center mb-4">
            <Dialog.Title className="text-xl text-center font-medium mb-2 sm:mb-0 sm:mr-4">
              Select a font
            </Dialog.Title>
            <Dialog.Close className="flex flex-end justify-end">
              <div className="p-2 rounded-full flex justify-center items-center bg-gray-100 hover:bg-gray-300">
                <Image priority src={closeSVG} alt="close" />
              </div>
            </Dialog.Close>
          </div>
          <div className="p-4 overflow-auto mb-4">
            <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
              {typographyThemes.map((font) => (
                <button
                  key={font.name}
                  className={`rounded-lg p-4 transition-colors ${selectedFont === font.name
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-100'
                    }`}
                  onClick={() => handleFontSelect(font.name)}
                  style={{
                    fontFamily: font.fontFamily,
                    letterSpacing: font.letterSpacing,
                  }}
                >
                  <h3
                    className="text-lg"
                    style={{ fontWeight: font.headingWeight }}
                  >
                    {font.name}
                  </h3>
                  <p
                    className="text-sm text-gray-600"
                    style={{
                      fontWeight: font.bodyWeight,
                      lineHeight: font.lineHeight,
                    }}
                  >
                    The quick brown fox jumps over the lazy dog.
                  </p>
                </button>
              ))}
            </div>
          </div>
          <Dialog.Close asChild>
            <button
              className="inline-block w-full px-4 py-4 leading-none text-lg my-4 
                        text-white rounded-3xl bg-slate-900"
              onClick={handleSave}
              disabled={mutateFont.isLoading}
            >
              {mutateFont.isLoading ? 'Applying...' : 'Apply Font ✨'}
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  );
};
