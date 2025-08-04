import {useRouter} from 'next/router';
import Preview from '../shared/profile-preview/preview';
import PreviewBtn from '../shared/profile-preview/preview-btn';
import Navbar from './navbar/navbar';

const Layout = ({children}) => {
  const router = useRouter();

  return (
    <>
      <section className="fixed overflow-hidden">
        <Navbar showName={false} isHomePage={false} />
        <main className="bg-[#f9f1f1] flex flex-row h-screen z-0 ">
          {children}
          {router.pathname != '/admin/analytics' && (
            <div className="hidden pl-4 lg:my-auto lg:block lg:basis-2/5">
              <Preview />
            </div>
          )}

          <PreviewBtn />
        </main>
      </section>
    </>
  );
};

export default Layout;
