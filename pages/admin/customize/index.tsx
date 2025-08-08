import React from 'react';
import Layout from '@/components/layout/Layout';
import Footer from '@/components/layout/footer/footer';
import EnhancedThemesPicker from '@/components/core/custom-page-themes/enhanced-themes-picker';
import Head from 'next/head';
import { AdminPageMeta } from '@/components/meta/metadata';

const Customize = () => {
  return (
    <>
      <AdminPageMeta pageType="customize" />
      <Layout>
        <div className="w-full pl-4 pr-4 overflow-scroll border-r lg:basis-3/5">
          <EnhancedThemesPicker />
          <Footer />
        </div>
      </Layout>
    </>
  );
};

export default Customize;
