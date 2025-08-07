import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import Image from 'next/image';
import closeSVG from '@/public/close_button.svg';
import { isValidUrl, signalIframe } from '@/utils/helpers';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useCurrentUser from '@/hooks/useCurrentUser';
import useLinks from '@/hooks/useLinks';
import useSections from '@/hooks/useSections';
import * as Switch from '@radix-ui/react-switch';
import TooltipWrapper from '@/components/utils/tooltip';

const AddLinkModal = ({ selectedSectionId = null }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [isSocial, setIsSocial] = useState(false);
  const [showFavicon, setShowFavicon] = useState(true); // Default to true
  const [sectionId, setSectionId] = useState(selectedSectionId);
  const [urlError, setUrlError] = useState(false);

  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?.id ?? null;
  const { data: userLinks } = useLinks(userId);
  const { data: userSections } = useSections(userId);

  const queryClient = useQueryClient();

  const order = userLinks?.length;

  const addLinkMutation = useMutation(
    async ({ title, url, order, isSocial, sectionId, showFavicon }) => {
      // Add console log for debugging
      console.log('Adding link with data:', {
        title,
        url,
        order,
        isSocial: isSocial === true ? 'true' : 'false',
        sectionId,
        showFavicon: showFavicon === true ? 'true' : 'false',
      });

      await axios.post('/api/links', {
        title,
        url,
        order,
        isSocial,
        sectionId,
        showFavicon,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['links', userId] });
        queryClient.invalidateQueries({ queryKey: ['sections', userId] });
        setTitle('');
        setUrl('');
        setIsSocial(false);
        setShowFavicon(true);
        setSectionId(selectedSectionId);
        signalIframe();
      },
    }
  );

  const submitLink = async () => {
    if (title.trim() === '' || url.trim() === '') {
      toast.error('Please fill the form');
      return;
    }
    await toast.promise(
      addLinkMutation.mutateAsync({
        title,
        url,
        order,
        isSocial,
        showFavicon,
        sectionId: sectionId || null,
      }),
      {
        loading: 'Adding link',
        success: 'Link added successfully',
        error: 'An error occured',
      }
    );
  };

  const handleUrlChange = (event) => {
    const urlValue = event.target.value;
    const URL = isValidUrl(urlValue);

    setUrl(urlValue);
    setUrlError(!URL);
  };

  return (
    <>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 w-full bg-gray-800 bg-opacity-50 backdrop-blur-sm" />
        <Dialog.Content className="contentShow fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 sm:p-8 lg:max-w-3xl w-[350px] sm:w-[500px] shadow-lg md:max-w-lg max-md:max-w-lg focus:outline-none">
          <div className="flex flex-row items-center justify-between mb-4">
            <Dialog.Title className="mb-2 text-xl font-medium text-center sm:mb-0 sm:mr-4">
              Create a new Link
            </Dialog.Title>
            <Dialog.Close className="flex justify-end flex-end">
              <div className="flex items-center justify-center p-2 bg-gray-100 rounded-full hover:bg-gray-300">
                <Image priority src={closeSVG} alt="close" />
              </div>
            </Dialog.Close>
          </div>
          <form name="add-link-form" className="mb-6">
            <div className="relative mb-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full h-10 px-4 py-6 mb-2 leading-tight text-gray-700 border appearance-none rounded-2xl focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Title"
              />
            </div>
            <div className="relative">
              <input
                value={url}
                onChange={handleUrlChange}
                className={`block w-full h-10 px-4 py-6 mb-2 leading-tight text-gray-700 border rounded-2xl appearance-none focus:outline-none ${urlError ? 'border-red-500' : 'focus:shadow-outline'
                  }`}
                id="url"
                type="url"
                placeholder="URL"
              />
              {urlError && (
                <small className="text-sm text-red-500">
                  Enter a valid URL (ex: https://hello.com)
                </small>
              )}
            </div>

            {/* Section Selection */}
            {userSections && userSections.length > 0 && (
              <div className="relative mb-4">
                <select
                  value={sectionId || ''}
                  onChange={(e) => setSectionId(e.target.value || null)}
                  className="block w-full h-12 px-4 py-3 leading-tight text-gray-700 bg-white border appearance-none rounded-2xl focus:outline-none focus:shadow-outline"
                >
                  <option value="">No Section (General Links)</option>
                  {userSections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="relative flex justify-between gap-2 p-2 my-4 text-gray-800">
              <TooltipWrapper
                title="Twitter, Instagram, LinkedIn, etc"
                component={
                  <h3 className="text-md lg:text-lg">
                    Add as a social media link?
                  </h3>
                }
              />
              <Switch.Root
                checked={isSocial}
                onCheckedChange={() => setIsSocial(!isSocial)}
                className="w-[39px] h-[21px] bg-[#E4E4E7] rounded-full relative focus:shadow-black border border-slate-200 data-[state=checked]:bg-slate-900 outline-none cursor-default lg:w-[42px] lg:h-[25px]"
              >
                <Switch.Thumb className="block w-[17px] h-[17px] bg-white rounded-full shadow-[0_2px_2px] transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px] lg:w-[21px] lg:h-[21px]" />
              </Switch.Root>
            </div>

            {/* Add show favicon toggle */}
            <div className="relative flex justify-between gap-2 p-2 my-4 text-gray-800">
              <div>
                <h3 className="text-md lg:text-lg">Show website icon (Coming Soon)</h3>
                <p className="text-xs text-gray-500">
                  Display the website's favicon next to the link title
                  <br />NOTE: this option is currently true by default.
                </p>
              </div>
              <Switch.Root
                checked={showFavicon}
                onCheckedChange={() => setShowFavicon(!showFavicon)}
                className="w-[39px] h-[21px] bg-[#E4E4E7] rounded-full relative focus:shadow-black border border-slate-200 data-[state=checked]:bg-slate-900 outline-none cursor-default lg:w-[42px] lg:h-[25px]"
                disabled
              >
                <Switch.Thumb className="block w-[17px] h-[17px] bg-white rounded-full shadow-[0_2px_2px] transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px] lg:w-[21px] lg:h-[21px]" disabled />
              </Switch.Root>
            </div>

            <Dialog.Close asChild>
              <button
                onClick={submitLink}
                disabled={urlError}
                className={`inline-block w-full px-4 py-4 leading-none 
                     			 text-lg mt-2 text-white rounded-3xl 
                      			${!urlError
                    ? 'bg-slate-800 hover:bg-slate-900'
                    : 'bg-slate-500'
                  }`}
              >
                Create Link{' '}
                <span role="img" aria-label="sparkling star">
                  ✨
                </span>
              </button>
            </Dialog.Close>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </>
  );
};

export default AddLinkModal;
