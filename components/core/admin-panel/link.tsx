import { GripVertical, BarChart, Copy } from 'lucide-react';
import PopoverDesktop from '../../shared/popovers/popover-desktop';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getApexDomain, timeAgo } from '@/utils/helpers';
import { GOOGLE_FAVICON_URL } from '@/utils/constants';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FaArchive } from 'react-icons/fa';

import TooltipWrapper from '@/components/utils/tooltip';

const ArchiveIcon = FaArchive as React.ComponentType<
  React.SVGProps<SVGSVGElement>
>;

const LinkCard = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
  };

  const apexDomain = getApexDomain(props.url);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(props.url);
    toast.success('Copied URL to clipboard!');
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`flex bg-white items-center p-2 rounded-lg drop-shadow-md my-5 transition-all duration-200 ${
          isDragging || props.isDragging
            ? 'shadow-2xl scale-105 rotate-2 z-50'
            : 'hover:shadow-lg'
        }`}
      >
        <div
          className="text-gray-400 text-sm hover:bg-blue-100 rounded-sm p-[3px] cursor-grab active:cursor-grabbing transition-colors duration-150"
          {...attributes}
          {...listeners}
        >
          <GripVertical color="grey" size={17} />
        </div>
        {!props.archived ? (
          props.showFavicon !== false ? (
            <Image
              src={`${GOOGLE_FAVICON_URL}${apexDomain}`}
              alt={apexDomain}
              className="w-8 h-8 rounded-full blur-0 sm:h-10 sm:w-10"
              unoptimized
              width={20}
              height={20}
              priority
            />
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10"></div> // Empty placeholder to maintain spacing
          )
        ) : (
          <TooltipWrapper
            title="This link has been archived by you"
            component={
              <span>
                <ArchiveIcon width={18} height={18} />
              </span>
            }
          />
        )}
        <div className="relative flex-1 h-full p-2">
          <div className="flex">
            <div className="w-full pr-3">
              <div className="grid mb-1 w-full grid-cols-[minmax(0,_90%)] items-baseline">
                <div className="items-center w-full col-start-1 row-start-1 ">
                  <div className="flex items-center max-w-full rounded-[2px] outline-offset-2 outline-2 gap-2 lg:gap-4">
                    <p className="truncate w-fit max-w-[80px] text-gray-500 text-sm whitespace-nowrap overflow-hidden font-semibold lg:w-fit lg:max-w-[150px]">
                      {props.title}
                    </p>

                    <div className="flex items-start justify-between">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          onClick={handleCopyLink}
                          href="#"
                          className="group rounded-full bg-gray-100 p-1.5 transition-all duration-75 hover:scale-105 hover:bg-blue-100 active:scale-95"
                        >
                          <Copy color="grey" size={15} />
                        </Link>

                        <Link
                          href="/admin/analytics"
                          className="flex items-center space-x-1 rounded-md bg-gray-100 px-2 py-0.5 transition-all duration-75 hover:scale-105 hover:bg-blue-100 active:scale-100"
                        >
                          <BarChart color="grey" size={15} />
                          <p className="text-sm text-gray-500 whitespace-nowrap">
                            {props.clicks}
                            <span className="hidden ml-1 sm:inline-block">
                              clicks
                            </span>
                          </p>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="">
                  <div className="inline-flex col-start-1 row-start-1">
                    <a
                      target="_blank"
                      href={props.url}
                      className="flex items-center max-w-full rounded-[2px] outline-offset-2 outline-2"
                    >
                      <p className="text-gray-500 w-[200px] text-sm lg:w-[320px] whitespace-nowrap overflow-hidden font-semibold text-ellipsis">
                        {props.url}
                      </p>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <button className="flex items-center justify-center ">
              <div className="flex items-center">
                <small className="hidden mr-8 text-sm text-gray-500 whitespace-nowrap sm:block">
                  Added {timeAgo(props.createdAt)}
                </small>
                <PopoverDesktop {...props} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LinkCard;
