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
      // Only redirect to admin if they have completed onboarding (have a handle)
      if (session.user.handle) {
        console.log('Existing user with handle detected, redirecting to admin');
        router.replace('/admin');
        return;
      } else {
        // User exists but doesn't have a handle - redirect to onboarding
        console.log('User without handle detected, redirecting to onboarding');
        router.replace('/onboarding');
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
