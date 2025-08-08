import { useState } from 'react';
import LinkCard from './links-card';

const SidebarLayout = ({
    sections,
    userLinks,
    theme,
    buttonStyle,
    buttonStyleTheme,
    handleRegisterClick
}) => {
    // Get visible sections
    const visibleSections = sections?.filter((section) => section.visible) || [];

    // Get links without sections
    const linksWithoutSection = userLinks?.filter(
        (link) => !link.isSocial && !link.sectionId && !link.archived
    ) || [];

    // Section navigation options
    const sectionOptions = [
        { id: 'all', name: 'All Links' },
        ...visibleSections
    ];

    // State to track active section
    const [activeSection, setActiveSection] = useState('all');

    // Get links for the active section
    const getActiveLinks = () => {
        if (activeSection === 'all') {
            // For "All Links", show links without sections first
            return linksWithoutSection;
        } else {
            // Find the section for this selection
            const section = visibleSections.find(s => s.id === activeSection);
            if (section) {
                return section.links?.filter(link => !link.isSocial && !link.archived) || [];
            }
            return [];
        }
    };

    const activeLinks = getActiveLinks();

    return (
        <div className="flex flex-col md:flex-row w-full gap-6">
            {/* Sidebar navigation */}
            <div className="w-full md:w-56 flex flex-row md:flex-col overflow-auto md:sticky md:top-4">
                <div className="flex md:flex-col gap-2 p-2 bg-black/10 backdrop-blur-sm rounded-lg w-full">
                    {sectionOptions.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            style={{
                                backgroundColor: activeSection === section.id ? theme.neutral : 'transparent',
                                color: activeSection === section.id ? theme.primary : theme.accent
                            }}
                            className={`px-3 py-2 text-sm font-medium rounded-lg text-left transition-colors duration-200 whitespace-nowrap ${activeSection === section.id ? 'shadow-sm' : 'hover:bg-black/10'
                                }`}
                        >
                            {section.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main content area */}
            <div className="flex-1">
                {activeSection !== 'all' && (
                    <h3
                        style={{ color: theme.accent }}
                        className="text-xl font-semibold mb-4"
                    >
                        {visibleSections.find(s => s.id === activeSection)?.name}
                    </h3>
                )}

                <div className="flex flex-col items-start w-full gap-2.5" style={{ gap: 'var(--link-spacing)' }}>
                    {activeLinks.map(({ id, ...link }) => (
                        <LinkCard
                            buttonStyle={buttonStyle}
                            buttonStyleTheme={buttonStyleTheme}
                            theme={theme}
                            id={id}
                            key={id}
                            {...link}
                            registerClicks={() => handleRegisterClick(id)}
                            fullWidth
                        />
                    ))}

                    {activeLinks.length === 0 && (
                        <p style={{ color: theme.accent }} className="text-center py-8 w-full">
                            No links in this section
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SidebarLayout;
