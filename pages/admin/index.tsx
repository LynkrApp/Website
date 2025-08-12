import SectionedLinksEditor from '../../components/core/admin-panel/sectioned-links-editor';
import Layout from '@/components/layout/Layout';
import { AdminPageMeta } from '@/components/meta/metadata';
import useMediaQuery from '@/hooks/use-media-query';
import Head from 'next/head';

const Admin = () => {
  const { isMobile } = useMediaQuery();

  return (
    <>
      <AdminPageMeta pageType="dashboard" />
      <Layout>
        <div className="w-full pl-4 pr-4 overflow-scroll border-r lg:basis-3/5">
          <SectionedLinksEditor />
          {isMobile && <div className="h-[40px] mb-24" />}
        </div>
      </Layout>
    </>
  );
};

export default Admin;
