import Link from 'next/link';
import { GithubIcon } from 'lucide-react';
import useMediaQuery from '@/hooks/use-media-query';

const GithubButton = ({ darkMode = false }) => {
    const { isMobile } = useMediaQuery();

    // Define styles based on dark mode prop
    const buttonBaseClasses =
        'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors';
    const buttonClasses = darkMode
        ? `${buttonBaseClasses} bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white`
        : `${buttonBaseClasses} bg-white border border-slate-300 text-slate-700 hover:bg-gray-100`;

    const iconSize = isMobile ? 16 : 17;

    return (
        <Link
            href="https://github.com/LynkrApp/Website"
            target="_blank"
            className={buttonClasses}
        >
            <GithubIcon size={iconSize} />
            <span className="hidden text-sm font-medium lg:inline md:hidden">
                Star on GitHub
            </span>
        </Link>
    );
};

export default GithubButton;
