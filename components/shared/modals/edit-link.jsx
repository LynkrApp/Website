import * as Dialog from '@radix-ui/react-dialog';
import { useState, useEffect } from 'react';
import closeSVG from '@/public/close_button.svg';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { isValidUrl, signalIframe } from '@/utils/helpers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useCurrentUser from '@/hooks/useCurrentUser';
import useSections from '@/hooks/useSections';
import * as Switch from '@radix-ui/react-switch';

const EditLinkModal = ({ id, title, url, sectionId, isSocial, showFavicon, close }) => {
  const [newTitle, setNewTitle] = useState(title || '');
  const [newUrl, setNewUrl] = useState(url || '');
  const [newSectionId, setNewSectionId] = useState(sectionId);
  const [newShowFavicon, setNewShowFavicon] = useState(showFavicon === true ? 'true' : 'false');
  const [newIsSocial, setNewIsSocial] = useState(isSocial);

  const [urlError, setUrlError] = useState(false);

  const { data: currentUser } = useCurrentUser();
  const { data: userSections } = useSections(currentUser?.id);
  const queryClient = useQueryClient();
  const userId = currentUser?.id ?? null;

  const editMutation = useMutation(
    async ({ newTitle, newUrl, newSectionId, newIsSocial, newShowFavicon }) => {
      await axios.patch(`/api/links/${id}`, {
        newTitle,
        newUrl,
        sectionId: newSectionId,
        newIsSocial,
        newShowFavicon
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['links', userId] });
        queryClient.invalidateQueries({ queryKey: ['sections', userId] });
        signalIframe();
      },
    }
  );

  // Update state when props change
  useEffect(() => {
    setNewTitle(title || '');
    setNewUrl(url || '');
    setNewSectionId(sectionId);
    setNewIsSocial(isSocial);
    setNewShowFavicon(showFavicon === 'true' ? 'true' : 'false');

    // Log received props for debugging
    console.log('EditLinkModal received props:', {
      id,
      title,
      url,
      sectionId,
      isSocial: isSocial === 'true' ? 'true' : 'false',
      showFavicon: showFavicon === 'true' ? 'true' : 'false'
    });
  }, [id, title, url, sectionId, isSocial, showFavicon]);

  const handleEditLink = async () => {
    if (newTitle.trim() === '' || newUrl.trim() === '') {
      close();
      toast.error('Please fill the form');
      return;
    }
    close(); // close drawer
    await toast.promise(editMutation.mutateAsync({
      newTitle,
      newUrl,
      newSectionId,
      newIsSocial,
      newShowFavicon
    }), {
      loading: 'Editing link',
      success: 'Link edited successfully',
      error: 'An error occurred',
    });
  };

  const handleUrlChange = (event) => {
    const urlValue = event.target.value;
    const URL = isValidUrl(urlValue);

    setNewUrl(urlValue);
    setUrlError(!URL);
  };

  // Use the same switch styling for both switches for consistency
  const switchRootClass = "w-[39px] h-[21px] bg-[#E4E4E7] rounded-full relative focus:shadow-black border border-slate-200 data-[state=checked]:bg-slate-900 outline-none cursor-default lg:w-[42px] lg:h-[25px]";
  const switchThumbClass = "block w-[17px] h-[17px] bg-white rounded-full shadow-[0_2px_2px] transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px] lg:w-[21px] lg:h-[21px]";

  return (
    <>
      <div>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm sm:w-full" />
          <Dialog.Content
            className=" contentShow fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                		rounded-2xl bg-white p-6 sm:p-8 lg:max-w-3xl w-[350px] sm:w-[500px] shadow-lg 
               			md:max-w-lg max-md:max-w-lg focus:outline-none"
          >
            <div className="flex flex-row items-center justify-between mb-4">
              <Dialog.Title className="mb-2 text-xl font-medium text-center sm:mb-0 sm:mr-4">
                Edit Link
              </Dialog.Title>
              <Dialog.Close className="flex justify-end flex-end">
                <div
                  onClick={close}
                  className="flex items-center justify-center p-2 bg-gray-100 rounded-full hover:bg-gray-300"
                >
                  <Image priority src={closeSVG} alt="close" />
                </div>
              </Dialog.Close>
            </div>
            <form name="edit-link-form" className="mb-6">
              <div className="relative mb-4">
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="block w-full h-10 px-4 py-6 mb-2 leading-tight text-gray-700 border appearance-none rounded-2xl focus:outline-none focus:shadow-outline"
                  id="name"
                  type="text"
                  placeholder="Title"
                />
              </div>
              <div className="relative">
                <input
                  value={newUrl}
                  onChange={handleUrlChange}
                  className="block w-full h-10 px-4 py-6 mb-2 leading-tight text-gray-700 border appearance-none rounded-2xl focus:outline-none focus:shadow-outline"
                  id="name"
                  type="url"
                  placeholder="URL"
                />
                {urlError && (
                  <small className="text-sm text-red-500">
                    Enter a valid url
                  </small>
                )}
              </div>

              {/* Section Selection */}
              {userSections && userSections.length > 0 && (
                <div className="relative mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Section
                  </label>
                  <select
                    value={newSectionId || ''}
                    onChange={(e) => setNewSectionId(e.target.value || null)}
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

              {/* Toggle for showing favicon */}
              <div className="relative flex justify-between gap-2 p-2 my-4 text-gray-800">
                <div>
                  <h3 className="text-md lg:text-lg">Show website icon (Coming Soon)</h3>
                  <p className="text-xs text-gray-500">
                    Display the website's favicon next to the link title.
                    <br />NOTE: this option is currently true by default.
                  </p>
                </div>
                <Switch.Root
                  checked={newShowFavicon}
                  onCheckedChange={setNewShowFavicon}
                  className={switchRootClass}
                  disabled
                >
                  <Switch.Thumb className={switchThumbClass} disabled />
                </Switch.Root>
              </div>

              <Dialog.Close asChild>
                <button
                  onClick={handleEditLink}
                  className="inline-block w-full px-4 py-4 mt-2 text-lg leading-none text-white bg-slate-800 hover:bg-slate-900 rounded-3xl focus:outline-none focus:shadow-outline-blue"
                >
                  Edit link{' '}
                  <span role="img" aria-label="sparkling star">
                    ✨
                  </span>
                </button>
              </Dialog.Close>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </div>
    </>
  );
};

export default EditLinkModal;
