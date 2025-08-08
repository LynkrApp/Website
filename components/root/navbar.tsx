import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Menu, X, Settings, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import UserAccountNavDesktop from '../utils/usernavbutton-desktop';

const Navbar = ({ transparent = false, className = "" }) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: 'https://discord.gg/g76w2v7RzG', label: 'Discord' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 bg-slate-900 border-slate-800 border-b z-50 ${className}`}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            className="flex items-center gap-2 text-xl font-bold text-white transition-colors hover:text-blue-400"
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
            <span className="lg:block">Lynkr</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-slate-300 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              className="p-2 text-slate-300 transition-colors rounded-lg md:hidden hover:bg-slate-800 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Desktop Auth */}
            <div className="items-center hidden gap-3 md:flex">
              {isAuthenticated ? (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="flex items-center gap-2 px-4 py-2 transition-colors rounded-lg text-white hover:bg-slate-800">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
                        <UserAccountNavDesktop />
                      </div>
                      <span className="ml-2 font-medium">
                        {session.user?.name || 'User'}
                      </span>
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 p-2 min-w-[200px] z-50">
                      <DropdownMenu.Item asChild>
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-slate-300 hover:bg-slate-700 hover:text-white"
                        >
                          <Settings className="w-4 h-4" />
                          Dashboard
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item asChild>
                        <Link
                          href="/admin/settings"
                          className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-slate-300 hover:bg-slate-700 hover:text-white"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator className="h-px my-1 bg-slate-700" />
                      <DropdownMenu.Item
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-red-900/60 text-slate-300 hover:text-red-200"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 font-medium text-slate-300 transition-colors hover:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 right-0 bg-slate-800 border-b border-slate-700 shadow-lg md:hidden top-full">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 font-medium text-slate-300 transition-colors hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-slate-700">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 py-2 font-medium text-slate-300 transition-colors hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full gap-3 py-2 font-medium text-left text-red-300 transition-colors hover:text-red-200"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      className="block py-2 font-medium text-slate-300 transition-colors hover:text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="block px-4 py-3 font-medium text-center text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;