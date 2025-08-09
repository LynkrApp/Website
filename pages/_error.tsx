import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import NotFound from '@/components/utils/not-found';
import { GridOverlay } from '@/components/utils/grid-overlay';

function Error({ statusCode, err }) {
    const router = useRouter();

    useEffect(() => {
        // Log error to an error reporting service
        if (statusCode !== 404 && process.env.NODE_ENV !== 'development') {
            console.error('Page error:', statusCode, err);
            // You could add your error reporting service here
        }
    }, [statusCode, err]);

    // Handle 404 errors with the custom NotFound component
    if (statusCode === 404) {
        return <NotFound />;
    }

    return (
        <>
            <GridOverlay />
            <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center">
                <div className="max-w-md px-6 py-8 bg-white rounded-lg shadow-md">
                    <h1 className="mb-4 text-4xl font-bold text-red-600">
                        {statusCode ? `${statusCode} Error` : 'An Error Occurred'}
                    </h1>

                    <p className="mb-6 text-lg text-gray-700">
                        {statusCode
                            ? `Sorry, something went wrong on our server.`
                            : 'Sorry, an error occurred on client side.'}
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={() => router.reload()}
                            className="px-6 py-2 mr-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>

                        <Link
                            href="/"
                            className="px-6 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                        >
                            Go Home
                        </Link>
                    </div>

                    {process.env.NODE_ENV === 'development' && err && (
                        <div className="mt-8 p-4 bg-gray-100 rounded-md text-left overflow-auto">
                            <h3 className="mb-2 text-sm font-semibold text-gray-700">Developer Information:</h3>
                            <p className="text-xs text-gray-600 whitespace-pre-wrap break-words">
                                {err.message && <span className="block mb-2">{err.message}</span>}
                                {err.stack && <span className="block text-red-500">{err.stack}</span>}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode, err };
};

export default Error;
