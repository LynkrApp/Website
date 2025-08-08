import Link from 'next/link';
import { ArrowLeft, Heart, Users, Code, Zap, Shield, Github } from 'lucide-react';
import { ContentLayout } from '@/components/layout/BaseLayout';

const About = () => {
  return (
    <ContentLayout
      title="About Lynkr"
      description="The ultimate free and open-source link-in-bio platform, built with ❤️ for creators everywhere."
    >
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      {/* Mission Statement */}
      <div className="p-8 mb-12 border border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
        <h2 className="flex items-center mb-4 text-2xl font-semibold text-gray-900">
          <Heart className="w-6 h-6 mr-3 text-red-500" />
          Our Mission
        </h2>
        <p className="text-lg leading-relaxed text-gray-700">
          We believe that everyone should have access to professional, beautiful link-in-bio pages without paying expensive subscription fees or being locked into proprietary platforms. Lynkr democratizes the link-in-bio space by providing a completely free, open-source solution that puts users first.
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">
            What Makes Lynkr Special
          </h2>

          <div className="grid gap-6 mb-8 md:grid-cols-2">
            <div className="p-6 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 mr-3 text-green-500" />
                <h3 className="text-xl font-semibold text-gray-900">100% Free Forever</h3>
              </div>
              <p className="text-gray-700">
                No hidden fees, no premium tiers, no feature limitations. Everything is completely free and always will be.
              </p>
            </div>

            <div className="p-6 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center mb-4">
                <Code className="w-8 h-8 mr-3 text-blue-500" />
                <h3 className="text-xl font-semibold text-gray-900">Open Source</h3>
              </div>
              <p className="text-gray-700">
                Our entire codebase is public on GitHub. Contribute, customize, or host your own instance.
              </p>
            </div>

            <div className="p-6 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center mb-4">
                <Users className="w-8 h-8 mr-3 text-purple-500" />
                <h3 className="text-xl font-semibold text-gray-900">Privacy First</h3>
              </div>
              <p className="text-gray-700">
                Your data belongs to you. We don't sell your information, and you can export or delete your data anytime.
              </p>
            </div>

            <div className="p-6 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 mr-3 text-yellow-500" />
                <h3 className="text-xl font-semibold text-gray-900">Feature Rich</h3>
              </div>
              <p className="text-gray-700">
                Analytics, themes, sections, custom buttons, and more. All the features you need in one platform.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            The Story Behind Lynkr
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            Lynkr was born out of frustration with existing link-in-bio platforms that charge monthly fees for basic features or lock users into proprietary ecosystems. We saw creators, small businesses, and individuals struggling to find an affordable solution that didn't compromise on functionality or design.
          </p>
          <p className="mb-4 leading-relaxed text-gray-700">
            Our founding principle is simple: powerful tools should be accessible to everyone. Whether you're a content creator just starting out, a small business owner, or someone who wants to organize their online presence, you shouldn't have to pay premium prices for basic functionality.
          </p>
          <p className="mb-4 leading-relaxed text-gray-700">
            By making Lynkr open-source, we ensure that the platform remains transparent, secure, and community-driven. Anyone can contribute to the project, suggest features, report bugs, or even host their own instance with custom modifications.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            Core Features
          </h2>
          <div className="p-6 rounded-lg bg-gray-50">
            <ul className="grid gap-3 text-gray-700 md:grid-cols-2">
              <li className="flex items-center">
                <span className="w-2 h-2 mr-3 bg-blue-500 rounded-full"></span>
                Custom handles and URLs
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 mr-3 bg-blue-500 rounded-full"></span>
                Beautiful themes and color palettes
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 mr-3 bg-blue-500 rounded-full"></span>
                Organized link sections
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 mr-3 bg-blue-500 rounded-full"></span>
                Click and view analytics
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 mr-3 bg-blue-500 rounded-full"></span>
                Multiple social account linking
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 mr-3 bg-blue-500 rounded-full"></span>
                Data export and privacy controls
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 mr-3 bg-blue-500 rounded-full"></span>
                Mobile-responsive design
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 mr-3 bg-blue-500 rounded-full"></span>
                Fast loading and SEO optimized
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            Technology Stack
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            Lynkr is built with modern, reliable technologies to ensure a fast, secure, and scalable experience:
          </p>
          <div className="p-6 rounded-lg bg-gray-50">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <h4 className="mb-2 font-semibold text-gray-900">Frontend</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>Next.js 13</li>
                  <li>React 18</li>
                  <li>Tailwind CSS</li>
                  <li>React Query</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-gray-900">Backend</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>Next.js API Routes</li>
                  <li>NextAuth.js</li>
                  <li>Prisma ORM</li>
                  <li>PostgreSQL</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-gray-900">Authentication</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>OAuth 2.0</li>
                  <li>Google</li>
                  <li>GitHub</li>
                  <li>Discord</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            Community and Contributing
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            Lynkr thrives on community contributions. Whether you're a developer, designer, or just someone with great ideas, there are many ways to get involved:
          </p>
          <ul className="pl-6 mb-6 text-gray-700 list-disc">
            <li>Report bugs or suggest features on GitHub</li>
            <li>Contribute code improvements or new features</li>
            <li>Help with documentation and translations</li>
            <li>Share Lynkr with others who might benefit</li>
            <li>Star our repository to show support</li>
          </ul>

          <div className="p-6 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-center mb-3">
              <Github className="w-6 h-6 mr-3 text-gray-900" />
              <h3 className="text-lg font-semibold text-gray-900">Join Us on GitHub</h3>
            </div>
            <p className="mb-4 text-gray-700">
              Check out our source code, contribute to the project, or report issues.
            </p>
            <Link
              href="https://github.com/LynkrApp/Website"
              target="_blank"
              className="inline-flex items-center px-4 py-2 text-white transition-colors bg-gray-900 rounded-lg hover:bg-gray-800"
            >
              <Github className="w-4 h-4 mr-2" />
              View on GitHub
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            Commitment to Users
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700">
            We're committed to maintaining Lynkr as a free, open-source platform that serves its users first. Our promises to you:
          </p>
          <ul className="pl-6 mb-4 text-gray-700 list-disc">
            <li><strong>Always Free:</strong> Core features will never be locked behind paywalls</li>
            <li><strong>Privacy Focused:</strong> Your data is yours, and we'll never sell it</li>
            <li><strong>Transparent:</strong> Open-source code means you can see exactly what we do</li>
            <li><strong>Community-Driven:</strong> Feature development guided by user needs</li>
            <li><strong>Reliable:</strong> Built to last with modern, scalable technology</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            Get Started Today
          </h2>
          <p className="mb-6 leading-relaxed text-gray-700">
            Ready to create your own beautiful link-in-bio page? Join thousands of users who've already made the switch to Lynkr.
          </p>
          <div className="text-center">
            <Link
              href="/register"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Create Your Free Account
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="pt-8 mt-12 border-t border-gray-200">
        <div className="text-center">
          <p className="mb-2 text-sm text-gray-500">
            Built with ❤️ by the open-source community
          </p>
          <div className="flex justify-center space-x-6 text-sm">
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

export default About;
