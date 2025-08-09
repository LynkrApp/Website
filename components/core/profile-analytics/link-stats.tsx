/* eslint-disable @next/next/no-img-element */
import { BarChart } from 'lucide-react';
import useLinks from '@/hooks/useLinks';
import useCurrentUser from '@/hooks/useCurrentUser';
import Loader from '@/components/utils/loading-spinner';
import { getApexDomain } from '@/utils/helpers';
import { GOOGLE_FAVICON_URL } from '@/utils/constants';
import { useState } from 'react';
import { CiStar } from 'react-icons/ci';
import Link from 'next/link';

const StarIcon = CiStar as React.ComponentType<React.SVGProps<SVGSVGElement>>;

const LinkStats = () => {
  const { data: currentUser } = useCurrentUser();
  const { data: userLinks, isLoading } = useLinks(currentUser?.id);
  const [showAll, setShowAll] = useState(false);

  const displayedLinks = showAll
    ? userLinks
    : Array.isArray(userLinks)
      ? userLinks.slice(0, 3)
      : userLinks;

  const handleShowMore = () => {
    setShowAll(true);
  };

  const handleShowLess = () => {
    setShowAll(false);
  };

  return (
    <>
      <div className="mt-10 w-full">
        <h3 className="text-xl font-semibold">Top performing links</h3>
        <div className="rounded-xl mt-4 border bg-white h-auto p-4">
          <div className="">
            <h3 className="font-semibold text-md px-3 pb-1">My Links</h3>
            <p className="text-gray-500 text-sm px-3 mb-2">
              Get useful insights on each link
            </p>
          </div>
          <div className="h-full w-full">
            {!isLoading ? (
              <>
                {Array.isArray(displayedLinks) && displayedLinks.length > 0 ? (
                  (displayedLinks as any[])
                    .slice()
                    .sort((a: any, b: any) => b.clicks - a.clicks)
                    .map((userLink: any) => (
                      <div
                        key={userLink.id}
                        className="flex items-center p-2 rounded-lg"
                      >
                        {userLink.showFavicon !== false ? (
                          <div className="h-8 w-8">
                            <img
                              src={`${GOOGLE_FAVICON_URL}${getApexDomain(
                                userLink.url
                              )}`}
                              alt={userLink.title}
                              className="h-8 w-8 blur-0 rounded-full sm:h-8 lg:w-8"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="h-8 w-8"></div> // Empty placeholder to maintain spacing
                        )}
                        <div className="ml-4">
                          <p className="truncate w-[100px] text-md text-slate-900 font-medium leading-none md:w-auto lg:w-auto">
                            {userLink.title}
                          </p>
                        </div>
                        <div className="flex items-center ml-auto gap-2 font-medium">
                          <BarChart className="text-gray-500" size={17} />
                          <h4 className="text-md text-gray-500">
                            {userLink.clicks} clicks
                          </h4>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="flex flex-col gap-2 w-[180px] mx-auto py-6">
                    <StarIcon width={20} height={20} />
                    <h2 className="text-center">
                      No links added yet{' '}
                      <span role="img" aria-label="face holding back tears">
                        🥹
                      </span>
                      <Link
                        className="font-semibold text-blue-600 hover:underline underline-offset-1"
                        href="/admin"
                      >
                        Create one now
                      </Link>
                    </h2>
                  </div>
                )}
                {Array.isArray(userLinks) && userLinks.length > 3 && (
                  <div className="flex justify-center mt-2">
                    {showAll ? (
                      <button
                        className="text-blue-500 font-medium"
                        onClick={handleShowLess}
                      >
                        Show Less
                      </button>
                    ) : (
                      <button
                        className="text-blue-500 font-medium"
                        onClick={handleShowMore}
                      >
                        Show More
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <Loader
                bgColor={'black'}
                textColor={'text-black'}
                message={'Loading'}
                width={40}
                height={40}
                strokeWidth={2}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LinkStats;
