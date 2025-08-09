import { useCallback, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { TinyLoader } from '@/components/utils/tiny-loader';
import { useRouter } from 'next/router';
import Confetti from 'react-dom-confetti';
import Balancer from 'react-wrap-balancer';
import { AuthLayout } from '@/components/layout/BaseLayout';
import { useSession } from 'next-auth/react';

const Onboarding = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [handle, setHandle] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [handleTaken, setHandleTaken] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const { data: session, status } = useSession();

  const router = useRouter();

  // Redirect users who already have handles
  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.replace('/login');
      return;
    }

    if (session?.user?.handle) {
      // User already has a handle, redirect to admin
      router.replace('/admin');
    }
  }, [session, status, router]);

  const handleAddHandle = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      if (!handle || handle.trim() === '') {
        toast.error('Please fill the form');
        setIsLoading(false);
        return;
      }
      try {
        const response = await axios.patch('/api/edit', { username: username, bio: bio, handle: handle });
        setIsLoading(false);
        if (response.status === 200) {
          setIsExploding(true);
          toast.success(`${handle} is yours 🎉`);
          // Update the timeout to give enough time for the confetti animation
          // but still redirect to the dashboard (/admin)
          setTimeout(() => {
            router.push('/admin');
          }, 2000);
        }
      } catch (error) {
        setHandleTaken(true);
        setTimeout(() => {
          setHandleTaken(false);
        }, 2500);
        setIsLoading(false);
      }
    },
    [username, bio, handle, router]
  );

  const config = {
    angle: '109',
    spread: '284',
    startVelocity: 40,
    elementCount: '113',
    dragFriction: '0.19',
    duration: '4080',
    stagger: 3,
    width: '10px',
    height: '10px',
    perspective: '500px',
    colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
  };

  const handleOnChange = (event) => {
    const { id, value } = event.target;
    if (id === 'handle') {
      setHandle(value);
      setHandleTaken(false);
    } else if (id === 'username') {
      setUsername(value);
    } else if (id === 'bio') {
      setBio(value);
    }
  };

  return (
    <AuthLayout
      metaProps={{ title: "Choose Your Handle - Lynkr" }}
      className="relative flex items-center justify-center min-h-screen"
      backgroundPattern={false}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 bg-[url(../public/grid.svg)] bg-center 
       			[mask-image:linear-gradient(180deg,rgba(255,255,255,0))] bg-repeat"
      />

      <div className="relative z-10 w-full max-w-sm px-6 mx-auto">
        <div className="mb-8 text-center">
          <div className="mx-auto h-[30px] w-[30px] bg-slate-900 rounded-full mb-4" />
          <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
            <Balancer>Claim your unique handle ✨</Balancer>
          </h2>
        </div>

        <form onSubmit={handleAddHandle} className="space-y-6">
        <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="handle"
                className="block text-sm font-medium leading-6 text-gray-700"
              >
                Type your handle
              </label>
            </div>
            <div className="mt-2">
              <input
                id="handle"
                placeholder="ex: naruto"
                value={handle}
                onChange={handleOnChange}
                type="text"
                required
                className="block w-full px-3 py-2 border border-gray-400 rounded-md ring-offset-gray-200 focus-visible:ring-1 sm:text-sm focus:outline-none focus-visible:ring-offset-2 sm:leading-6"
              />
            </div>
            {handleTaken && (
              <small className="text-red-500">
                {handle} is not available
              </small>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-700"
              >
                Username (Optional)
              </label>
            </div>
            <div className="mt-2">
              <input
                id="username"
                placeholder="ex: codemeapixel"
                value={username}
                onChange={handleOnChange}
                type="text"
                className="block w-full px-3 py-2 border border-gray-400 rounded-md ring-offset-gray-200 focus-visible:ring-1 sm:text-sm focus:outline-none focus-visible:ring-offset-2 sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="bio"
                className="block text-sm font-medium leading-6 text-gray-700"
              >
                Bio (optional)
              </label>
            </div>
            <div className="mt-2">
              <input
                id="bio"
                placeholder="ex: I am cool"
                value={bio}
                onChange={handleOnChange}
                type="text"
                className="block w-full px-3 py-2 border border-gray-400 rounded-md ring-offset-gray-200 focus-visible:ring-1 sm:text-sm focus:outline-none focus-visible:ring-offset-2 sm:leading-6"
              />
            </div>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="flex w-full justify-center rounded-md bg-slate-900 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
          >
            {isLoading ? (
              <div className="flex justify-center w-[100px]">
                <TinyLoader color="white" size={20} stroke={2} />
              </div>
            ) : (
              <span className="text-md">Submit 🚀</span>
            )}
          </button>

          <div className="justify-center hidden w-full h-full lg:flex">
            <Confetti active={isExploding} config={config} />
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Onboarding;
