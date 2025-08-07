import { useState } from 'react';
import Head from 'next/head';
import { getCurrentBaseURL } from '@/utils/helpers';

export default function TestOGImage() {
    const [username, setUsername] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const baseUrl = getCurrentBaseURL();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username) {
            const timestamp = new Date().getTime();
            setPreviewUrl(`${baseUrl}/api/og?username=${username}&t=${timestamp}`);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-3xl">
            <Head>
                <title>OG Image Testing Tool</title>
            </Head>

            <h1 className="text-2xl font-bold mb-6">OG Image Testing Tool</h1>

            <form onSubmit={handleSubmit} className="mb-8">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username to test"
                        className="flex-1 px-4 py-2 border rounded-lg"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Generate Preview
                    </button>
                </div>
            </form>

            {previewUrl && (
                <div className="border rounded-xl overflow-hidden">
                    <div className="aspect-[1200/630] relative">
                        <img
                            src={previewUrl}
                            alt="OG Image Preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-4 bg-gray-50 border-t">
                        <p className="text-sm text-gray-700 font-mono break-all">{previewUrl}</p>
                    </div>
                </div>
            )}

            <div className="mt-8 bg-blue-50 p-4 rounded-lg">
                <h2 className="font-semibold mb-2">Testing Tips:</h2>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Enter a valid username that exists in your database</li>
                    <li>You can also test directly by visiting: <code>{baseUrl}/api/og?username=someuser</code></li>
                    <li>The OG image is cached by browsers, use the timestamp parameter to bypass cache</li>
                    <li>Check the network tab in developer tools to see any errors</li>
                </ul>
            </div>
        </div>
    );
}
