import { LegalLayout } from '@/components/layout/BaseLayout';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
  return (
    <LegalLayout title="Terms of Service" description="Terms of Service for Lynkr - The Ultimate Free & Open Source Link in Bio Platform">
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
          Terms of Service
        </h1>
        <p className="text-lg text-gray-600">
          Last updated: August 4, 2025
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            1. Acceptance of Terms
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            By accessing and using Lynkr ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            2. Description of Service
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            Lynkr is a free, open-source link-in-bio platform that allows users to create customizable landing pages with multiple links. The service includes features such as:
          </p>
          <ul className="pl-6 mb-4 text-gray-700 list-disc">
            <li>Custom link pages with personalized handles</li>
            <li>Theme customization and styling options</li>
            <li>Analytics and click tracking</li>
            <li>Account linking and management</li>
            <li>Data export capabilities</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            3. User Accounts and Responsibilities
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            To use Lynkr, you must create an account using supported OAuth providers (Google, GitHub, Discord). You are responsible for:
          </p>
          <ul className="pl-6 mb-4 text-gray-700 list-disc">
            <li>Maintaining accurate account information</li>
            <li>Keeping your account secure</li>
            <li>All activities that occur under your account</li>
            <li>Ensuring your content complies with applicable laws</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            4. Acceptable Use Policy
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            You agree not to use Lynkr for any unlawful purpose or to engage in any activity that:
          </p>
          <ul className="pl-6 mb-4 text-gray-700 list-disc">
            <li>Violates any applicable laws or regulations</li>
            <li>Infringes on intellectual property rights</li>
            <li>Contains malicious software or harmful content</li>
            <li>Harasses, threatens, or harms others</li>
            <li>Spreads false or misleading information</li>
            <li>Attempts to gain unauthorized access to our systems</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            5. Content and Intellectual Property
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            You retain ownership of all content you create and upload to Lynkr. By using our service, you grant us a limited license to display and distribute your content as necessary to provide the service.
          </p>
          <p className="mb-4 leading-relaxed text-gray-700">
            Lynkr is open-source software. The source code is available under the MIT License, which allows for free use, modification, and distribution.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            6. Privacy and Data Protection
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            Your privacy is important to us. Please review our{' '}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
              Privacy Policy
            </Link>{' '}
            to understand how we collect, use, and protect your information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            7. Service Availability
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            While we strive to maintain high availability, Lynkr is provided "as is" without guarantees of uptime or uninterrupted service. We may perform maintenance or updates that temporarily affect service availability.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            8. Limitation of Liability
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            Lynkr is provided free of charge. To the maximum extent permitted by law, we disclaim all warranties and shall not be liable for any damages arising from the use or inability to use our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            9. Account Termination
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            You may delete your account at any time through your account settings. We may suspend or terminate accounts that violate these terms. Upon termination, all your data will be permanently deleted.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            10. Changes to Terms
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of the service constitutes acceptance of modified terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            11. Contact Information
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            If you have questions about these Terms of Service, please contact us at{' '}
            <Link href="mailto:hey@lynkr.link" className="text-blue-600 hover:text-blue-800" target="_blank">
              hey@lynkr.link
            </Link>.
          </p>
        </section>
      </div>

      {/* Footer */}
      <div className="pt-8 mt-12 border-t border-gray-200">
        <p className="mb-4 text-sm text-center text-gray-500">
          Lynkr is open-source software available on{' '}
          <Link
            href="https://github.com/LynkrApp/Website"
            className="text-blue-600 hover:text-blue-800"
            target="_blank"
          >
            GitHub
          </Link>
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

export default Terms;
