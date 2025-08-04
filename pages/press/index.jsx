import Link from 'next/link';
import { ArrowLeft, Download, Image as ImageIcon, FileText, Users, BarChart } from 'lucide-react';
import { ContentLayout } from '@/components/layout/BaseLayout';
import Image from 'next/image';

const PressKit = () => {
    const assets = [
        {
            category: "Logos",
            items: [
                { name: "Lynkr Logo (SVG)", file: "/press/lynkr-logo.svg", description: "Primary logo in vector format" },
                { name: "Lynkr Logo (PNG)", file: "/press/lynkr-logo.png", description: "Primary logo in high resolution" },
                { name: "Lynkr Icon (SVG)", file: "/press/lynkr-icon.svg", description: "Icon only, vector format" },
                { name: "Lynkr Icon (PNG)", file: "/press/lynkr-icon.png", description: "Icon only, high resolution" },
                { name: "Lynkr Wordmark (SVG)", file: "/press/lynkr-wordmark.svg", description: "Text logo with icon" },
                { name: "Lynkr Wordmark (PNG)", file: "/press/lynkr-wordmark.png", description: "Text logo with icon, high resolution" }
            ]
        },
        {
            category: "Screenshots",
            items: [
                { name: "Dashboard Screenshot", file: "/press/dashboard.png", description: "Main admin dashboard view" },
                { name: "Profile Page", file: "/press/profile-page.png", description: "Example user profile page" },
                { name: "Customization Panel", file: "/press/customization.png", description: "Theme and style editor" },
                { name: "Analytics Dashboard", file: "/press/analytics.png", description: "User analytics interface" }
            ]
        }
    ];

    // Handle download functionality
    const handleDownload = (file, filename) => {
        const link = document.createElement('a');
        link.href = file;
        link.download = filename || file.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const teamBios = [
        {
            name: "Pixelated",
            role: "Founder & CEO",
            image: "/team/Pixelated.png"
        },
        {
            name: "Exa",
            role: "Co-Founder & COO",
            image: "/team/Exa.png"
        },
        {
            name: "Ranveer",
            role: "Lead Developer",
            image: "/team/Ranveer.png"
        }
    ];

    return (
        <ContentLayout
            title="Press Kit"
            description="Media assets, company information, and resources for journalists and content creators."
        >
            {/* Back Link */}
            <Link
                href="/"
                className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
            </Link>

            {/* Company Overview */}
            <div className="p-8 mb-12 border border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                    About Lynkr
                </h2>
                <p className="mb-6 text-lg leading-relaxed text-gray-700">
                    Lynkr is the ultimate free and open-source link-in-bio platform that empowers creators,
                    businesses, and individuals to create beautiful, organized landing pages for their online presence.
                </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
                <section className="mb-12">
                    <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                        Brand Assets
                    </h2>
                    <p className="mb-8 text-gray-700">
                        Download our official logos, screenshots, and brand assets. All assets are available
                        for editorial use. Please follow our brand guidelines when using these materials.
                    </p>

                    {assets.map((category, categoryIndex) => (
                        <div key={categoryIndex} className="mb-8">
                            <h3 className="mb-4 text-xl font-semibold text-gray-900">{category.category}</h3>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {category.items.map((item, index) => (
                                    <div key={index} className="p-4 transition-shadow border border-gray-200 rounded-lg hover:shadow-md">
                                        {/* Image Preview */}
                                        <div className="mb-4 overflow-hidden bg-gray-500 rounded-lg aspect-video">
                                            <Image
                                                src={item.file}
                                                alt={item.name}
                                                width={300}
                                                height={200}
                                                className="object-contain w-full h-full p-4"
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-image.png';
                                                }}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="mb-4">
                                            <h4 className="mb-1 font-semibold text-gray-900">{item.name}</h4>
                                            <p className="text-sm text-gray-600">{item.description}</p>
                                        </div>

                                        {/* Download Button */}
                                        <button
                                            onClick={() => handleDownload(item.file, item.name)}
                                            className="flex items-center justify-center w-full px-3 py-2 text-sm text-blue-600 transition-colors border border-blue-600 rounded-lg hover:bg-blue-50"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Download
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="p-6 mb-8 border border-yellow-200 rounded-lg bg-yellow-50">
                        <h3 className="mb-2 font-semibold text-yellow-900">Brand Guidelines</h3>
                        <p className="text-sm text-yellow-800">
                            Please maintain adequate spacing around our logo, use approved color combinations,
                            and don't modify or distort our brand assets. For specific guidelines, contact our press team.
                        </p>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                        Key Features & Differentiators
                    </h2>
                    <div className="space-y-4">
                        <div className="p-4 border border-gray-200 rounded-lg">
                            <h3 className="mb-2 font-semibold text-gray-900">100% Free & Open Source</h3>
                            <p className="text-gray-700">
                                Unlike competitors who charge monthly fees, Lynkr is completely free forever.
                                Our open-source approach ensures transparency and community-driven development.
                            </p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg">
                            <h3 className="mb-2 font-semibold text-gray-900">Advanced Customization</h3>
                            <p className="text-gray-700">
                                Comprehensive theming system with custom colors, layouts, typography, and even
                                animated backgrounds - features typically locked behind premium tiers elsewhere.
                            </p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg">
                            <h3 className="mb-2 font-semibold text-gray-900">Privacy-First Approach</h3>
                            <p className="text-gray-700">
                                Complete data ownership with export capabilities, GDPR compliance, and no data
                                selling - putting user privacy at the forefront.
                            </p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg">
                            <h3 className="mb-2 font-semibold text-gray-900">Built-in Analytics</h3>
                            <p className="text-gray-700">
                                Comprehensive analytics dashboard showing clicks, views, and engagement metrics
                                without requiring third-party integrations.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                        Leadership Team
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {teamBios.map((member, index) => (
                            <div key={index} className="p-6 border border-gray-200 rounded-lg">
                                <Image
                                    src={member.image}
                                    alt={`${member.name}'s photo`}
                                    width={80}
                                    height={80}
                                    className="w-20 h-20 mx-auto mb-4 rounded-full"
                                />
                                <h3 className="mb-1 text-lg font-semibold text-center text-gray-900">{member.name}</h3>
                                <p className="mb-3 text-sm text-center text-blue-600">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                        Media Contact
                    </h2>
                    <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <h3 className="mb-2 font-semibold text-gray-900">Press Inquiries</h3>
                                <p className="mb-2 text-gray-700">
                                    <strong>Email:</strong>{' '}
                                    <Link href="mailto:press@lynkr.link" className="text-blue-600 hover:text-blue-800">
                                        press@lynkr.link
                                    </Link>
                                </p>
                                <p className="text-gray-700">
                                    <strong>Response Time:</strong> Within 24 hours
                                </p>
                            </div>
                            <div>
                                <h3 className="mb-2 font-semibold text-gray-900">Partnership Inquiries</h3>
                                <p className="mb-2 text-gray-700">
                                    <strong>Email:</strong>{' '}
                                    <Link href="mailto:partnerships@lynkr.link" className="text-blue-600 hover:text-blue-800">
                                        partnerships@lynkr.link
                                    </Link>
                                </p>
                                <p className="text-gray-700">
                                    <strong>Focus:</strong> Creator tools, developer relations
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div className="pt-8 mt-12 border-t border-gray-200">
                <div className="text-center">
                    <p className="mb-4 text-sm text-gray-500">
                        Need additional assets or have specific media requirements?
                    </p>
                    <div className="flex justify-center space-x-6 text-sm">
                        <Link href="/about" className="text-blue-600 hover:text-blue-800">
                            About Us
                        </Link>
                        <Link href="/contact" className="text-blue-600 hover:text-blue-800">
                            Contact
                        </Link>
                        <Link
                            href="https://github.com/LynkrApp/Website"
                            className="text-blue-600 hover:text-blue-800"
                            target="_blank"
                        >
                            GitHub
                        </Link>
                    </div>
                </div>
            </div>
        </ContentLayout>
    );
};

export default PressKit;
