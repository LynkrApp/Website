import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Menu, X, User, Settings, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import UserAccountNavDesktop from '../utils/usernavbutton-desktop';

const Navbar = ({ transparent = false, className = "" }) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic navbar classes based on scroll state
  const getNavbarClasses = () => {
    if (transparent && !isScrolled) {
      return 'bg-transparent border-transparent';
    }

    if (isScrolled) {
      return 'bg-white/95 backdrop-blur-md border-gray-200 shadow-sm';
    }

    return 'bg-white/80 backdrop-blur-md border-gray-200';
  };

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: 'https://discord.gg/g76w2v7RzG', label: 'Discord' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 ${getNavbarClasses()} border-b transition-all duration-300 ease-in-out z-50 ${className}`}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            className="flex items-center gap-2 text-xl font-bold text-gray-900 transition-colors hover:text-blue-600"
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
                className="font-medium text-gray-600 transition-colors hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              className="p-2 transition-colors rounded-lg md:hidden hover:bg-gray-100"
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
                    <button className="flex items-center gap-2 px-4 py-2 transition-colors rounded-lg hover:bg-gray-100">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
                        <UserAccountNavDesktop />
                      </div>
                      <span className="ml-2 font-medium text-gray-900">
                        {session.user?.name || 'User'}
                      </span>
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content className="bg-white rounded-xl shadow-lg border border-gray-200 p-2 min-w-[200px] z-50">
                      <DropdownMenu.Item asChild>
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100"
                        >
                          <Settings className="w-4 h-4" />
                          Dashboard
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item asChild>
                        <Link
                          href="/admin/settings"
                          className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator className="h-px my-1 bg-gray-200" />
                      <DropdownMenu.Item
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-red-50 hover:text-red-600"
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
                    className="px-4 py-2 font-medium text-gray-600 transition-colors hover:text-blue-600"
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
          <div className="absolute left-0 right-0 bg-white border-b border-gray-200 shadow-lg md:hidden top-full">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 font-medium text-gray-600 transition-colors hover:text-blue-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-200">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 py-2 font-medium text-gray-600 transition-colors hover:text-blue-600"
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
                      className="flex items-center w-full gap-3 py-2 font-medium text-left text-red-600 transition-colors hover:text-red-700"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      className="block py-2 font-medium text-gray-600 transition-colors hover:text-blue-600"
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
