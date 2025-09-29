import { siteConfig } from '@/config/site';
import closeSVG from '@/public/close_button.svg';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import Image from 'next/image';
import { QRCodeCanvas } from 'qrcode.react';
import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import useCurrentUser from '@/hooks/useCurrentUser';
import { getCurrentBaseURL } from '@/utils/helpers';

const ShareModal = () => {
  const { data: currentUser } = useCurrentUser();
  const baseURL = getCurrentBaseURL();
  const userProfileLink = `${baseURL}/${currentUser?.handle}`;

  const [isCopied, setIsCopied] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const goTo = siteConfig.redirects;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(userProfileLink);
    setIsCopied(true);
    toast.success('Copied URL to clipboard!');
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const downloadQRCode = async () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement | null;
    if (!canvas) return;

    try {
      // Create a new canvas to avoid CORS issues
      const newCanvas = document.createElement('canvas');
      const ctx = newCanvas.getContext('2d');
      
      if (!ctx) {
        toast.error('Failed to create canvas context');
        return;
      }

      // Set canvas dimensions
      newCanvas.width = canvas.width;
      newCanvas.height = canvas.height;

      // Draw white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

      // Draw the QR code (this part is safe as it's already rendered)
      ctx.drawImage(canvas, 0, 0);

      // If there's a user image, we need to handle it separately with CORS
      if (currentUser?.image) {
        try {
          // Create a CORS-enabled image
          const img = new window.Image();
          img.crossOrigin = 'anonymous';
          
          // Use a promise to wait for image load
          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              // Calculate center position for the logo
              const logoSize = 40;
              const x = (newCanvas.width - logoSize) / 2;
              const y = (newCanvas.height - logoSize) / 2;
              
              // Draw white background for logo
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10);
              
              // Draw the logo
              ctx.drawImage(img, x, y, logoSize, logoSize);
              resolve();
            };
            
            img.onerror = () => {
              console.warn('Failed to load user image, proceeding without it');
              resolve(); // Continue even if image fails
            };

            // Try to use a proxied version or the original
            img.src = currentUser.image;
          });
        } catch (error) {
          console.warn('Error loading user image:', error);
          // Continue with QR code without the user image
        }
      }

      // Export the canvas
      const pngUrl = newCanvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = currentUser?.handle
        ? `${currentUser.handle}-qr.png`
        : 'qr-code.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast.success('QR Code downloaded successfully!');
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('Failed to download QR Code. Please try again.');
    }
  };

  return (
    <>
      <div>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 backdrop-blur-sm bg-gray-800 bg-opacity-50 sm:w-full" />
          <Dialog.Content
            className="contentShow fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                rounded-2xl bg-white p-6 sm:p-8 lg:max-w-3xl w-[350px] sm:w-[500px] shadow-lg 
                md:max-w-lg max-md:max-w-lg focus:outline-none"
          >
            <div className="flex flex-row justify-between items-center mb-1">
              <Dialog.Title className="text-xl text-center font-medium mb-2 sm:mb-0 sm:mr-4">
                Share your Link
              </Dialog.Title>

              <Dialog.Close className="flex flex-end justify-end">
                <div className="flex justify-center items-center p-2 rounded-full bg-gray-100 hover:bg-gray-300">
                  <Image priority src={closeSVG} alt="close" />
                </div>
              </Dialog.Close>
            </div>

            <Tabs.Root defaultValue="url" className="w-full rounded-md mt-4">
              <Tabs.List className="flex h-10 items-center rounded-md bg-gray-100 p-1 text-slate-900">
                <Tabs.Trigger
                  value="url"
                  className="flex-1 py-1 px-4 rounded-md text-center data-[state=active]:text-slate-900 data-[state=active]:font-medium data-[state=active]:bg-white text-gray-600"
                >
                  URL
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="QR"
                  className="flex-1 py-1 px-4 rounded-md text-center data-[state=active]:text-slate-900 data-[state=active]:font-medium  data-[state=active]:bg-white text-gray-600"
                >
                  QR Code
                </Tabs.Trigger>
              </Tabs.List>

              <div className="p-4">
                <Tabs.Content value="url">
                  <div className="mb-6">
                    <div className="mt-2 mb-4">
                      <p className="text-sm">
                        Add this link to your{' '}
                        <a
                          target="_blank"
                          href={goTo.twitter}
                          className="underline"
                          rel="noopener noreferrer"
                        >
                          Twitter
                        </a>
                        ,{' '}
                        <a
                          target="_blank"
                          href={goTo.instagram}
                          className="underline"
                          rel="noopener noreferrer"
                        >
                          Instagram
                        </a>{' '}
                        or{' '}
                        <a
                          target="_blank"
                          href={goTo.linkedin}
                          className="underline"
                          rel="noopener noreferrer"
                        >
                          LinkedIn
                        </a>{' '}
                        bio{' '}
                        <span aria-label="rocket">
                          to make it accessible from anywhere.
                        </span>
                      </p>
                    </div>
                    <div className="relative mb-4">
                      <div className="flex justify-between items-center w-full h-6 px-4 py-[28px] mb-2 text-gray-700 border-2 rounded-2xl appearance-none focus:outline-none focus:shadow-outline">
                        <h2 className="truncate w-[250px] lg:w-full">
                          {userProfileLink}
                        </h2>
                        <button
                          onClick={handleCopyLink}
                          className="w-[80px] p-[12px] leading-none text-md text-white bg-slate-900 hover:bg-slate-700 rounded-3xl focus:outline-none focus:shadow-outline-blue"
                        >
                          {isCopied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>
                </Tabs.Content>

                <Tabs.Content value="QR">
                  <div ref={qrCodeRef}>
                    <QRCodeCanvas
                      className="mx-auto w-full"
                      id="qr-code"
                      size={256}
                      includeMargin={true}
                      level="H"
                      value={userProfileLink}
                      // Remove imageSettings to avoid CORS issues
                      // The user image will be added during download
                    />
                  </div>

                  <p className="mt-4 text-center text-gray-700">
                    Share this QR code with your audience to provide access to
                    your profile.
                  </p>
                  <button
                    onClick={downloadQRCode}
                    className="mt-4 w-full py-3 px-4 text-center text-white bg-slate-900 hover:bg-slate-700
                      rounded-md focus:outline-none focus:shadow-outline-blue"
                  >
                    Download QR Code
                  </button>
                </Tabs.Content>
              </div>
            </Tabs.Root>
          </Dialog.Content>
        </Dialog.Portal>
      </div>
    </>
  );
};

export default ShareModal;