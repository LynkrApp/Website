import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MetaTags } from '@/components/meta/metadata';
import { HomeLayout } from '@/components/layout/BaseLayout';
import PreviewCarousel from '@/components/root/preview-carousel';

/* eslint-disable @next/next/no-img-element */
import { CiStar } from 'react-icons/ci';

import {
  Zap,
  Shield,
  Palette,
  BarChart3,
  Users,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const StarIcon = CiStar as React.ComponentType<React.SVGProps<SVGSVGElement>>;

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      description:
        'Create your link in bio page in seconds with our intuitive interface.',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '100% Free & Open Source',
      description:
        'No hidden fees, no locked features. Completely free forever.',
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: 'Fully Customizable',
      description:
        'Choose from themes, colors, and custom buttons to match your brand.',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Analytics Included',
      description:
        'Track clicks, views, and user engagement with built-in analytics.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Organized Sections',
      description:
        'Group your links into sections for better organization and user experience.',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Modern Design',
      description:
        'Beautiful, responsive design that looks great on all devices.',
    },
  ];

  return (
    <>
      <HomeLayout>
        <div className="-z-10 h-full w-full">
          <div className="relative overflow-hidden">
            {/* Hero Section with Slate Gradient */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-[#376878]">
              {/* Background Pattern Overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="h-full w-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
              </div>

              <div className="relative pt-6 pb-16 sm:pb-24">
                <div className="px-4 mx-auto mt-24 max-w-7xl sm:mt-20 sm:px-6">
                  {/* GitHub Star button */}
                  <div className="flex items-center justify-center mb-8">
                    <motion.a
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="group inline-flex items-center gap-2 px-4 py-2 text-sm bg-slate-800/70 backdrop-blur-sm border border-slate-700 rounded-3xl text-slate-300 w-[180px] h-[35px] justify-center transition-all hover:bg-slate-700/80 hover:border-slate-600"
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://github.com/LynkrApp/Website"
                    >
                      <div className="text-white">
                        <StarIcon
                          width={16}
                          height={16}
                          className="text-yellow"
                        />
                      </div>{' '}
                      <span className="group-hover:text-white transition-colors">
                        Star us on Github
                      </span>
                    </motion.a>
                  </div>

                  {/* Hero content */}
                  <div className="text-center">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
                    >
                      <span className="block mb-2">Your links, your way</span>
                      <span className="block text-[#14AAFF]">
                        Beautiful & organized
                      </span>
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="max-w-md mx-auto mt-5 text-base text-slate-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
                    >
                      Create stunning link in bio pages that capture attention
                      and drive engagement. Completely free, open source, and
                      packed with powerful features.
                    </motion.p>
                  </div>

                  {/* CTA button */}
                  <div className="flex justify-center mt-8">
                    <div className="flex flex-col items-center">
                      <span className="inline-flex shadow-lg">
                        <Link legacyBehavior href="/register">
                          <a className="inline-flex items-center px-6 py-3 font-semibold text-lg bg-gradient-to-r from-blue-400 to-teal-300 border border-transparent rounded-xl text-slate-900 w-[200px] h-[55px] justify-center hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                            Start for free
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </a>
                        </Link>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Carousel Section - Replacing the static preview */}
            <PreviewCarousel />
          </div>

          {/* Features Section */}
          <div className="py-24 bg-[#f8eeee]">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <div className="text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl font-extrabold text-gray-900 sm:text-4xl"
                >
                  Everything you need to succeed
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="max-w-2xl mx-auto mt-4 text-xl text-gray-500"
                >
                  Powerful features that help you create professional link pages
                  and grow your audience
                </motion.p>
              </div>

              <div className="mt-20">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="relative group"
                    >
                      <div className="p-6 transition-all duration-300 bg-white border border-gray-200 rounded-xl hover:shadow-lg group-hover:border-blue-300">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                          {feature.icon}
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-center text-gray-900">
                          {feature.title}
                        </h3>
                        <p className="text-center text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <div className="text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl font-extrabold text-white sm:text-4xl"
                >
                  Ready to transform your online presence?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mt-4 text-xl text-blue-100"
                >
                  Join thousands of creators already using Lynkr
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-8"
                >
                  <Link legacyBehavior href="/register">
                    <a className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl text-blue-600 bg-white hover:bg-gray-50 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg">
                      Get started for free
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </a>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </HomeLayout>
    </>
  );
};

export default Home;
