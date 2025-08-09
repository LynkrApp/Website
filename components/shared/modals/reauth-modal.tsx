import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { X, Shield, AlertTriangle } from 'lucide-react';
import LoadingDots from '@/components/utils/loading-dots';
import { FaDiscord, FaGithub, FaGoogle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

const ReAuthModal = ({ isOpen, onClose, onReAuthSuccess, providerToLink }) => {
  const { data: session } = useSession();
  const [isReAuthenticating, setIsReAuthenticating] = useState(false);
  const [originalProvider, setOriginalProvider] = useState(null);
  const [isLoadingProvider, setIsLoadingProvider] = useState(true);

  const providerIcons = {
    google: FaGoogle,
    github: FaGithub,
    discord: FaDiscord,
  };

  // Fetch the user's linked accounts to determine the original provider
  useEffect(() => {
    const fetchOriginalProvider = async () => {
      if (!session?.user || !isOpen) return;

      try {
        const response = await axios.get('/api/auth/linked-accounts');
        const linkedAccounts = response.data;

        // The first account in the list is typically the original one
        // Or we could sort by creation date if we had that info
        if (linkedAccounts && linkedAccounts.length > 0) {
          setOriginalProvider(linkedAccounts[0].provider);
        } else {
          // Fallback - this shouldn't happen, but just in case
          setOriginalProvider('github');
        }
      } catch (error) {
        console.error('Error fetching original provider:', error);
        // Default fallback
        setOriginalProvider('github');
      } finally {
        setIsLoadingProvider(false);
      }
    };

    fetchOriginalProvider();
  }, [session?.user, isOpen]);

  const handleReAuthenticate = async () => {
    setIsReAuthenticating(true);

    try {
      // Create a linking token first
      const response = await fetch('/api/auth/create-link-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider: providerToLink }),
      });

      if (!response.ok) {
        throw new Error('Failed to create linking token');
      }

      const { token } = await response.json();

      // Start the re-authentication flow with the original provider
      if (!originalProvider) {
        throw new Error('Could not determine original provider');
      }

      signIn(originalProvider, {
        callbackUrl: `/admin/settings?tab=accounts&action=reauth&token=${token}&linkProvider=${providerToLink}`,
      });
    } catch (error) {
      console.error('Re-authentication error:', error);
      toast.error('Failed to start re-authentication');
      setIsReAuthenticating(false);
    }
  };

  if (!isOpen) return null;

  // Show loading while determining the original provider
  if (isLoadingProvider) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-full max-w-md p-6 mx-4 bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-center">
            <LoadingDots color="#6366F1" />
          </div>
        </div>
      </div>
    );
  }

  const OriginalIcon = providerIcons[originalProvider];
  const LinkIcon = providerIcons[providerToLink];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 mx-4 bg-white shadow-xl rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Security Verification
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isReAuthenticating}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            {OriginalIcon && <OriginalIcon className="w-8 h-8" />}
            <div className="flex-1 border-t border-gray-200"></div>
            <Shield className="w-6 h-6 text-blue-600" />
            <div className="flex-1 border-t border-gray-200"></div>
            {LinkIcon && <LinkIcon className="w-8 h-8" />}
          </div>

          <p className="mb-4 text-sm text-center text-gray-600">
            To link your{' '}
            <strong className="capitalize">{providerToLink}</strong> account,
            please re-authenticate with your original{' '}
            <strong className="capitalize">{originalProvider}</strong> account
            for security verification.{' '}
            <span className="text-green-600">
              Email addresses don't need to match.
            </span>
          </p>

          <div className="p-3 border rounded-lg bg-amber-50 border-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Why is this required?</p>
                <p className="mt-1">
                  Re-authentication ensures that only you can link new accounts
                  to your profile, preventing unauthorized access even if
                  someone gains temporary access to your session. This works
                  with any email address - they don't need to match.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isReAuthenticating}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleReAuthenticate}
            disabled={isReAuthenticating}
            className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isReAuthenticating ? (
              <LoadingDots color="#FFFFFF" />
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Verify & Continue
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReAuthModal;
