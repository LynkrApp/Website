import { useEffect } from 'react';
import { ErrorLayout } from '@/components/layout/BaseLayout';
import { Github, Star, GitFork, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const GitHub = () => {
    useEffect(() => {
        // Redirect to GitHub after 3 seconds
        const timer = setTimeout(() => {
            window.location.href = 'https://github.com/LynkrApp';
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <ErrorLayout
            metaProps={{
                title: "Visit Our GitHub - Lynkr",
                description: "Check out our GitHub Organization for Lynkr - open source link-in-bio platform"
            }}
        >
            <div className="max-w-md mx-auto text-center">
                <div className="mb-6">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-900 rounded-full">
                        <Github className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-gray-900">Visiting GitHub...</h1>
                    <p className="text-gray-600">You'll be redirected to our GitHub organization in a few seconds.</p>
                </div>

                <div className="p-6 mb-6 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-center mb-4">
                        <Star className="w-5 h-5 mr-2 text-gray-700" />
                        <span className="font-medium text-gray-800">Open Source Project</span>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li>• View the complete source code</li>
                        <li>• Report bugs and request features</li>
                        <li>• Contribute to the project</li>
                        <li>• Star the repository</li>
                        <li>• Fork and create your own version</li>
                    </ul>
                </div>

                <div className="space-y-3">
                    <a
                        href="https://github.com/LynkrApp"
                        className="inline-flex items-center px-6 py-3 font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
                    >
                        <Github className="w-4 h-4 mr-2" />
                        Visit GitHub
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </a>

                    <div className="flex justify-center space-x-4">
                        <a
                            href="https://github.com/LynkrApp/Website"
                            className="inline-flex items-center px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <Star className="w-4 h-4 mr-2" />
                            Star Repository
                        </a>
                        <a
                            href="https://github.com/LynkrApp/Website/fork"
                            className="inline-flex items-center px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <GitFork className="w-4 h-4 mr-2" />
                            Fork
                        </a>
                    </div>

                    <div>
                        <Link href="/" className="text-gray-500 hover:text-gray-700">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </ErrorLayout>
    );
};

export default GitHub;