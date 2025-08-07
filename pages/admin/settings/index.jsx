/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import useCurrentUser from '@/hooks/useCurrentUser';
import axios from 'axios';
import toast from 'react-hot-toast';
import * as Dialog from '@radix-ui/react-dialog';
import UploadModal from '@/components/shared/modals/upload-modal';
import { TinyLoader } from '@/components/utils/tiny-loader';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Balancer } from 'react-wrap-balancer';
import useUser from '@/hooks/useUser';
import { UserAvatarSetting } from '@/components/utils/avatar';
import { signalIframe } from '@/utils/helpers';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import CustomAlert from '@/components/shared/alerts/custom-alert';
import useMediaQuery from '@/hooks/use-media-query';
import { signOut } from 'next-auth/react';
import Head from 'next/head';
import AccountLinking from '@/components/core/account-linking/account-linking';
import DataViewer from '@/components/core/data-management/data-viewer';
import useDataExport from '@/hooks/useDataExport';
import { Download, Eye, FileText, AlertTriangle } from 'lucide-react';
import LoadingDots from '@/components/utils/loading-dots';

const Settings = () => {
  const { data: currentUser } = useCurrentUser();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('');
  const [handle, setHandle] = useState('');
  const [handleError, setHandleError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [showDataViewer, setShowDataViewer] = useState(false);

  const { isMobile } = useMediaQuery();

  const queryClient = useQueryClient();
  const { data: fetchedUser } = useUser(currentUser?.handle);
  const { exportData, isExporting } = useDataExport();

  useEffect(() => {
    // Check URL parameters for tab and action
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    const action = urlParams.get('action');
    const error = urlParams.get('error');

    if (tab) {
      setActiveTab(tab);
    }

    if (action === 'link') {
      toast.success('Account linked successfully!');
      // Clean up URL
      router.replace('/admin/settings?tab=accounts', undefined, { shallow: true });
    }

    if (error) {
      if (error === 'OAuthAccountNotLinked') {
        toast.error('Account linking failed: Please complete the re-authentication process');
      } else {
        toast.error(`Authentication error: ${error}`);
      }
      // Clean up URL
      router.replace('/admin/settings?tab=accounts', undefined, { shallow: true });
    }
  }, [router]);

  useEffect(() => {
    setUsername(fetchedUser?.name);
    setBio(fetchedUser?.bio);
    setImage(fetchedUser?.image);
    setHandle(fetchedUser?.handle);
  }, [
    fetchedUser?.name,
    fetchedUser?.bio,
    fetchedUser?.image,
    fetchedUser?.handle,
  ]);

  // edit profile details
  const editMutation = useMutation(
    async ({ bio, username, image, handle }) => {
      await axios.patch('/api/edit', {
        bio,
        username,
        image,
        handle,
      });
    },
    {
      onError: () => {
        toast.error('An error occurred');
      },
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        toast.success('Changes applied');
        signalIframe();
      },
    }
  );

  // Validate handle format (letters, numbers, underscores, no spaces)
  const validateHandle = (value) => {
    if (!value) {
      setHandleError('Handle is required');
      return false;
    }

    if (value.length < 3) {
      setHandleError('Handle must be at least 3 characters');
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setHandleError('Handle can only contain letters, numbers, and underscores');
      return false;
    }

    setHandleError('');
    return true;
  };

  const handleSubmit = async () => {
    // Validate handle before submission
    if (handle && !validateHandle(handle)) {
      toast.error(handleError);
      return;
    }

    toast.loading('Applying changes');
    await editMutation.mutateAsync({ bio, username, image, handle });
  };

  // delete profile picture
  const handleDeletePfp = async () => {
    if (image === '') {
      toast.error('There is nothing to delete');
      return;
    } else {
      toast.loading('Applying changes');
      await editMutation.mutateAsync({ bio, username, image: '', handle });
    }
  };

  // delete user's account
  const deleteMutation = useMutation(
    async () => {
      await axios.delete('/api/edit');
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        router.push('/register');
      },
    }
  );

  const handleDeleteUser = async () => {
    await toast.promise(deleteMutation.mutateAsync(), {
      loading: 'Deleting your account',
      success: 'So long partner 🫡',
      error: 'An error occured',
    });
    await signOut();
  };

  const deleteAlertProps = {
    action: handleDeleteUser,
    title: 'Are you absolutely sure?',
    desc: 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
    confirmMsg: 'Yes, delete account',
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'accounts', label: 'Linked Accounts', icon: '🔗' },
    { id: 'danger', label: 'Danger Zone', icon: '⚠️' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <>
            <div className="max-w-[690px] mx-auto my-10">
              <h3 className="text-xl font-semibold">Profile Settings</h3>
              <div className="mt-4 rounded-2xl border bg-white p-lg w-full h-auto pb-10">
                <div className="flex flex-col lg:flex-row gap-x-6 p-10">
                  <div className="w-[100px] h-[100px] pb-6 rounded-full flex items-center mx-auto">
                    {fetchedUser ? (
                      <UserAvatarSetting />
                    ) : (
                      <TinyLoader color="black" stroke={1} size={100} />
                    )}
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <div className="relative overflow-hidden">
                      <Dialog.Root>
                        <Dialog.Trigger asChild>
                          <button className="relative w-full lg:w-[490px] h-[45px] border rounded-3xl border-[#000] outline-none text-white bg-slate-900 p-2 hover:bg-slate-700">
                            Pick an image
                          </button>
                        </Dialog.Trigger>
                        <UploadModal
                          value={image}
                          onChange={(image) => setImage(image)}
                          submit={handleSubmit}
                        />
                      </Dialog.Root>
                    </div>
                    <button
                      onClick={handleDeletePfp}
                      className="w-full lg:w-[490px] h-[45px] border border-[#aaa] 
                      outline-none font-semibold text-slate-900 bg-white p-2 rounded-3xl hover:bg-gray-100"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-4 max-w-[640px] mx-auto px-4">
                  {/* Username Input */}
                  <input
                    value={username ?? ''}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={handleSubmit}
                    placeholder="Username"
                    className="outline-none w-full p-4 h-[50px] rounded-lg border-2 bg-gray-100 text-black focus:border-slate-900"
                  />

                  {/* Handle Input */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Handle (your unique URL)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        lynkr.link/
                      </span>
                      <input
                        value={handle ?? ''}
                        onChange={(e) => {
                          const newHandle = e.target.value.trim();
                          setHandle(newHandle);
                          validateHandle(newHandle);
                        }}
                        onBlur={() => {
                          if (validateHandle(handle)) {
                            handleSubmit();
                          }
                        }}
                        placeholder="your-handle"
                        className={`outline-none w-full pl-24 p-4 h-[50px] rounded-lg border-2 
                        bg-gray-100 text-black focus:border-slate-900 ${handleError ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {handleError && (
                      <p className="mt-1 text-sm text-red-600">{handleError}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Your handle will be used as your unique URL: lynkr.link/{handle || 'your-handle'}
                    </p>
                  </div>

                  {/* Bio Textarea */}
                  <textarea
                    value={bio ?? ''}
                    onChange={(e) => setBio(e.target.value)}
                    onBlur={handleSubmit}
                    placeholder="Bio"
                    className="outline-none w-full p-4 h-[120px] rounded-lg border-2
                  bg-gray-100 text-black focus:border-slate-900"
                  />
                </div>
              </div>
            </div>
          </>
        );

      case 'accounts':
        return (
          <div className="max-w-[690px] mx-auto my-10">
            <h3 className="text-xl font-semibold mb-4">Account Management</h3>
            <AccountLinking />
          </div>
        );

      case 'danger':
        return (
          <div className="max-w-[690px] mx-auto my-10">
            <h3 className="text-xl font-semibold mb-1">Danger Zone</h3>
            <h3 className="mb-6 text-gray-600 text-sm">
              <Balancer>
                Manage your account data and perform destructive actions. These operations cannot be undone.
              </Balancer>
            </h3>

            {/* Data Management Section */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Data Management
              </h4>
              <div className="space-y-4">
                {/* View Your Data */}
                <div className="w-full h-auto border bg-white rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 mb-2">View Your Data</h5>
                      <p className="text-sm text-gray-600 mb-4">
                        See all the data we have stored about your account in an organized, readable format.
                      </p>
                    </div>
                    <Eye className="w-5 h-5 text-gray-400 mt-1" />
                  </div>
                  <button
                    onClick={() => setShowDataViewer(true)}
                    className="w-full lg:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View My Data
                  </button>
                </div>

                {/* Export Your Data */}
                <div className="w-full h-auto border bg-white rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 mb-2">Export Your Data</h5>
                      <p className="text-sm text-gray-600 mb-4">
                        Download a complete copy of your account data in JSON format. This includes your profile, links, sections, and settings.
                      </p>
                    </div>
                    <Download className="w-5 h-5 text-gray-400 mt-1" />
                  </div>
                  <button
                    onClick={exportData}
                    disabled={isExporting}
                    className="w-full lg:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isExporting ? (
                      <>
                        <LoadingDots color="#ffffff" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Export Data
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Account Deletion Section */}
            <div>
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Destructive Actions
              </h4>
              <div className="w-full h-auto border border-red-200 bg-red-50 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h5 className="font-medium text-red-900 mb-2">Delete Account</h5>
                    <p className="text-sm text-red-700">
                      <Balancer>
                        Permanently delete your account and remove all your data from our servers. This action cannot be undone.
                      </Balancer>
                    </p>
                  </div>
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
                </div>
                <AlertDialog.Root>
                  <AlertDialog.Trigger asChild>
                    <button className="w-full lg:w-[200px] rounded-lg h-auto p-3 text-white bg-red-600 hover:bg-red-500 transition-colors">
                      Delete Account
                    </button>
                  </AlertDialog.Trigger>
                  <CustomAlert {...deleteAlertProps} />
                </AlertDialog.Root>
              </div>
            </div>

            {/* Data Viewer Modal */}
            {showDataViewer && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <DataViewer onClose={() => setShowDataViewer(false)} />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>Lynkr | Settings</title>
      </Head>
      <Layout>
        <div className="w-full lg:basis-3/5 pl-4 pr-4 border-r overflow-scroll">
          {/* Tab Navigation */}
          <div className="max-w-[690px] mx-auto mt-10">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  <span>{tab.icon}</span>
                  {!isMobile && tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {renderTabContent()}

          {isMobile ? (
            <div className="h-[100px] mb-24" />
          ) : (
            <div className="h-[40px] mb-12" />
          )}
        </div>
      </Layout>
    </>
  );
};

export default Settings;
