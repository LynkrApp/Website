/* eslint-disable @next/next/no-img-element */
import GithubStar from '@/components/utils/github-star';
import {
  Zap,
  Shield,
  Palette,
  BarChart3,
  Users,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MetaTags } from '@/components/meta/metadata';
import Navbar from '@/components/root/navbar';
import Footer from '@/components/root/footer';
import { HomeLayout } from '@/components/layout/BaseLayout';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Create your link in bio page in seconds with our intuitive interface."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "100% Free & Open Source",
      description: "No hidden fees, no locked features. Completely free forever."
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Fully Customizable",
      description: "Choose from themes, colors, and custom buttons to match your brand."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics Included",
      description: "Track clicks, views, and user engagement with built-in analytics."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Organized Sections",
      description: "Group your links into sections for better organization and user experience."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Modern Design",
      description: "Beautiful, responsive design that looks great on all devices."
    }
  ];

  return (
    <>
      <HomeLayout>
        <div className="-z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="relative overflow-hidden">
            <div
              className="absolute inset-y-0 w-full h-full"
              aria-hidden="true"
            ></div>
            <div className="relative pt-6 pb-16 sm:pb-24">
              <div className="px-4 mx-auto mt-24 max-w-7xl sm:mt-16 sm:px-6">
                <div className="flex items-center justify-center mb-6">
                  <a
                    className="group inline-flex items-center gap-2 px-4 py-4 text-sm bg-gray-50 border rounded-3xl text-gray-500 w-[180px] h-[35px] justify-center transition-colors hover:bg-gray-100"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/LynkrApp/Website"
                  >
                    <div className="">
                      <GithubStar />
                    </div>{' '}
                    Star us on Github
                  </a>
                </div>
                <div className="text-center">
                  <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">Your links, your way</span>
                    <span className="block text-transparent hero-title bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">Beautiful & organized</span>
                  </h1>
                  <p className="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                    Create stunning link in bio pages that capture attention and drive engagement.
                    Completely free, open source, and packed with powerful features.
                  </p>
                </div>
                <div className="flex justify-center mt-6">
                  <div className="flex flex-col items-center">
                    <span className="inline-flex shadow rounded-xl">
                      <Link legacyBehavior href="/register">
                        <a className="inline-flex items-center px-6 py-3 font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 border border-transparent rounded-xl text-white w-[200px] h-[55px] justify-center hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                          Start for free
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </a>
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="w-full py-24 bg-slate-900">
              <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                  <h2 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
                    See Lynkr in action
                  </h2>
                  <p className="max-w-2xl mx-auto text-xl text-gray-300">
                    Create beautiful, organized link pages that drive engagement and showcase your content professionally
                  </p>
                </div>
                <div className="flex justify-center">
                  <Image
                    className="border border-gray-700 rounded-lg shadow-2xl"
                    src="/assets/new_shot.png"
                    alt="Lynkr app screenshot showing beautiful link in bio page"
                    height={700}
                    width={1200}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="py-24 bg-white">
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
                  Powerful features that help you create professional link pages and grow your audience
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
