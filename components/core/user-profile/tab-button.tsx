import { motion } from 'framer-motion';

const TabButton = ({
    isActive,
    label,
    onClick,
    theme
}) => {
    return (
        <motion.button
            onClick={onClick}
            className={`
                relative px-4 py-2 text-sm rounded-full transition-all duration-300
                ${isActive ? 'font-medium' : 'hover:bg-white/15'}
            `}
            style={{
                backgroundColor: isActive ? theme.neutral : 'transparent',
                // Respect user typography settings
                fontFamily: 'inherit',
            }}
            whileTap={{ scale: 0.97 }}
        >
            {/* Text element - positioned above background with correct styling */}
            <span
                className="relative z-20"
                style={{
                    color: theme.accent,
                    fontWeight: isActive ? 'var(--heading-weight, 600)' : 'var(--heading-weight, 400)',
                }}
            >
                {label}
            </span>

            {/* Background layer with lower z-index */}
            {
                isActive && (
                    <motion.div
                        className="absolute inset-0 rounded-full border opacity-90 z-10"
                        style={{ borderColor: `${theme.accent}22` }}
                        layoutId="activeTabBackground"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                )
            }

            {/* Active indicator with lower z-index */}
            {
                isActive && (
                    <motion.div
                        className="absolute bottom-0.5 left-1/2 h-1 rounded-full z-10"
                        style={{
                            backgroundColor: theme.primary,
                            width: '40%',
                            transform: 'translateX(-50%)'
                        }}
                        layoutId="activeTabIndicator"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                )
            }
        </motion.button >
    );
};

export default TabButton;
