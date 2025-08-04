import Link from 'next/link';
import { siteConfig } from '@/config/site';
import Image from 'next/image';

const SiteHeader = () => {
  return (
    <>
      <div className="flex gap-2 mx-4">
        <Link href="/" className="items-center space-x-2 md:flex">
          <Image 
              src="/logo.png"
              alt="Lynkr Logo"
              width={40}
              height={40}
              className="w-8 h-8 rounded-full"
            />
            <p className="text-lg font-semibold text-gray-900">
              Lynkr
            </p>
        </Link>
      </div>
    </>
  );
};

export default SiteHeader;
