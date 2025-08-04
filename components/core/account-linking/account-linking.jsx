import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingDots from '@/components/utils/loading-dots';
import GoogleIcon from '@/components/utils/google-icon';
import GitHubIcon from '@/components/utils/github-icon';
import DiscordIcon from '@/components/utils/discord-icon';
import ReAuthModal from '@/components/shared/modals/reauth-modal';
import { CheckCircle, X, Link as LinkIcon } from 'lucide-react';

const AccountLinking = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [showReAuthModal, setShowReAuthModal] = useState(false);
  const [providerToLink, setProviderToLink] = useState(null);

  // Fetch linked accounts
  const { data: linkedAccounts, isLoading, refetch } = useQuery({
    queryKey: ['linked-accounts'],
    queryFn: async () => {
      const response = await axios.get('/api/auth/linked-accounts');
      return response.data;
    },
    enabled: !!session?.user?.id,
  });

  // Check URL parameters and handle re-authentication flow
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const token = urlParams.get('token');
    const linkProvider = urlParams.get('linkProvider');
    
    console.log('AccountLinking useEffect triggered with:', { action, token, linkProvider });
    
    if (action === 'link') {
      // Refresh the linked accounts data after regular sign-in
      refetch();
      setLoadingProvider(null);
      // Clear URL to prevent re-triggering
      window.history.replaceState({}, '', '/admin/settings?tab=accounts');
    } else if (action === 'reauth' && token && linkProvider) {
      // Handle re-authentication completion
      console.log('Re-authentication completed, preparing to link:', linkProvider);
      
      // Clear the URL parameters first to prevent re-triggering
      const newUrl = window.location.pathname + '?tab=accounts';
      window.history.replaceState({}, '', newUrl);
      
      // Add a delay and then trigger the Discord linking
      handleReAuthCompletion(token, linkProvider);
    } else if (action === 'complete' && token) {
      // Handle account linking completion
      console.log('CALLING handleLinkCompletion with token:', token);
      handleLinkCompletion(token);
      
      // Clear URL immediately to prevent duplicate calls
      window.history.replaceState({}, '', '/admin/settings?tab=accounts');
    }
  }, []); // Remove refetch dependency to prevent infinite re-runs

  // Handle re-authentication completion
  const handleReAuthCompletion = async (token, linkProvider) => {
    try {
      console.log('Re-auth completed, will start linking in 2 seconds...', linkProvider);
      setLoadingProvider(linkProvider);
      
      // Add a delay to ensure the previous OAuth flow has fully completed
      // This prevents OAuth state conflicts between GitHub reauth and Discord linking
      setTimeout(() => {
        console.log('Starting Discord OAuth flow for account linking');
        signIn(linkProvider, {
          callbackUrl: `/admin/settings?tab=accounts&action=complete&token=${token}`,
        });
      }, 2000); // 2 second delay to ensure OAuth state is cleared
    } catch (error) {
      console.error('Error completing re-auth:', error);
      toast.error('Failed to complete account linking');
      setLoadingProvider(null);
    }
  };

  // Handle account linking completion
  const handleLinkCompletion = async (token) => {
    try {
      console.log('Processing account link completion with token:', token);
      
      const response = await axios.post('/api/auth/process-link', { token });
      
      if (response.status === 200) {
        toast.success('Account linked successfully!');
        refetch(); // Refresh the linked accounts list
        setLoadingProvider(null);
      }
    } catch (error) {
      console.error('Error completing account link:', error);
      toast.error(error.response?.data?.message || 'Failed to link account');
      setLoadingProvider(null);
    }
  };

  // Unlink account mutation
  const unlinkMutation = useMutation({
    mutationFn: async (provider) => {
      await axios.delete(`/api/auth/unlink-account?provider=${provider}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['linked-accounts']);
      toast.success('Account unlinked successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to unlink account');
    },
  });

  const providers = [
    {
      id: 'google',
      name: 'Google',
      icon: GoogleIcon,
      color: 'border-red-500 text-red-500 hover:bg-red-50',
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: GitHubIcon,
      color: 'border-gray-800 text-gray-800 hover:bg-gray-50',
    },
    {
      id: 'discord',
      name: 'Discord',
      icon: DiscordIcon,
      color: 'border-indigo-600 text-indigo-600 hover:bg-indigo-50',
    },
  ];

  const handleLinkAccount = (providerId) => {
    setProviderToLink(providerId);
    setShowReAuthModal(true);
  };

  const handleReAuthSuccess = () => {
    setShowReAuthModal(false);
    setLoadingProvider(providerToLink);
  };

  const handleCloseReAuthModal = () => {
    setShowReAuthModal(false);
    setProviderToLink(null);
  };

  const handleUnlinkAccount = (provider) => {
    if (linkedAccounts?.length <= 1) {
      toast.error('You must have at least one linked account');
      return;
    }
    unlinkMutation.mutate(provider);
  };

  const isLinked = (providerId) => {
    return linkedAccounts?.some(account => account.provider === providerId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingDots color="#6366F1" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="p-6 bg-white border rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <LinkIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Linked Accounts</h3>
        </div>
        
        <p className="mb-6 text-sm text-gray-600">
          Link multiple accounts to sign in with any of them.
        </p>

        <div className="space-y-4">
          {providers.map((provider) => {
            const linked = isLinked(provider.id);
            const IconComponent = provider.icon;
            
            return (
              <div
                key={provider.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <IconComponent />
                  <div>
                    <h4 className="font-medium text-gray-900">{provider.name}</h4>
                    <p className="text-sm text-gray-500">
                      {linked ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {linked && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  
                  {linked ? (
                    <button
                      onClick={() => handleUnlinkAccount(provider.id)}
                      disabled={unlinkMutation.isLoading || linkedAccounts?.length <= 1}
                      className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                        linkedAccounts?.length <= 1
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'border-red-500 text-red-500 hover:bg-red-50'
                      }`}
                    >
                      {unlinkMutation.isLoading ? (
                        <LoadingDots color="#EF4444" />
                      ) : (
                        <>
                          <X className="inline w-3 h-3 mr-1" />
                          Unlink
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleLinkAccount(provider.id)}
                      disabled={loadingProvider === provider.id}
                      className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${provider.color}`}
                    >
                      {loadingProvider === provider.id ? (
                        <LoadingDots color="#6366F1" />
                      ) : (
                        <>
                          <LinkIcon className="inline w-3 h-3 mr-1" />
                          Link
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 mt-6 rounded-lg bg-blue-50">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 min-w-0 text-sm text-blue-700">
              <p className="font-medium">Security First</p>
              <p className="mt-1">
                For your security, you'll need to re-authenticate with your original account 
                before linking any new accounts. This prevents unauthorized account linking.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ReAuthModal
        isOpen={showReAuthModal}
        onClose={handleCloseReAuthModal}
        onReAuthSuccess={handleReAuthSuccess}
        providerToLink={providerToLink}
      />
    </div>
  );
};

export default AccountLinking;
