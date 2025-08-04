import { LegalLayout } from '@/components/layout/BaseLayout';
import Link from 'next/link';
import { ArrowLeft, Cookie, Settings, Shield, Eye } from 'lucide-react';

const Cookies = () => {
    return (
        <LegalLayout title="Cookie Policy" description="Learn about how we use cookies and tracking technologies">
            {/* Back Link */}
            <Link
                href="/"
                className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
            </Link>

            {/* Header */}
            <div className="mb-8">
                <h1 className="mb-4 text-4xl font-bold text-gray-900">
                    Cookie Policy
                </h1>
                <p className="text-lg text-gray-600">
                    Last updated: August 4, 2025
                </p>
            </div>

            {/* Cookie Highlights */}
            <div className="p-6 mb-8 border border-blue-200 rounded-lg bg-blue-50">
                <h2 className="flex items-center mb-4 text-xl font-semibold text-blue-900">
                    <Cookie className="w-5 h-5 mr-2" />
                    Cookie Summary
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start">
                        <Settings className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-blue-900">Essential Only</h3>
                            <p className="text-sm text-blue-700">We only use cookies necessary for the service to function.</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-blue-900">No Tracking</h3>
                            <p className="text-sm text-blue-700">No advertising or marketing cookies are used.</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <Eye className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-blue-900">Transparent</h3>
                            <p className="text-sm text-blue-700">Full disclosure of all cookies and their purposes.</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <Settings className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-blue-900">User Control</h3>
                            <p className="text-sm text-blue-700">You can control cookie preferences through your browser.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
                <section className="mb-8">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        What Are Cookies?
                    </h2>
                    <p className="mb-4 leading-relaxed text-gray-700">
                        Cookies are small text files that are stored on your device when you visit a website. They help websites remember your preferences and provide a better user experience. Cookies cannot harm your device or files.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        How We Use Cookies
                    </h2>
                    <p className="mb-4 leading-relaxed text-gray-700">
                        Lynkr uses cookies minimally and only for essential functions. We believe in transparency and user privacy, so we've limited our cookie usage to what's absolutely necessary.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        Types of Cookies We Use
                    </h2>

                    <h3 className="mb-3 text-xl font-medium text-gray-800">1. Essential Cookies</h3>
                    <p className="mb-4 leading-relaxed text-gray-700">
                        These cookies are necessary for the website to function properly and cannot be disabled.
                    </p>
                    <div className="p-4 mb-4 rounded-lg bg-gray-50">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-2 font-medium text-left">Cookie Name</th>
                                    <th className="py-2 font-medium text-left">Purpose</th>
                                    <th className="py-2 font-medium text-left">Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-100">
                                    <td className="py-2 font-mono">next-auth.session-token</td>
                                    <td className="py-2">Authentication session management</td>
                                    <td className="py-2">30 days</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-2 font-mono">next-auth.csrf-token</td>
                                    <td className="py-2">Security protection against CSRF attacks</td>
                                    <td className="py-2">Session</td>
                                </tr>
                                <tr>
                                    <td className="py-2 font-mono">lynkr-preferences</td>
                                    <td className="py-2">Remember user interface preferences</td>
                                    <td className="py-2">1 year</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h3 className="mb-3 text-xl font-medium text-gray-800">2. Analytics Cookies</h3>
                    <p className="mb-4 leading-relaxed text-gray-700">
                        We use minimal analytics to understand how our service is used and to improve it. This data is anonymized and aggregated.
                    </p>
                    <div className="p-4 mb-4 rounded-lg bg-gray-50">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-2 font-medium text-left">Cookie Name</th>
                                    <th className="py-2 font-medium text-left">Purpose</th>
                                    <th className="py-2 font-medium text-left">Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="py-2 font-mono">lynkr-analytics</td>
                                    <td className="py-2">Anonymous usage statistics</td>
                                    <td className="py-2">1 year</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h3 className="mb-3 text-xl font-medium text-gray-800">3. What We DON'T Use</h3>
                    <ul className="pl-6 mb-4 text-gray-700 list-disc">
                        <li>Advertising or marketing cookies</li>
                        <li>Social media tracking cookies</li>
                        <li>Cross-site tracking cookies</li>
                        <li>Third-party advertising networks</li>
                        <li>Behavioral targeting cookies</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        Managing Your Cookie Preferences
                    </h2>

                    <h3 className="mb-3 text-xl font-medium text-gray-800">Browser Settings</h3>
                    <p className="mb-4 leading-relaxed text-gray-700">
                        You can control cookies through your browser settings. Here's how to manage cookies in popular browsers:
                    </p>
                    <ul className="pl-6 mb-4 text-gray-700 list-disc">
                        <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                        <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                        <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                        <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
                    </ul>

                    <h3 className="mb-3 text-xl font-medium text-gray-800">Impact of Disabling Cookies</h3>
                    <p className="mb-4 leading-relaxed text-gray-700">
                        If you disable essential cookies, some features of Lynkr may not work properly:
                    </p>
                    <ul className="pl-6 mb-4 text-gray-700 list-disc">
                        <li>You may need to log in repeatedly</li>
                        <li>Your preferences won't be saved</li>
                        <li>Some security features may not function</li>
                        <li>The service may not work as expected</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        Third-Party Services
                    </h2>
                    <p className="mb-4 leading-relaxed text-gray-700">
                        Lynkr integrates with third-party authentication providers (Google, GitHub, Discord) which may set their own cookies during the login process. These cookies are governed by their respective privacy policies:
                    </p>
                    <ul className="pl-6 mb-4 text-gray-700 list-disc">
                        <li><a href="https://policies.google.com/privacy" className="text-blue-600 hover:text-blue-800" target="_blank">Google Privacy Policy</a></li>
                        <li><a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" className="text-blue-600 hover:text-blue-800" target="_blank">GitHub Privacy Policy</a></li>
                        <li><a href="https://discord.com/privacy" className="text-blue-600 hover:text-blue-800" target="_blank">Discord Privacy Policy</a></li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        Changes to This Cookie Policy
                    </h2>
                    <p className="mb-4 leading-relaxed text-gray-700">
                        We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. We will notify users of any material changes by updating the "Last updated" date at the top of this policy.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        Contact Us
                    </h2>
                    <p className="mb-4 leading-relaxed text-gray-700">
                        If you have questions about our use of cookies or this Policy, please contact us at{' '}
                        <Link href="mailto:hey@lynkr.link" className="text-blue-600 hover:text-blue-800" target="_blank">
                            hey@lynkr.link
                        </Link>{' '}
                    </p>
                </section>
            </div>

            {/* Footer */}
            <div className="pt-8 mt-12 border-t border-gray-200">
                <p className="mb-4 text-sm text-center text-gray-500">
                    This Cookie Policy is part of our commitment to transparency. Review our{' '}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                        Privacy Policy
                    </Link>{' '}
                    for more information about how we handle your data.
                </p>
                <p className="text-xs text-center text-gray-400">
                    This policy is written in accordance with the{' '}
                    <Link
                        href="https://bytebrush.dev/legal/bps"
                        className="text-blue-500 hover:text-blue-700"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        ByteBrush Policy Standard (BPS v1.0)
                    </Link>.
                </p>
            </div>
        </LegalLayout>
    );
};

export default Cookies;
