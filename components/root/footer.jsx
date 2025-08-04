import Link from 'next/link';
import {
  GithubIcon,
  TwitterIcon,
  GlobeIcon,
  Mail,
  Heart,
  ExternalLink
} from 'lucide-react';
import Image from 'next/image';

const Footer = ({ className = "" }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Join our Team', href: '/careers' },
      { label: 'Changelog', href: '/changelog' }
    ],
    extras: [
      { label: 'Follow us on Twitter', href: 'https://x.com/HeyLynkr' },
      { label: 'Follow us on GitHub', href: 'https://github.com/LynkrApp' },
      { label: 'Join our Discord', href: 'https://discord.gg/g76w2v7RzG' },
      { label: 'View our Status', href: 'https://lynkr.instatus.com' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'GDPR', href: '/gdpr' }
    ]
  };

  const socialLinks = [
    {
      label: 'Twitter',
      href: 'https://x.com/HeyLynkr',
      icon: TwitterIcon,
      color: 'hover:text-blue-400'
    },
    {
      label: 'GitHub',
      href: 'https://github.com/LynkrApp',
      icon: GithubIcon,
      color: 'hover:text-gray-600'
    },
    {
      label: 'Website',
      href: 'https://codemeapixel.dev',
      icon: GlobeIcon,
      color: 'hover:text-green-500'
    },
    {
      label: 'Email',
      href: 'mailto:hello@lynkr.link',
      icon: Mail,
      color: 'hover:text-red-500'
    }
  ];

  return (
    <footer className={`bg-slate-900 text-white ${className}`}>
      <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link
              className="flex items-center gap-2 mb-4 text-xl font-bold transition-colors hover:text-blue-400"
              href="/"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <Image
                  src="/logo.png"
                  alt="Lynkr Logo"
                  width={32}
                  height={32}
                  className="text-sm font-bold text-white"
                />
              </div>
              <span>Lynkr</span>
            </Link>
            <p className="max-w-md mb-6 text-gray-400">
              The ultimate free & open source link in bio platform. Create beautiful,
              organized link pages that drive engagement and grow your audience.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 ${social.color} transition-colors p-2 rounded-lg hover:bg-slate-800`}
                    aria-label={social.label}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Information</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Extra Links */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Extras</h3>
            <ul className="space-y-3">
              {footerLinks.extras.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 text-sm text-gray-400 sm:flex-row sm:items-center">
              <span>
                © {currentYear} Lynkr. All rights reserved.
              </span>
              <div className="flex items-center gap-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>by</span>
                <a
                  className="transition-colors text-emerald-400 hover:text-emerald-300"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://bytebrush.dev"
                >
                  ByteBrush Studios
                </a>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <a
                href="https://github.com/LynkrApp/Website"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
              >
                <GithubIcon className="w-4 h-4" />
                Open Source
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-gray-600">|</span>
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
