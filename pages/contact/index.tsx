import Link from 'next/link';
import { ArrowLeft, Github, Mail, MessageCircle, Bug, Lightbulb, Heart } from 'lucide-react';
import { ContentLayout } from '@/components/layout/BaseLayout';

const Contact = () => {
  return (
    <ContentLayout
      title="Contact Us"
      description="Get in touch with the Lynkr team - support, feedback, and contributions welcome"
    >
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <p className="mb-8 text-xl leading-relaxed text-gray-600">
        We'd love to hear from you! Get support, share feedback, or contribute to Lynkr.
      </p>

      {/* Contact Methods */}
      <div className="grid gap-6 mb-12 md:grid-cols-2">
        {/* GitHub Issues */}
        <div className="p-6 transition-shadow bg-white border border-gray-200 rounded-lg hover:shadow-md">
          <div className="flex items-center mb-4">
            <Github className="w-8 h-8 mr-3 text-gray-900" />
            <h3 className="text-xl font-semibold text-gray-900">GitHub Issues</h3>
          </div>
          <p className="mb-4 text-gray-700">
            The best way to report bugs, request features, or get technical support.
          </p>
          <Link
            href="https://github.com/LynkrApp/Website/issues"
            target="_blank"
            className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800"
          >
            Open an Issue
            <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
          </Link>
        </div>

        {/* GitHub Discussions */}
        <div className="p-6 transition-shadow bg-white border border-gray-200 rounded-lg hover:shadow-md">
          <div className="flex items-center mb-4">
            <MessageCircle className="w-8 h-8 mr-3 text-blue-500" />
            <h3 className="text-xl font-semibold text-gray-900">Discussions</h3>
          </div>
          <p className="mb-4 text-gray-700">
            Join the community to ask questions, share ideas, or get help from other users.
          </p>
          <Link
            href="https://github.com/LynkrApp/Website/discussions"
            target="_blank"
            className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800"
          >
            Join Discussion
            <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
          </Link>
        </div>
      </div>

      {/* What to Contact Us About */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">
          What Can We Help You With?
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Bug Reports */}
          <div className="p-6 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center mb-3">
              <Bug className="w-6 h-6 mr-3 text-red-500" />
              <h3 className="text-lg font-semibold text-red-900">Bug Reports</h3>
            </div>
            <p className="mb-3 text-sm text-red-700">
              Found something broken? Help us fix it!
            </p>
            <ul className="space-y-1 text-sm text-red-700">
              <li>• Page loading issues</li>
              <li>• Authentication problems</li>
              <li>• Data loss or corruption</li>
              <li>• Mobile responsiveness issues</li>
            </ul>
          </div>

          {/* Feature Requests */}
          <div className="p-6 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-center mb-3">
              <Lightbulb className="w-6 h-6 mr-3 text-blue-500" />
              <h3 className="text-lg font-semibold text-blue-900">Feature Requests</h3>
            </div>
            <p className="mb-3 text-sm text-blue-700">
              Have an idea to make Lynkr better?
            </p>
            <ul className="space-y-1 text-sm text-blue-700">
              <li>• New themes or customization options</li>
              <li>• Integration with other services</li>
              <li>• Analytics improvements</li>
              <li>• Accessibility enhancements</li>
            </ul>
          </div>

          {/* General Support */}
          <div className="p-6 border border-green-200 rounded-lg bg-green-50">
            <div className="flex items-center mb-3">
              <Heart className="w-6 h-6 mr-3 text-green-500" />
              <h3 className="text-lg font-semibold text-green-900">General Support</h3>
            </div>
            <p className="mb-3 text-sm text-green-700">
              Need help using Lynkr?
            </p>
            <ul className="space-y-1 text-sm text-green-700">
              <li>• Account setup and configuration</li>
              <li>• Customization help</li>
              <li>• Best practices</li>
              <li>• Migration assistance</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="pt-8 mt-12 border-t border-gray-200">
        <div className="text-center">
          <p className="mb-4 text-sm text-gray-500">
            Thanks for being part of the Lynkr community! 🎉
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link href="/about" className="text-blue-600 hover:text-blue-800">
              About Us
            </Link>
            <Link href="/terms" className="text-blue-600 hover:text-blue-800">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
              Privacy Policy
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

export default Contact;