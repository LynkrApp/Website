import { ContentLayout } from '@/components/layout/BaseLayout';
import Link from 'next/link';
import { ArrowLeft, Calendar, Plus, Bug, Zap, AlertTriangle, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

const Changelog = () => {
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchChangelog();
    }, []);

    const fetchChangelog = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/changelog');

            if (!response.ok) {
                throw new Error('Failed to fetch changelog');
            }

            const data = await response.json();
            setReleases(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching changelog:', err);
        } finally {
            setLoading(false);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'feature': return <Plus className="w-4 h-4 text-green-600" />;
            case 'improvement': return <Zap className="w-4 h-4 text-blue-600" />;
            case 'fix': return <Bug className="w-4 h-4 text-red-600" />;
            case 'breaking': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
            default: return <Zap className="w-4 h-4 text-gray-600" />;
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'feature': return 'New Feature';
            case 'improvement': return 'Improvement';
            case 'fix': return 'Bug Fix';
            case 'breaking': return 'Breaking Change';
            default: return 'Update';
        }
    };

    const getReleaseTypeColor = (type) => {
        switch (type) {
            case 'feature': return 'bg-green-100 text-green-800 border-green-200';
            case 'fix': return 'bg-red-100 text-red-800 border-red-200';
            case 'prerelease': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    if (loading) {
        return (
            <ContentLayout
                title="Changelog"
                description="Stay up to date with the latest Lynkr features, improvements, and bug fixes."
            >
                <Link href="/" className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="p-6 border border-gray-200 rounded-lg animate-pulse">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-20 h-6 bg-gray-200 rounded"></div>
                                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                            </div>
                            <div className="space-y-3">
                                <div className="w-full h-4 bg-gray-200 rounded"></div>
                                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                                <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </ContentLayout>
        );
    }

    if (error) {
        return (
            <ContentLayout
                title="Changelog"
                description="Stay up to date with the latest Lynkr features, improvements, and bug fixes."
            >
                <Link href="/" className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                <div className="p-6 border border-red-200 rounded-lg bg-red-50">
                    <h3 className="mb-2 text-lg font-semibold text-red-900">Error Loading Changelog</h3>
                    <p className="text-red-700">{error}</p>
                    <button
                        onClick={fetchChangelog}
                        className="px-4 py-2 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </ContentLayout>
        );
    }

    return (
        <ContentLayout
            title="Changelog"
            description="Stay up to date with the latest Lynkr features, improvements, and bug fixes."
        >
            <Link href="/" className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
            </Link>

            {releases.length === 0 ? (
                <div className="p-6 text-center border border-gray-200 rounded-lg">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">No Releases Found</h3>
                    <p className="text-gray-600">Check back later for updates!</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {releases.map((release, index) => (
                        <div key={index} className="p-6 transition-shadow border border-gray-200 rounded-lg hover:shadow-md">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-2xl font-semibold text-gray-900">
                                        v{release.version}
                                    </h3>
                                    {release.prerelease && (
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getReleaseTypeColor('prerelease')}`}>
                                            Pre-release
                                        </span>
                                    )}
                                    {release.title && release.title !== `Version ${release.version}` && (
                                        <span className="text-lg text-gray-600">- {release.title}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {new Date(release.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <a
                                        href={release.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        View on GitHub
                                    </a>
                                </div>
                            </div>

                            {release.changes.length > 0 ? (
                                <div className="space-y-3">
                                    {release.changes.map((change, changeIndex) => (
                                        <div key={changeIndex} className="flex items-start">
                                            <div className="mr-3 mt-0.5">
                                                {getTypeIcon(change.type)}
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-gray-700">{change.text}</span>
                                                <span className="ml-2 text-xs text-gray-500">
                                                    ({getTypeLabel(change.type)})
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">No detailed changes available for this release.</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Footer */}
            <div className="pt-8 mt-12 border-t border-gray-200">
                <div className="text-center">
                    <p className="mb-4 text-sm text-gray-500">
                        Stay updated with the latest changes to Lynkr
                    </p>
                    <div className="flex justify-center space-x-6 text-sm">
                        <Link
                            href="https://github.com/LynkrApp/Website/releases"
                            className="text-blue-600 hover:text-blue-800"
                            target="_blank"
                        >
                            View on GitHub
                        </Link>
                        <Link href="/about" className="text-blue-600 hover:text-blue-800">
                            About Us
                        </Link>
                        <Link href="/contact" className="text-blue-600 hover:text-blue-800">
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </ContentLayout>
    );
};

export default Changelog;
