import Link from 'next/link';
import { useRouter } from 'next/router';
import { GridOverlay } from './grid-overlay';
import { ErrorSVG } from './404';
import Balancer from 'react-wrap-balancer';

const NotFound = () => {
  const router = useRouter();
  const path = router.asPath.replace('/', '');

  return (
    <>
      <GridOverlay />
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 py-12 text-center animate-fadeIn">
        <div className="flex justify-center transition-transform duration-300 transform hover:scale-105">
          <ErrorSVG />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 lg:text-4xl">
          <Balancer>Oops! Page not found</Balancer>
        </h2>

        <h3 className="max-w-lg text-lg text-gray-600 lg:text-2xl">
          <Balancer>
            The page you&apos;re looking for doesn&apos;t exist
          </Balancer>
        </h3>

        <div className="z-10 flex flex-col gap-4 mt-2 sm:flex-row">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 text-gray-800 transition-colors bg-gray-200 rounded-full hover:bg-gray-300"
          >
            Go Back
          </button>

          <Link
            href="/"
            className="px-6 py-3 text-white transition-colors rounded-full bg-slate-800 hover:bg-slate-900"
          >
            Go Home
          </Link>
        </div>

        {path && (
          <div className="max-w-md p-6 mt-8 border border-gray-100 shadow-sm bg-white/80 backdrop-blur-sm rounded-xl">
            <h3 className="mb-3 text-lg font-medium text-gray-800">
              <Balancer>
                Want{' '}
                <span className="px-2 py-1 font-bold bg-yellow-100 rounded text-slate-800">
                  {path}
                </span>{' '}
                to be your handle?
              </Balancer>
            </h3>
            <Link
              className="inline-block px-6 py-3 text-white transition-all duration-300 transform rounded-full shadow-md bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:-translate-y-1"
              href="/register"
            >
              Create your account now 🚀
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              Claim this unique URL before someone else does!
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default NotFound;
