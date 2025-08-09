import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GridOverlay } from '@/components/utils/grid-overlay';

export default function Custom500() {
    const router = useRouter();

    return (
        <>
            <GridOverlay />
            <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center">
                <div className="max-w-md p-8 border border-gray-100 shadow-md bg-white/90 backdrop-blur-sm rounded-xl">
                    <h1 className="mb-4 text-3xl font-bold text-gray-800">Server Error</h1>

                    <div className="mb-6">
                        <svg className="w-20 h-20 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <p className="mb-6 text-gray-600">
                        We're sorry, but something went wrong on our server. Our team has been notified and is working on fixing the issue.
                    </p>

                    <div className="flex flex-col justify-center gap-3 sm:flex-row">
                        <button
                            onClick={() => router.reload()}
                            className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-full hover:bg-blue-700"
                        >
                            Try Again
                        </button>

                        <Link
                            href="/"
                            className="px-6 py-2 text-blue-600 transition-colors bg-white border border-blue-600 rounded-full hover:bg-blue-50"
                        >
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
