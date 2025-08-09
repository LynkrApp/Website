import { useState, useEffect } from 'react';
import { FontsModal } from '@/components/shared/modals/fonts-modal';
import * as Dialog from '@radix-ui/react-dialog';
import useCurrentUser from '@/hooks/useCurrentUser';
import { typographyThemes } from '@/utils/themes';

const FontPicker = () => {
  const { data: currentUser } = useCurrentUser();
  const [selectedFont, setSelectedFont] = useState('');

  useEffect(() => {
    if (currentUser?.typographyTheme?.name) {
      setSelectedFont(currentUser.typographyTheme.name);
    }
  }, [currentUser]);

  const handleFontSelect = (font) => {
    setSelectedFont(font);
  };

  // Get the current typography theme object
  const currentTheme = typographyThemes.find(theme => theme.name === selectedFont) || typographyThemes[0];

  return (
    <>
      <div className="max-w-[640px] mx-auto my-10">
        <h3 className="text-xl font-semibold">Typography</h3>
        <div className="mt-4 rounded-2xl border bg-white p-6 w-full h-auto">
          <h4 className="mb-4 text-sm font-semibold">Font Family</h4>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button className="w-full transition-colors group rounded-lg border border-gray-200 bg-white hover:bg-gray-50 ring-inset ring-black drop-shadow-sm">
                <div className="p-4 flex flex-wrap gap-4 items-center">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-lg"
                    style={{
                      fontFamily: currentTheme.fontFamily,
                      fontWeight: currentTheme.headingWeight
                    }}
                  >
                    Aa
                  </div>
                  <div className="flex flex-grow flex-col justify-center text-left">
                    <span className="font-medium">{selectedFont || 'Select a font'}</span>
                    <span
                      className="text-sm text-gray-500 mt-1"
                      style={{
                        fontFamily: currentTheme.fontFamily
                      }}
                    >
                      The quick brown fox jumps over the lazy dog
                    </span>
                  </div>
                </div>
              </button>
            </Dialog.Trigger>
            <FontsModal onSelectFont={handleFontSelect} />
          </Dialog.Root>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="mb-2 text-sm font-semibold">Heading Weight</h4>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p
                  className="text-lg"
                  style={{
                    fontFamily: currentTheme.fontFamily,
                    fontWeight: currentTheme.headingWeight
                  }}
                >
                  Heading Text Example
                </p>
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold">Body Weight</h4>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p
                  className="text-base"
                  style={{
                    fontFamily: currentTheme.fontFamily,
                    fontWeight: currentTheme.bodyWeight,
                    lineHeight: currentTheme.lineHeight
                  }}
                >
                  Body text example with the selected font family.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Fonts are loaded from Google Fonts and will be applied to your profile page.
          </div>
        </div>
      </div>
    </>
  );
};

export default FontPicker;
