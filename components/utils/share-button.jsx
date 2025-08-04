import { Share2, GithubIcon } from 'lucide-react';
import Link from 'next/link';
import useMediaQuery from '@/hooks/use-media-query';

const ShareButton = () => {
  const isMobile = useMediaQuery();
  return (
    <>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-2 py-2 text-black bg-white border-2 rounded-lg border-slate-300 lg:px-4 hover:bg-gray-100 hover:border-slate-300">
          <Share2 size={17} />
          <h3 className="text-sm">Share</h3>
        </button>
        <Link
          href="https://github.com/LynkrApp/Website"
          target="_blank"
          className="flex items-center gap-2 px-2 py-2 text-black bg-white border-2 rounded-lg border-slate-300 lg:px-4 hover:bg-gray-100 hover:border-slate-300"
        >
          <GithubIcon size={isMobile ? 20 : 17} />
          <h3 className="hidden text-sm lg:flex md:hidden">Star on Github</h3>
        </Link>
      </div>
    </>
  );
};

export default ShareButton;
