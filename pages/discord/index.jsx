import { useEffect } from 'react';
import { ErrorLayout } from '@/components/layout/BaseLayout';
import { MessageCircle, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const Discord = () => {
    useEffect(() => {
        // Redirect to Discord after 3 seconds
        const timer = setTimeout(() => {
            window.location.href = 'https://discord.gg/lynkr';
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <ErrorLayout
            metaProps={{
                title: "Join Our Discord",
                description: "Connect with the Lynkr community on Discord"
            }}
        >
            <div className="text-center max-w-md mx-auto">
                <div className="mb-6">
                    <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Joining Discord...</h1>
                    <p className="text-gray-600">You'll be redirected to our Discord server in a few seconds.</p>
                </div>

                <div className="bg-indigo-50 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-center mb-4">
                        <Users className="w-5 h-5 text-indigo-600 mr-2" />
                        <span className="text-indigo-800 font-medium">Join 500+ community members</span>
                    </div>
                    <ul className="text-sm text-indigo-700 space-y-2">
                        <li>• Get help from the community</li>
                        <li>• Share feedback and feature requests</li>
                        <li>• Connect with other creators</li>
                        <li>• Stay updated on new features</li>
                    </ul>
                </div>

                <div className="space-y-3">
                    <a
                        href="https://discord.gg/lynkr"
                        className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                    >
                        Join Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
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

export default Discord;
