import { LegalLayout } from '@/components/layout/BaseLayout';
import Link from 'next/link';
import { Shield, Eye, Lock, Download } from 'lucide-react';

const Privacy = () => {
  return (
    <LegalLayout title="Privacy Policy" description="Learn how we protect and handle your data">
      {/* Privacy Highlights */}
      <div className="p-6 mb-8 border border-blue-200 rounded-lg bg-blue-50">
        <h2 className="flex items-center mb-4 text-xl font-semibold text-blue-900">
          <Shield className="w-5 h-5 mr-2" />
          Privacy Highlights
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start">
            <Eye className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Data You Control</h3>
              <p className="text-sm text-blue-700">You own all your content and can export or delete it anytime.</p>
            </div>
          </div>
          <div className="flex items-start">
            <Lock className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">No Data Sales</h3>
              <p className="text-sm text-blue-700">We never sell your personal information to third parties.</p>
            </div>
          </div>
          <div className="flex items-start">
            <Download className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Open Source</h3>
              <p className="text-sm text-blue-700">Our code is public and transparent for security review.</p>
            </div>
          </div>
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Minimal Collection</h3>
              <p className="text-sm text-blue-700">We only collect data necessary to provide our services.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <p className="mb-8 text-sm text-gray-600">
        Last updated: August 4, 2025
      </p>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            1. Information We Collect
          </h2>

          <h3 className="mb-3 text-xl font-medium text-gray-800">Account Information</h3>
          <p className="mb-4 leading-relaxed text-gray-700">
            When you create an account through OAuth providers, we collect:
          </p>
          <ul className="pl-6 mb-4 text-gray-700 list-disc">
            <li>Email address from your OAuth provider</li>
            <li>Name and profile picture (if provided by the OAuth provider)</li>
            <li>Unique identifier from the OAuth provider</li>
            <li>Your chosen handle/username</li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-gray-800">Profile and Content Data</h3>
          <ul className="pl-6 mb-4 text-gray-700 list-disc">
            <li>Profile information (bio, custom handle, profile image)</li>
            <li>Links you create and their metadata</li>
            <li>Customization preferences (themes, colors, layouts)</li>
            <li>Sections and organization preferences</li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-gray-800">Usage Analytics</h3>
          <ul className="pl-6 mb-4 text-gray-700 list-disc">
            <li>Page views and click statistics (aggregated and anonymized)</li>
            <li>Device and browser information for analytics</li>
            <li>General location data (country/region level only)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            2. How We Use Your Information
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            We use the collected information solely to:
          </p>
          <ul className="pl-6 mb-4 text-gray-700 list-disc">
            <li>Provide and maintain the Lynkr service</li>
            <li>Authenticate your account and enable secure access</li>
            <li>Display your profile and links to visitors</li>
            <li>Provide analytics about your page performance</li>
            <li>Improve our service based on usage patterns</li>
            <li>Communicate with you about service updates (if necessary)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            3. Data Sharing and Third Parties
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            <strong>We do not sell your personal information.</strong> We may share data only in these limited circumstances:
          </p>
          <ul className="pl-6 mb-4 text-gray-700 list-disc">
            <li><strong>OAuth Providers:</strong> We use Google, GitHub, and Discord for authentication</li>
            <li><strong>Analytics Services:</strong> Aggregated, anonymized data for service improvement</li>
            <li><strong>Legal Requirements:</strong> If required by law or to protect our users</li>
            <li><strong>Service Providers:</strong> Trusted partners who help us operate the service</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            4. Data Security
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            We implement appropriate security measures to protect your information:
          </p>
          <ul className="pl-6 mb-4 text-gray-700 list-disc">
            <li>Secure authentication using industry-standard OAuth 2.0</li>
            <li>Encrypted data transmission (HTTPS)</li>
            <li>Regular security updates and monitoring</li>
            <li>Access controls and authentication for our systems</li>
            <li>Open-source codebase for community security review</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            5. Your Data Rights
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            You have full control over your data:
          </p>
          <ul className="pl-6 mb-4 text-gray-700 list-disc">
            <li><strong>Access:</strong> View all your data through the "View My Data" feature</li>
            <li><strong>Export:</strong> Download a complete copy of your data in JSON format</li>
            <li><strong>Modify:</strong> Edit your profile, links, and preferences at any time</li>
            <li><strong>Delete:</strong> Permanently delete your account and all associated data</li>
            <li><strong>Portability:</strong> Export your data to use with other services</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            6. Data Retention
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            We retain your data for as long as your account is active. When you delete your account:
          </p>
          <ul className="pl-6 mb-4 text-gray-700 list-disc">
            <li>All personal data is immediately removed from our active systems</li>
            <li>Anonymized analytics data may be retained for service improvement</li>
            <li>Backups are securely deleted within 30 days</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            7. Cookies and Tracking
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            Lynkr uses minimal cookies and tracking:
          </p>
          <ul className="pl-6 mb-4 text-gray-700 list-disc">
            <li><strong>Essential Cookies:</strong> Required for authentication and service functionality</li>
            <li><strong>Analytics:</strong> Anonymous usage statistics to improve the service</li>
            <li><strong>No Advertising Cookies:</strong> We don't use advertising or marketing cookies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            8. International Users
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            Lynkr is available globally. If you're located outside the country where our servers are hosted, your information may be transferred and processed in that location. We ensure appropriate safeguards are in place for international data transfers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            9. Children's Privacy
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            Lynkr is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us so we can take appropriate action.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            10. Changes to This Policy
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            We may update this Privacy Policy from time to time. We will notify users of any material changes by updating the "Last updated" date at the top of this policy. Continued use of the service after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            11. Contact Us
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            If you have questions about this Policy or our data practices, please contact us at{' '}
            <Link href="mailto:hey@lynkr.link" className="text-blue-600 hover:text-blue-800" target="_blank">
              hey@lynkr.link
            </Link>{' '}
          </p>
        </section>
      </div>

      {/* Footer */}
      <div className="pt-8 mt-12 border-t border-gray-200">
        <p className="mb-4 text-sm text-center text-gray-500">
          Lynkr is committed to transparency. Our{' '}
          <Link
            href="https://github.com/LynkrApp/Website"
            className="text-blue-600 hover:text-blue-800"
            target="_blank"
          >
            source code
          </Link>{' '}
          is available for review to ensure these privacy practices are followed.
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

export default Privacy;
