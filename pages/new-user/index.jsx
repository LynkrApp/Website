import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ErrorLayout } from '@/components/layout/BaseLayout';

export default function NewUser() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    // Check if this is an account linking flow
    const { callbackUrl } = router.query;

    if (callbackUrl && callbackUrl.includes('admin/settings') && callbackUrl.includes('tab=accounts')) {
      console.log('Account linking detected, redirecting to:', callbackUrl);
      router.replace(callbackUrl);
      return;
    }

    // Check if user already has a profile (existing user linking account)
    if (session?.user) {
      // This could be an account linking for an existing user
      // Check if they have a handle (sign they've completed onboarding)
      if (session.user.handle) {
        console.log('Existing user detected, redirecting to admin');
        router.replace('/admin');
        return;
      }
    }

    // Default: redirect to onboarding for genuinely new users
    console.log('New user detected, redirecting to onboarding');
    router.replace('/onboarding');
  }, [router, session, status]);

  return (
    <ErrorLayout metaProps={{ title: "Setting Up Account - Lynkr" }}>
      <div className="text-center">
        <div className="w-32 h-32 mx-auto border-b-2 border-gray-900 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Setting up your account...</p>
      </div>
    </ErrorLayout>
  );
}
