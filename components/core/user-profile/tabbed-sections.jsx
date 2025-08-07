import { useState, useEffect } from 'react';
import LinkCard from './links-card';
import TabButton from './tab-button';
import { motion, AnimatePresence } from 'framer-motion';

const TabbedSections = ({
    sections,
    userLinks,
    theme,
    buttonStyle,
    buttonStyleTheme,
    handleRegisterClick
}) => {
    // Get visible sections
    const visibleSections = sections?.filter((section) => section.visible) || [];

    // Set the default active tab to the first visible section, or 'all' if none
    const [activeTab, setActiveTab] = useState(
        visibleSections.length > 0 ? visibleSections[0].id : 'all'
    );

    // Get links without sections
    const linksWithoutSection = userLinks?.filter(
        (link) => !link.isSocial && !link.sectionId && !link.archived
    ) || [];

    // Create tab options based on visible sections
    const tabOptions = [
        { id: 'all', name: 'All Links' },
        ...visibleSections.map(section => ({
            id: section.id,
            name: section.name
        }))
    ];

    // Update active tab if sections change and current active tab no longer exists
    useEffect(() => {
        const tabStillExists = tabOptions.some(tab => tab.id === activeTab);
        if (!tabStillExists && tabOptions.length > 0) {
            setActiveTab(tabOptions[0].id);
        }
    }, [sections, activeTab, tabOptions]);

    // Get links for the active tab
    const getActiveLinks = () => {
        if (activeTab === 'all') {
            // Show all links (without sections) + links from all sections
            const allSectionLinks = visibleSections.flatMap(
                (section) => section.links?.filter(link => !link.isSocial && !link.archived) || []
            );
            return [...linksWithoutSection, ...allSectionLinks];
        } else {
            // Find the section for this tab
            const section = visibleSections.find(s => s.id === activeTab);
            if (section) {
                return section.links?.filter(link => !link.isSocial && !link.archived) || [];
            }
            return [];
        }
    };

    const activeLinks = getActiveLinks();

    // Animation variants for tab transitions
    const tabContentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.3 }
        }
    };

    const linkVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    return (
        <div className="w-full">
            {/* Improved Tab Navigation Container */}
            {tabOptions.length > 1 && (
                <div className="relative flex justify-center mb-8">
                    {/* Enhanced Glassmorphic Background */}
                    <div
                        className="absolute inset-0 rounded-full blur-[1px] opacity-70 z-0"
                        style={{
                            background: `linear-gradient(90deg, ${theme.secondary}33, ${theme.neutral}44)`
                        }}
                    ></div>

                    {/* Improved Tab Container with better overflow handling for mobile */}
                    <div
                        className="relative flex overflow-x-auto max-w-full no-scrollbar 
                                  snap-x snap-mandatory py-2 px-2 md:px-2 md:py-1.5
                                  backdrop-blur-md bg-white/10 rounded-full border shadow-lg z-10"
                        style={{ borderColor: `${theme.accent}33` }}
                    >
                        <div className="flex space-x-1 px-1">
                            {tabOptions.map((tab) => (
                                <div key={tab.id} className="snap-start flex-shrink-0">
                                    <TabButton
                                        label={tab.name}
                                        isActive={activeTab === tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        theme={theme}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Links for active tab with animations */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={tabContentVariants}
                    className="flex flex-col items-center w-full gap-3"
                >
                    {activeLinks.map(({ id, ...link }) => (
                        <motion.div key={id} variants={linkVariants} className="w-full max-w-md">
                            <LinkCard
                                buttonStyle={buttonStyle}
                                buttonStyleTheme={buttonStyleTheme}
                                theme={theme}
                                id={id}
                                key={id}
                                {...link}
                                registerClicks={() => handleRegisterClick(id)}
                            />
                        </motion.div>
                    ))}

                    {activeLinks.length === 0 && (
                        <motion.p
                            variants={linkVariants}
                            style={{
                                color: theme.accent,
                                fontFamily: 'inherit',
                                fontWeight: 'var(--body-weight, 400)'
                            }}
                            className="text-center py-8"
                        >
                            No links in this section
                        </motion.p>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default TabbedSections;
