import { LegalLayout } from '@/components/layout/BaseLayout';
import Link from 'next/link';
import { ArrowLeft, Shield, Download, Trash2, Eye, Mail, CheckCircle } from 'lucide-react';

const GDPR = () => {
    return (
        <LegalLayout title="GDPR Compliance" description="Your data rights and how Lynkr protects your privacy under European data protection law">
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
                    GDPR Compliance
                </h1>
                <p className="text-lg text-gray-600">
                    Your rights under the General Data Protection Regulation
                </p>
                <p className="mt-2 text-sm text-gray-500">
                    Last updated: August 4, 2025
                </p>
            </div>

            {/* GDPR Rights Overview */}
            <div className="p-6 mb-8 border border-green-200 rounded-lg bg-green-50">
                <h2 className="flex items-center mb-4 text-xl font-semibold text-green-900">
                    <Shield className="w-5 h-5 mr-2" />
                    Your GDPR Rights
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start">
                        <Eye className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-green-900">Right to Access</h3>
                            <p className="text-sm text-green-700">View all your personal data we hold</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <Download className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-green-900">Data Portability</h3>
                            <p className="text-sm text-green-700">Export your data in a machine-readable format</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <Trash2 className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-green-900">Right to Erasure</h3>
                            <p className="text-sm text-green-700">Delete your account and all personal data</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-green-900">Right to Rectification</h3>
                            <p className="text-sm text-green-700">Correct or update your personal information</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
                <section className="mb-8">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        What is GDPR?
                    </h2>
                    <p className="mb-4 leading-relaxed text-gray-700">
                        The General Data Protection Regulation (GDPR) is a comprehensive data protection law that came into effect on May 25, 2018. It applies to all organizations that process personal data of individuals in the European Union, regardless of where the organization is located.
                    </p>
                    <p className="mb-4 leading-relaxed text-gray-700">
                        At Lynkr, we are committed to protecting your privacy and ensuring compliance with GDPR requirements, even if you're not located in the EU. We believe everyone deserves strong data protection rights.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        Legal Basis for Processing
                    </h2>
                    <p className="mb-4 leading-relaxed text-gray-700">
                        Under GDPR, we must have a legal basis for processing your personal data. Here's how we process your data:
                    </p>
                    <div className="p-4 mb-4 rounded-lg bg-gray-50">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-2 font-medium text-left">Data Type</th>
                                    <th className="py-2 font-medium text-left">Legal Basis</th>
                                    <th className="py-2 font-medium text-left">Purpose</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-100">
                                    <td className="py-2">Account Information</td>
                                    <td className="py-2">Contract Performance</td>
                                    <td className="py-2">Provide the service you signed up for</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-2">Usage Analytics</td>
                                    <td className="py-2">Legitimate Interest</td>
                                    <td className="py-2">Improve service performance and security</td>
                                </tr>
                                <tr>
                                    <td className="py-2">Communication</td>
                                    <td className="py-2">Consent</td>
                                    <td className="py-2">Send important service updates (if opted in)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        Your Data Rights in Detail
                    </h2>

                    <h3 className="mb-3 text-xl font-medium text-gray-800">1. Right of Access (Article 15)</h3>
                    <p className="mb-4 leading-relaxed text-gray-700">
                        You have the right to know what personal data we hold about you and how we use it.
                    </p>
                    <div className="p-4 mb-4 border-l-4 border-blue-400 bg-blue-50">
                        <p className="font-medium text-blue-800">How to exercise this right:</p>
                        <p className="mt-1 text-sm text-blue-700">
                            Go to your account settings and click "View My Data" to see all information we have about you.
                        </p>
                    </div>

                    <h3 className="mb-3 text-xl font-medium text-gray-800">2. Right to Rectification (Article 16)</h3>
                    <p className="mb-4 leading-relaxed text-gray-700">
                        You can correct or update any inaccurate or incomplete personal data.
                    </p>
                    <div className="p-4 mb-4 border-l-4 border-blue-400 bg-blue-50">
                        <p className="font-medium text-blue-800">How to exercise this right:</p>
                        <p className="mt-1 text-sm text-blue-700">
                            Update your profile information directly in your account settings at any time.
                        </p>
                    </div>

                    <h3 className="mb-3 text-xl font-medium text-gray-800">3. Right to Erasure (Article 17)</h3>
                    <p className="mb-4 leading-relaxed text-gray-700">
                        Also known as the "right to be forgotten," you can request deletion of your personal data.
                    </p>
                    <div className="p-4 mb-4 border-l-4 border-blue-400 bg-blue-50">
                        <p className="font-medium text-blue-800">How to exercise this right:</p>
                        <p className="mt-1 text-sm text-blue-700">
                            Go to account settings and click "Delete Account" to permanently remove all your data.
                        </p>
                    </div>

                    <h3 className="mb-3 text-xl font-medium text-gray-800">4. Right to Data Portability (Article 20)</h3>
                    <p className="mb-4 leading-relaxed text-gray-700">
                        You can export your data in a commonly used, machine-readable format.
                    </p>
                    <div className="p-4 mb-4 border-l-4 border-blue-400 bg-blue-50">
                        <p className="font-medium text-blue-800">How to exercise this right:</p>
                        <p className="mt-1 text-sm text-blue-700">
                            Use the "Export Data" feature in your account settings to download a complete JSON file of your data.
                        </p>
                    </div>

                    <h3 className="mb-3 text-xl font-medium text-gray-800">5. Right to Object (Article 21)</h3>
                    <p className="mb-4 leading-relaxed text-gray-700">
                        You can object to processing based on legitimate interests or for direct marketing.
                    </p>
                    <div className="p-4 mb-4 border-l-4 border-blue-400 bg-blue-50">
                        <p className="font-medium text-blue-800">How to exercise this right:</p>
                        <p className="mt-1 text-sm text-blue-700">
                            Contact us through GitHub or adjust your privacy settings to limit data processing.
                        </p>
                    </div>

                    <h3 className="mb-3 text-xl font-medium text-gray-800">6. Right to Restrict Processing (Article 18)</h3>
                    <p className="mb-4 leading-relaxed text-gray-700">
                        You can limit how we process your data in certain circumstances.
                    </p>
                    <div className="p-4 mb-4 border-l-4 border-blue-400 bg-blue-50">
                        <p className="font-medium text-blue-800">How to exercise this right:</p>
                        <p className="mt-1 text-sm text-blue-700">
                            Contact us to discuss specific restrictions on data processing.
                        </p>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        Data Protection by Design
                    </h2>
                    <p className="mb-4 leading-relaxed text-gray-700">
                        Lynkr implements "Privacy by Design" principles:
                    </p>
                    <ul className="pl-6 mb-4 text-gray-700 list-disc">
                        <li><strong>Data Minimization:</strong> We only collect data necessary for the service</li>
                        <li><strong>Purpose Limitation:</strong> Data is only used for stated purposes</li>
                        <li><strong>Storage Limitation:</strong> Data is kept only as long as necessary</li>
                        <li><strong>Accuracy:</strong> You can update your information at any time</li>
                        <li><strong>Security:</strong> Appropriate technical and organizational measures</li>
                        <li><strong>Transparency:</strong> Clear information about data processing</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        Data Transfers
                    </h2>
                    <p className="mb-4 leading-relaxed text-gray-700">
                        If you're in the EU and your data is transferred outside the European Economic Area (EEA), we ensure adequate protection through:
                    </p>
                    <ul className="pl-6 mb-4 text-gray-700 list-disc">
                        <li>Standard Contractual Clauses approved by the European Commission</li>
                        <li>Adequacy decisions by the European Commission</li>
                        <li>Appropriate safeguards as required by GDPR</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        Data Breach Notification
                    </h2>
                    <p className="mb-4 leading-relaxed text-gray-700">
                        In the unlikely event of a data breach that poses a high risk to your rights and freedoms, we will:
                    </p>
                    <ul className="pl-6 mb-4 text-gray-700 list-disc">
                        <li>Notify the relevant supervisory authority within 72 hours</li>
                        <li>Inform affected users without undue delay</li>
                        <li>Describe the nature of the breach and likely consequences</li>
                        <li>Explain measures taken to address the breach</li>
                        <li>Provide contact information for further inquiries</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        Supervisory Authority
                    </h2>
                    <p className="mb-4 leading-relaxed text-gray-700">
                        If you're in the EU and have concerns about how we handle your personal data, you have the right to lodge a complaint with your local data protection authority. You can find your local authority at:
                    </p>
                    <p className="mb-4 text-gray-700">
                        <a
                            href="https://edpb.europa.eu/about-edpb/about-edpb/members_en"
                            className="text-blue-600 hover:text-blue-800"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            European Data Protection Board - Member Authorities
                        </a>
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        Contact Our Data Protection Officer
                    </h2>
                    <p className="mb-4 leading-relaxed text-gray-700">
                        For GDPR-related questions or to exercise your rights, please contact us through:
                    </p>
                    <div className="p-4 mb-4 rounded-lg bg-gray-50">
                        <div className="flex items-center mb-2">
                            <Mail className="w-4 h-4 mr-2 text-gray-600" />
                            <span className="font-medium">GitHub Issues:</span>
                        </div>
                        <p className="ml-6 text-sm text-gray-600">
                            <a
                                href="https://github.com/LynkrApp/Website/issues"
                                className="text-blue-600 hover:text-blue-800"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Open a GDPR-related issue on our repository
                            </a>
                        </p>
                        <p className="mt-2 ml-6 text-xs text-gray-500">
                            We will respo   nd to GDPR requests within 30 days as required by law.
                        </p>
                    </div>
                    <div className="p-4 mb-4 rounded-lg bg-gray-50">
                        <div className="flex items-center mb-2">
                            <Mail className="w-4 h-4 mr-2 text-gray-600" />
                            <span className="font-medium">Email Us:</span>
                        </div>
                        <p className="ml-6 text-sm text-gray-600">
                            <a
                                href="mailto:legal@lynkr.link"
                                className="text-blue-600 hover:text-blue-800"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Send an email to: legal@lynkr.link
                            </a>
                        </p>
                        <p className="mt-2 ml-6 text-xs text-gray-500">
                            We will respond to GDPR requests within 30 days as required by law.
                        </p>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                        Updates to GDPR Compliance
                    </h2>
                    <p className="mb-4 leading-relaxed text-gray-700">
                        We regularly review our GDPR compliance practices and update this page as needed. Any significant changes will be communicated through our usual channels.
                    </p>
                </section>
            </div>

            {/* Footer */}
            <div className="pt-8 mt-12 border-t border-gray-200">
                <p className="mb-4 text-sm text-center text-gray-500">
                    This GDPR compliance page is part of our broader privacy framework. See also our{' '}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                        Privacy Policy
                    </Link>{' '}
                    and{' '}
                    <Link href="/cookies" className="text-blue-600 hover:text-blue-800">
                        Cookie Policy
                    </Link>.
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

export default GDPR;
