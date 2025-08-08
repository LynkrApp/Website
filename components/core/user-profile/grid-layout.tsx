import LinkCard from './links-card';

const GridLayout = ({
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

    return (
        <div className="w-full">
            {/* Unsectioned links in a grid */}
            {linksWithoutSection.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 w-full">
                    {linksWithoutSection.map(({ id, ...link }) => (
                        <div key={id} className="flex justify-center">
                            <LinkCard
                                buttonStyle={buttonStyle}
                                buttonStyleTheme={buttonStyleTheme}
                                theme={theme}
                                id={id}
                                {...link}
                                registerClicks={() => handleRegisterClick(id)}
                                gridLayout
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Sections */}
            {visibleSections.map((section) => {
                const sectionLinks = section.links?.filter((link) => !link.isSocial && !link.archived) || [];
                if (sectionLinks.length === 0) return null;

                return (
                    <div key={section.id} className="w-full mb-8">
                        <h3
                            style={{ color: theme.accent }}
                            className="items-center justify-center mb-4 text-lg font-semibold text-center md:text-xl"
                        >
                            {section.name}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                            {sectionLinks.map(({ id, ...link }) => (
                                <div key={id} className="flex justify-center">
                                    <LinkCard
                                        buttonStyle={buttonStyle}
                                        buttonStyleTheme={buttonStyleTheme}
                                        theme={theme}
                                        id={id}
                                        {...link}
                                        registerClicks={() => handleRegisterClick(id)}
                                        gridLayout
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default GridLayout;
