import { useEffect } from 'react';
import { ErrorLayout } from '@/components/layout/BaseLayout';
import { Twitter, Users, ArrowRight, Bell } from 'lucide-react';
import Link from 'next/link';

const TwitterRedirect = () => {
    useEffect(() => {
        // Redirect to Twitter after 3 seconds
        const timer = setTimeout(() => {
            window.location.href = 'https://x.com/HeyLynkr';
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <ErrorLayout
            metaProps={{
                title: "Follow Us on Twitter - Lynkr",
                description: "Follow @HeyLynkr on Twitter for updates, tips, and community highlights"
            }}
        >
            <div className="max-w-md mx-auto text-center">
                <div className="mb-6">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full">
                        <Twitter className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-gray-900">Following on Twitter...</h1>
                    <p className="text-gray-600">You'll be redirected to our Twitter profile in a few seconds.</p>
                </div>

                <div className="p-6 mb-6 rounded-lg bg-blue-50">
                    <div className="flex items-center justify-center mb-4">
                        <Bell className="w-5 h-5 mr-2 text-blue-600" />
                        <span className="font-medium text-blue-800">Stay Connected</span>
                    </div>
                    <ul className="space-y-2 text-sm text-blue-700">
                        <li>• Get real-time product updates</li>
                        <li>• See feature announcements first</li>
                        <li>• Join conversations with creators</li>
                        <li>• Share your Lynkr success stories</li>
                        <li>• Get tips and best practices</li>
                    </ul>
                </div>

                <div className="space-y-3">
                    <a
                        href="https://x.com/HeyLynkr"
                        className="inline-flex items-center px-6 py-3 font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                    >
                        <Twitter className="w-4 h-4 mr-2" />
                        Follow @HeyLynkr
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </a>

                    <div className="flex justify-center space-x-4">
                        <a
                            href="https://twitter.com/intent/tweet?text=Lynkr%20is%20seriously%20impressive!%20%F0%9F%91%8F%20%0AI%20was%20able%20to%20create%20my%20link%20in%20bio%20page%20in%20just%20minutes.%0A%20%0AA%20huge%20shoutout%20to%20%40HeyLynkr%20for%20creating%20this%20platform.%20%0A%0ACheck%20it%20out%3A%20https%3A//lynkr.link/%F0%9F%9A%80%0A%0A%23lynkr%20%20%20%20"
                            className="inline-flex items-center px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
                        >
                            <Twitter className="w-4 h-4 mr-2" />
                            Share Lynkr
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

export default TwitterRedirect;