import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import useCurrentUser from '@/hooks/useCurrentUser';
import useMediaQuery from '@/hooks/use-media-query';

const VisitPageButton = ({ darkMode = false }) => {
    const { isMobile } = useMediaQuery();
    const { data: currentUser } = useCurrentUser();
    const userHandle = currentUser?.handle;

    // Don't render if user has no handle
    if (!userHandle) return null;

    // Define styles based on dark mode prop
    const buttonBaseClasses =
        'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors';
    const buttonClasses = darkMode
        ? `${buttonBaseClasses} bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white`
        : `${buttonBaseClasses} bg-white border border-slate-300 text-slate-700 hover:bg-gray-100`;

    const iconSize = isMobile ? 16 : 17;

    return (
        <Link
            href={`/${userHandle}`}
            target="_blank"
            className={buttonClasses}
        >
            <ExternalLink size={iconSize} />
            <span className="text-sm font-medium">
                Visit Page
            </span>
        </Link>
    );
};

export default VisitPageButton;
