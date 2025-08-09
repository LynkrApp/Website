import Link from 'next/link';
import {
  GithubIcon,
  TwitterIcon,
  Mail,
  Heart,
  ExternalLink,
} from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import packageInfo from '../../package.json';
import { FaDiscord } from 'react-icons/fa';
import React from 'react';

const Footer = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();
  const [versionInfo, setVersionInfo] = useState({
    version: packageInfo.version || 'v0.0.0',
    gitHash: 'dev',
  });

  useEffect(() => {
    // Fetch the latest git hash from our API
    const fetchVersionInfo = async () => {
      try {
        const response = await fetch('/api/version');
        if (response.ok) {
          const data = await response.json();
          setVersionInfo({
            version: packageInfo.version,
            gitHash: data.gitHash || 'dev',
          });
        }
      } catch (error) {
        console.error('Failed to fetch version info:', error);
      }
    };

    fetchVersionInfo();
  }, []);

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Join our Team', href: '/careers' },
      { label: 'Press Kit', href: '/press' },
    ],
    extras: [
      { label: 'Follow us on Twitter', href: '/twitter' },
      { label: 'Follow us on GitHub', href: '/github' },
      { label: 'Join our Discord', href: '/discord' },
      { label: 'View our Status', href: '/status' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'GDPR Policy', href: '/gdpr' },
    ],
  };

  const socialLinks: {
    label: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
  }[] = [
    {
      label: 'Discord',
      href: '/discord',
      icon: FaDiscord as React.ComponentType<React.SVGProps<SVGSVGElement>>,
      color: 'hover:text-blue-600',
    },
    {
      label: 'Twitter',
      href: '/twitter',
      icon: TwitterIcon,
      color: 'hover:text-blue-400',
    },
    {
      label: 'GitHub',
      href: '/github',
      icon: GithubIcon,
      color: 'hover:text-gray-600',
    },
    {
      label: 'Email',
      href: 'mailto:hello@lynkr.link',
      icon: Mail,
      color: 'hover:text-red-500',
    },
  ];

  return (
    <footer className={`bg-slate-900 text-white ${className}`}>
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-10 mb-12 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-4">
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
            <p className="max-w-md mb-6 text-sm text-gray-400">
              The ultimate free & open source link in bio platform. Create
              beautiful, organized link pages that drive engagement and grow
              your audience.
            </p>
            <div className="flex items-center gap-3">
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

          {/* Navigation Links Sections */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-8 sm:gap-10">
            {/* Company Links */}
            <div>
              <h3 className="mb-4 font-semibold text-white">Company</h3>
              <ul className="space-y-2.5">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 transition-colors hover:text-white"
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
              <ul className="space-y-2.5">
                {footerLinks.extras.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 transition-colors hover:text-white"
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
              <ul className="space-y-2.5">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-slate-800">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3 text-sm text-gray-400 sm:flex-row sm:items-center">
              <span>© {currentYear} Lynkr. All rights reserved.</span>
              <div className="hidden sm:flex sm:items-center sm:gap-1">
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

            <div className="flex flex-wrap items-center justify-between gap-4 text-sm md:justify-end">
              <a
                href="https://github.com/LynkrApp/Website"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-gray-400 transition-colors hover:text-white"
              >
                <GithubIcon className="w-4 h-4" />
                <span>Open Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="hidden text-gray-600 md:inline">|</span>
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
              <span className="hidden text-gray-600 md:inline">|</span>
              <Link
                href="/changelog"
                className="text-xs text-gray-500 transition-colors hover:text-gray-300"
              >
                {versionInfo.version}{' '}
                <span className="font-mono">
                  ({versionInfo.gitHash.substring(0, 7)})
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
