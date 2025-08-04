import React from 'react';
import Layout from '@/components/layout/Layout';
import Footer from '@/components/layout/footer/footer';
import EnhancedThemesPicker from '@/components/core/custom-page-themes/enhanced-themes-picker';
import Head from 'next/head';

const Customize = () => {
  return (
    <>
      <Head>
        <title>Lynkr | Customize</title>
      </Head>
      <Layout>
        <div className="w-full pl-4 pr-4 overflow-auto border-r lg:basis-3/5">
          <EnhancedThemesPicker />
          <Footer />
        </div>
      </Layout>
    </>
  );
};

export default Customize;
