import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Link2,
  BarChart,
  CircleDot,
  Settings2,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import UserAccountNavDesktop from '@/components/utils/usernavbutton-desktop';
import ShareButton from '@/components/utils/share-button';
import VisitPageButton from '@/components/utils/visit-page-button';
import GithubButton from '@/components/utils/github-button';
import ShareModal from '@/components/shared/modals/share-modal';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

const navItems = [
  {
    title: 'Links',
    href: '/admin',
    icon: <Link2 size={20} />,
  },
  {
    title: 'Customize',
    href: '/admin/customize',
    icon: <CircleDot size={20} />,
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: <BarChart size={20} />,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: <Settings2 size={20} />,
  },
];

const Navbar = ({ showName = false, isHomePage = true }) => {
  const session = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="z-40 top-0 w-[100vw] border-b border-b-slate-200 border-slate-800 bg-slate-900 text-white shadow-md">
      <div className="px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link
              className="flex items-center gap-2 text-xl font-bold text-white transition-colors hover:text-blue-400"
              href="/"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <Image
                  src="/logo.png"
                  alt="Lynkr Logo"
                  width={36}
                  height={36}
                  className="text-sm font-bold text-white"
                />
              </div>
              <span className="hidden sm:block">Lynkr</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:ml-6 space-x-1">
              {navItems.map((item) => {
                const isActive = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Side - User Controls */}
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              className="p-2 rounded-lg md:hidden text-slate-300 hover:text-white hover:bg-slate-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop Controls */}
            {session.status === 'authenticated' && (
              <div className="flex items-center gap-3">
                {/* Visit Page Button */}
                <div className="hidden md:block">
                  <VisitPageButton darkMode />
                </div>

                {/* Share Button */}
                <Dialog.Root>
                  <Dialog.Trigger>
                    <ShareButton darkMode />
                  </Dialog.Trigger>
                  <ShareModal />
                </Dialog.Root>

                {/* GitHub Button */}
                <div className="hidden lg:block">
                  <GithubButton darkMode />
                </div>

                {/* User Profile */}
                <UserAccountNavDesktop />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 shadow-lg">
          <nav className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    isActive
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </Link>
              );
            })}

            {session.status === 'authenticated' && (
              <Link
                href={`/${(session.data?.user as any)?.handle || ''}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-3 mt-2 rounded-lg bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ExternalLink size={18} />
                <span>Visit your page</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
