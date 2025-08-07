import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import useCurrentUser from '@/hooks/useCurrentUser';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    Image as ImageIcon,
    Palette,
    Eye,
    EyeOff,
    BarChart2,
    RefreshCcw,
    Check,
    Layout,
    Sparkles,
    Type,
    Wand2,
    ImageIcon as ImageTypeIcon,
    Brush,
    Layers,
    GalleryHorizontal,
    PanelTop,
    CircleDot,
    PaintBucket
} from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { getCurrentBaseURL } from '@/utils/helpers';
import {
    themes,
    gradientThemes,
    imageThemes,
    patternThemes,
    typographyThemes,
    animatedThemes
} from '@/utils/themes';

const defaultStyles = {
    backgroundType: 'gradient',
    backgroundGradient: 'linear-gradient(to bottom right, #0f172a, #1e293b, #376878)',
    backgroundColor: '#0f172a',
    textColor: 'white',
    accentColor: '#3b82f6',
    showAvatar: true,
    showStats: false,
    backgroundOpacity: 1,
    template: 'default',
    themeId: null,
    typographyTheme: null
};

// Add responsive helper styles for the editor
const makeResponsive = () => {
    return {
        // Responsive enhancements that can be accessed via utility classes
        '.og-editor-container': {
            maxWidth: '100%',
            padding: '0 16px',
        },
        '.og-editor-tabs': {
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            scrollbarWidth: 'none',
            '::-webkit-scrollbar': {
                display: 'none'
            }
        },
        '@media (max-width: 640px)': {
            '.og-editor-tab-text': {
                fontSize: '0.75rem'
            },
            '.og-editor-bg-grid': {
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'
            }
        }
    };
};

const OgImageEditor = () => {
    const { data: currentUser } = useCurrentUser();
    const [ogStyles, setOgStyles] = useState(defaultStyles);
    const [previewUrl, setPreviewUrl] = useState('');
    const [editingColor, setEditingColor] = useState(null);
    const [activeTab, setActiveTab] = useState('background');
    const baseUrl = getCurrentBaseURL();

    // Load user's OG styles
    useEffect(() => {
        if (currentUser?.ogStyles) {
            setOgStyles({ ...defaultStyles, ...currentUser.ogStyles });
        }
        if (currentUser?.handle) {
            generatePreviewUrl(currentUser.handle);
        }
    }, [currentUser]);

    const generatePreviewUrl = (handle) => {
        const timestamp = new Date().getTime();
        setPreviewUrl(`${baseUrl}/api/og?username=${handle}&t=${timestamp}`);
    };

    // Update OG styles mutation
    const mutation = useMutation({
        mutationFn: async (newStyles) => {
            const response = await axios.post('/api/user/update-og-styles', newStyles);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Social media preview updated');
            if (currentUser?.handle) {
                generatePreviewUrl(currentUser.handle);
            }
        },
        onError: () => {
            toast.error('Failed to update social media preview');
        }
    });

    const handleChange = (key, value) => {
        const newStyles = { ...ogStyles, [key]: value };
        setOgStyles(newStyles);
    };

    const handleSubmit = () => {
        mutation.mutate(ogStyles);
    };

    const handleRefreshPreview = () => {
        if (currentUser?.handle) {
            generatePreviewUrl(currentUser.handle);
        }
    };

    // Apply a theme to OG styles
    const applyTheme = (theme) => {
        let newStyles = { ...ogStyles };

        if (theme.type === 'color') {
            newStyles = {
                ...newStyles,
                backgroundType: 'color',
                backgroundColor: theme.palette[0],
                textColor: theme.palette[2],
                accentColor: theme.palette[3],
                themeId: theme.name
            };
        } else if (theme.type === 'gradient') {
            newStyles = {
                ...newStyles,
                backgroundType: 'gradient',
                backgroundGradient: theme.backgroundImage,
                textColor: theme.palette[2],
                accentColor: theme.palette[3],
                themeId: theme.name
            };
        } else if (theme.type === 'image' || theme.type === 'pattern') {
            newStyles = {
                ...newStyles,
                backgroundType: theme.type,
                backgroundImage: theme.backgroundImage,
                backgroundColor: theme.backgroundColor || theme.palette[0],
                textColor: theme.palette[2],
                accentColor: theme.palette[3],
                backgroundOpacity: theme.overlay ? 0.5 : 1,
                themeId: theme.name
            };
        } else if (theme.type === 'animated') {
            // For animated backgrounds, use the palette colors but set a gradient background
            newStyles = {
                ...newStyles,
                backgroundType: 'gradient',
                backgroundGradient: `linear-gradient(to bottom right, ${theme.palette[0]}, ${theme.palette[1]})`,
                textColor: theme.palette[2],
                accentColor: theme.palette[3],
                themeId: theme.name
            };
        }

        setOgStyles(newStyles);
    };

    // Apply typography theme
    const applyTypographyTheme = (typographyTheme) => {
        setOgStyles({
            ...ogStyles,
            typographyTheme
        });
    };

    // Apply current user theme to OG styles
    const applyCurrentTheme = () => {
        if (!currentUser?.themePalette) return;

        const userTheme = currentUser.themePalette;
        let newStyles = { ...ogStyles };

        if (userTheme.type === 'color') {
            newStyles = {
                ...newStyles,
                backgroundType: 'color',
                backgroundColor: userTheme.palette[0],
                textColor: userTheme.palette[2],
                accentColor: userTheme.palette[3],
                themeId: userTheme.name
            };
        } else if (userTheme.type === 'gradient') {
            newStyles = {
                ...newStyles,
                backgroundType: 'gradient',
                backgroundGradient: userTheme.backgroundImage,
                textColor: userTheme.palette[2],
                accentColor: userTheme.palette[3],
                themeId: userTheme.name
            };
        } else if (userTheme.type === 'image' || userTheme.type === 'pattern') {
            newStyles = {
                ...newStyles,
                backgroundType: userTheme.type,
                backgroundImage: userTheme.backgroundImage,
                backgroundColor: userTheme.backgroundColor || userTheme.palette[0],
                textColor: userTheme.palette[2],
                accentColor: userTheme.palette[3],
                backgroundOpacity: userTheme.overlay ? 0.5 : 1,
                themeId: userTheme.name
            };
        } else if (userTheme.type === 'animated') {
            // For animated backgrounds, use the palette colors but set a gradient background
            newStyles = {
                ...newStyles,
                backgroundType: 'gradient',
                backgroundGradient: `linear-gradient(to bottom right, ${userTheme.palette[0]}, ${userTheme.palette[1]})`,
                textColor: userTheme.palette[2],
                accentColor: userTheme.palette[3],
                themeId: userTheme.name
            };
        }

        // Also apply typography if it exists
        if (currentUser.typographyTheme) {
            newStyles.typographyTheme = currentUser.typographyTheme;
        }

        setOgStyles(newStyles);
        toast.success('Applied your current profile theme');
    };

    // Groups all themes by category
    const allThemesByCategory = {
        color: themes,
        gradient: gradientThemes,
        image: imageThemes,
        pattern: patternThemes,
        animated: animatedThemes
    };

    // Define the main tabs for the editor
    const editorTabs = [
        { id: 'background', name: 'Background', icon: <PaintBucket size={18} /> },
        { id: 'layout', name: 'Layout', icon: <Layout size={18} /> },
        { id: 'typography', name: 'Typography', icon: <Type size={18} /> },
        { id: 'display', name: 'Display', icon: <Eye size={18} /> },
    ];

    // Define background type tabs
    const backgroundTabs = [
        { id: 'color', name: 'Solid Colors', icon: <Palette size={18} /> },
        { id: 'gradient', name: 'Gradients', icon: <Brush size={18} /> },
        { id: 'image', name: 'Images', icon: <ImageTypeIcon size={18} />, disabled: true },
        { id: 'pattern', name: 'Patterns', icon: <Layers size={18} />, disabled: true },
    ];

    return (
        <div className="px-4 mx-auto my-6 sm:px-6">
            {/* Heading and theme apply button */}
            <div className="flex flex-col items-start justify-between gap-4 mb-4 sm:flex-row sm:items-center">
                <h2 className="text-xl font-semibold sm:text-2xl">Social Media Preview</h2>
                <button
                    onClick={applyCurrentTheme}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
                >
                    <Wand2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                    Apply Profile Theme
                </button>
            </div>

            <p className="mb-6 text-sm text-gray-600 sm:text-base">
                Customize how your links appear when shared on social media platforms.
            </p>

            {/* Preview Container - Kept at the top */}
            <div className="mb-6 overflow-hidden bg-white border shadow-sm rounded-xl">
                <div className="aspect-[1200/630] relative overflow-hidden">
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="OG Image Preview"
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full bg-slate-100">
                            <ImageIcon className="w-12 h-12 text-slate-400" />
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between p-4 border-t">
                    <span className="text-sm text-gray-500">Preview of how your page will appear when shared</span>
                    <button
                        onClick={handleRefreshPreview}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Refresh Preview
                    </button>
                </div>
            </div>

            {/* Editor tabs and content - Moved between preview and save button */}
            <div className="mb-6 overflow-hidden bg-white border rounded-xl">
                {/* Main Tabs */}
                <div className="overflow-x-auto border-b bg-gray-50 og-editor-tabs">
                    <div className="flex min-w-max">
                        {editorTabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-2 sm:py-3 px-3 sm:px-4 flex items-center justify-center gap-1 sm:gap-2 transition-all font-medium ${activeTab === tab.id
                                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {tab.icon}
                                <span className="og-editor-tab-text">{tab.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-4 sm:p-6">
                    {/* Background Tab */}
                    {activeTab === 'background' && (
                        <div>
                            <h3 className="mb-4 text-lg font-medium">Background Style</h3>

                            {/* Background Types */}
                            <div className="mb-6">
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 og-editor-bg-grid">
                                    {backgroundTabs.map(bgType => (
                                        <button
                                            key={bgType.id}
                                            onClick={() => handleChange('backgroundType', bgType.id)}
                                            className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-all ${ogStyles.backgroundType === bgType.id
                                                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                }`}
                                            disabled={bgType.disabled}
                                        >
                                            {bgType.icon}
                                            <span className="text-xs font-medium">{bgType.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Picker for Solid Color */}
                            {ogStyles.backgroundType === 'color' && (
                                <div className="mb-6">
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Background Color
                                    </label>
                                    <div className="mb-4">
                                        <div
                                            className="w-full h-12 mb-2 border rounded-md cursor-pointer"
                                            style={{ backgroundColor: ogStyles.backgroundColor }}
                                            onClick={() => setEditingColor('backgroundColor')}
                                        ></div>
                                        {editingColor === 'backgroundColor' && (
                                            <div className="relative">
                                                <HexColorPicker
                                                    color={ogStyles.backgroundColor}
                                                    onChange={(color) => handleChange('backgroundColor', color)}
                                                    className="w-full"
                                                />
                                                <button
                                                    className="flex items-center gap-1 px-3 py-1 mt-2 text-sm text-white bg-blue-600 rounded-md"
                                                    onClick={() => setEditingColor(null)}
                                                >
                                                    <Check className="w-4 h-4" /> Done
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mb-4 sm:grid-cols-4">
                                        {themes.slice(0, 8).map(theme => (
                                            <div
                                                key={theme.name}
                                                onClick={() => applyTheme(theme)}
                                                className="h-12 overflow-hidden transition-all border-2 rounded-md cursor-pointer hover:scale-105"
                                                style={{
                                                    backgroundColor: theme.palette[0],
                                                    borderColor: ogStyles.themeId === theme.name ? '#3b82f6' : 'transparent'
                                                }}
                                            >
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-center mt-2">
                                        <button
                                            onClick={() => {
                                                setActiveTab('themes-color');
                                            }}
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            View all color themes →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Gradient Options */}
                            {ogStyles.backgroundType === 'gradient' && (
                                <div className="mb-6">
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Gradient Style
                                    </label>

                                    <div className="grid grid-cols-1 gap-2 mb-4 xs:grid-cols-2 sm:grid-cols-3">
                                        {gradientThemes.slice(0, 6).map(theme => (
                                            <div
                                                key={theme.name}
                                                onClick={() => applyTheme(theme)}
                                                className="h-20 overflow-hidden transition-all border-2 rounded-lg cursor-pointer hover:scale-105"
                                                style={{
                                                    backgroundImage: theme.backgroundImage,
                                                    borderColor: ogStyles.themeId === theme.name ? '#3b82f6' : 'transparent'
                                                }}
                                            >
                                                <div className="flex items-end w-full h-full p-2">
                                                    <span className="text-xs font-medium text-white drop-shadow-md">
                                                        {theme.name}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-center mt-2">
                                        <button
                                            onClick={() => {
                                                setActiveTab('themes-gradient');
                                            }}
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            View all gradient themes →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Color Settings */}
                            <div>
                                <h4 className="mb-3 font-medium">Text & Accent Colors</h4>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* Text Color */}
                                    <div className="mb-4">
                                        <label className="block mb-2 text-sm text-gray-600">Text Color</label>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 border rounded-md cursor-pointer"
                                                style={{ backgroundColor: ogStyles.textColor }}
                                                onClick={() => setEditingColor('textColor')}
                                            ></div>
                                            <span className="text-sm">{ogStyles.textColor}</span>
                                        </div>
                                        {editingColor === 'textColor' && (
                                            <div className="relative z-10 mt-2">
                                                <HexColorPicker
                                                    color={ogStyles.textColor}
                                                    onChange={(color) => handleChange('textColor', color)}
                                                />
                                                <button
                                                    className="flex items-center gap-1 px-3 py-1 mt-2 text-sm text-white bg-blue-600 rounded-md"
                                                    onClick={() => setEditingColor(null)}
                                                >
                                                    <Check className="w-4 h-4" /> Done
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Accent Color */}
                                    <div className="mb-4">
                                        <label className="block mb-2 text-sm text-gray-600">Accent Color</label>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 border rounded-md cursor-pointer"
                                                style={{ backgroundColor: ogStyles.accentColor }}
                                                onClick={() => setEditingColor('accentColor')}
                                            ></div>
                                            <span className="text-sm">{ogStyles.accentColor}</span>
                                        </div>
                                        {editingColor === 'accentColor' && (
                                            <div className="relative z-10 mt-2">
                                                <HexColorPicker
                                                    color={ogStyles.accentColor}
                                                    onChange={(color) => handleChange('accentColor', color)}
                                                />
                                                <button
                                                    className="flex items-center gap-1 px-3 py-1 mt-2 text-sm text-white bg-blue-600 rounded-md"
                                                    onClick={() => setEditingColor(null)}
                                                >
                                                    <Check className="w-4 h-4" /> Done
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Layout Tab */}
                    {activeTab === 'layout' && (
                        <div>
                            <h3 className="mb-4 text-lg font-medium">Layout Options</h3>

                            {/* Template Selection */}
                            <div className="mb-6">
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Template Style
                                </label>
                                <div className="grid grid-cols-1 gap-3 xs:grid-cols-2">
                                    {['default', 'minimal', 'modern', 'bold'].map(template => (
                                        <button
                                            key={template}
                                            onClick={() => handleChange('template', template)}
                                            className={`p-4 rounded-lg flex flex-col items-center gap-1 border-2 transition-all ${ogStyles.template === template
                                                ? 'bg-purple-50 border-purple-200'
                                                : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                                                }`}
                                        >
                                            <PanelTop className={ogStyles.template === template ? 'text-purple-600' : 'text-gray-500'} />
                                            <span className={`text-sm font-medium capitalize ${ogStyles.template === template ? 'text-purple-700' : 'text-gray-600'
                                                }`}>
                                                {template}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Typography Tab */}
                    {activeTab === 'typography' && (
                        <div>
                            <h3 className="mb-4 text-lg font-medium">Typography</h3>

                            {/* Typography Themes */}
                            <div className="mb-6">
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Font Style
                                </label>
                                <div className="pr-2 space-y-2 overflow-y-auto max-h-96">
                                    {typographyThemes.slice(0, 6).map(font => (
                                        <button
                                            key={font.name}
                                            className={`w-full rounded-lg p-4 text-left transition-colors ${ogStyles.typographyTheme?.name === font.name
                                                ? 'bg-blue-50 border-2 border-blue-200'
                                                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                                                }`}
                                            onClick={() => applyTypographyTheme(font)}
                                            style={{
                                                fontFamily: font.fontFamily,
                                                letterSpacing: font.letterSpacing,
                                            }}
                                        >
                                            <h3
                                                className="text-lg"
                                                style={{ fontWeight: font.headingWeight }}
                                            >
                                                {font.name}
                                            </h3>
                                            <p
                                                className="text-sm text-gray-600"
                                                style={{
                                                    fontWeight: font.bodyWeight,
                                                    lineHeight: font.lineHeight,
                                                }}
                                            >
                                                The quick brown fox jumps over the lazy dog.
                                            </p>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex justify-center mt-4">
                                    <button
                                        onClick={() => {
                                            setActiveTab('themes-typography');
                                        }}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        View all typography themes →
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Display Options Tab */}
                    {activeTab === 'display' && (
                        <div>
                            <h3 className="mb-4 text-lg font-medium">Display Options</h3>

                            <div className="space-y-4">
                                {/* Show/Hide Avatar */}
                                <div className="flex items-center justify-between p-4 transition-colors rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                    onClick={() => handleChange('showAvatar', !ogStyles.showAvatar)}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${ogStyles.showAvatar ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'
                                            }`}>
                                            {ogStyles.showAvatar ? <Eye size={20} /> : <EyeOff size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="font-medium">{ogStyles.showAvatar ? 'Show Avatar' : 'Hide Avatar'}</h4>
                                            <p className="text-sm text-gray-600">
                                                {ogStyles.showAvatar
                                                    ? 'Your profile image will be displayed'
                                                    : 'Your profile image will be hidden'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full relative ${ogStyles.showAvatar ? 'bg-green-500' : 'bg-gray-300'
                                        }`}>
                                        <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-transform ${ogStyles.showAvatar ? 'transform translate-x-6' : 'transform translate-x-0.5'
                                            }`}></div>
                                    </div>
                                </div>

                                {/* Show/Hide Stats */}
                                <div className="flex items-center justify-between p-4 transition-colors rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                    onClick={() => handleChange('showStats', !ogStyles.showStats)}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${ogStyles.showStats ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'
                                            }`}>
                                            {ogStyles.showStats ? <BarChart2 size={20} /> : <BarChart2 size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="font-medium">{ogStyles.showStats ? 'Show Statistics' : 'Hide Statistics'}</h4>
                                            <p className="text-sm text-gray-600">
                                                {ogStyles.showStats
                                                    ? 'Show link count and profile views'
                                                    : 'Hide link count and profile views'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full relative ${ogStyles.showStats ? 'bg-green-500' : 'bg-gray-300'
                                        }`}>
                                        <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-transform ${ogStyles.showStats ? 'transform translate-x-6' : 'transform translate-x-0.5'
                                            }`}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Theme Galleries */}
                    {activeTab.startsWith('themes-') && (
                        <div>
                            <div className="flex flex-col items-start justify-between gap-2 mb-4 xs:flex-row xs:items-center">
                                <h3 className="text-lg font-medium">
                                    {activeTab === 'themes-color' && 'Color Themes'}
                                    {activeTab === 'themes-gradient' && 'Gradient Themes'}
                                    {activeTab === 'themes-image' && 'Image Backgrounds'}
                                    {activeTab === 'themes-pattern' && 'Pattern Themes'}
                                    {activeTab === 'themes-typography' && 'Typography Themes'}
                                </h3>
                                <button
                                    onClick={() => setActiveTab('background')}
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Back to editor
                                </button>
                            </div>

                            <div className="pr-2 overflow-y-auto max-h-72 sm:max-h-96">
                                {activeTab === 'themes-color' && (
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                                        {themes.map(theme => (
                                            <div
                                                key={theme.name}
                                                onClick={() => applyTheme(theme)}
                                                className="overflow-hidden transition-all border-2 rounded-lg cursor-pointer hover:scale-105"
                                                style={{
                                                    borderColor: ogStyles.themeId === theme.name ? '#3b82f6' : 'transparent'
                                                }}
                                            >
                                                <div
                                                    className="h-16"
                                                    style={{ backgroundColor: theme.palette[0] }}
                                                ></div>
                                                <div className="p-1 text-xs font-medium truncate bg-white border-t">
                                                    {theme.name}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'themes-gradient' && (
                                    <div className="grid grid-cols-1 gap-2 xs:grid-cols-2 sm:grid-cols-3">
                                        {gradientThemes.map(theme => (
                                            <div
                                                key={theme.name}
                                                onClick={() => applyTheme(theme)}
                                                className="overflow-hidden transition-all border-2 rounded-lg cursor-pointer hover:scale-105"
                                                style={{
                                                    backgroundImage: theme.backgroundImage,
                                                    borderColor: ogStyles.themeId === theme.name ? '#3b82f6' : 'transparent'
                                                }}
                                            >
                                                <div className="flex items-end w-full h-24 p-2">
                                                    <span className="text-xs font-medium text-white drop-shadow-md">
                                                        {theme.name}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'themes-image' && (
                                    <div className="grid grid-cols-2 gap-2">
                                        {imageThemes.map(theme => (
                                            <div
                                                key={theme.name}
                                                onClick={() => applyTheme(theme)}
                                                className="h-32 overflow-hidden transition-all bg-center bg-cover border-2 rounded-lg cursor-pointer hover:scale-105"
                                                style={{
                                                    backgroundImage: `url(${theme.backgroundImage})`,
                                                    borderColor: ogStyles.themeId === theme.name ? '#3b82f6' : 'transparent'
                                                }}
                                            >
                                                <div className="flex items-end w-full h-full p-2 bg-black bg-opacity-20">
                                                    <span className="text-xs font-medium text-white drop-shadow-md">
                                                        {theme.name}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'themes-pattern' && (
                                    <div className="grid grid-cols-2 gap-2">
                                        {patternThemes.map(theme => (
                                            <div
                                                key={theme.name}
                                                onClick={() => applyTheme(theme)}
                                                className="h-24 overflow-hidden transition-all border-2 rounded-lg cursor-pointer hover:scale-105"
                                                style={{
                                                    backgroundColor: theme.backgroundColor,
                                                    backgroundImage: theme.backgroundImage,
                                                    backgroundSize: theme.backgroundSize || 'auto',
                                                    borderColor: ogStyles.themeId === theme.name ? '#3b82f6' : 'transparent'
                                                }}
                                            >
                                                <div className="flex items-end w-full h-full p-2">
                                                    <span className="text-xs font-medium text-white drop-shadow-md">
                                                        {theme.name}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'themes-typography' && (
                                    <div className="space-y-2">
                                        {typographyThemes.map(font => (
                                            <button
                                                key={font.name}
                                                className={`w-full rounded-lg p-4 text-left transition-colors ${ogStyles.typographyTheme?.name === font.name
                                                    ? 'bg-blue-50 border-2 border-blue-200'
                                                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                                                    }`}
                                                onClick={() => applyTypographyTheme(font)}
                                                style={{
                                                    fontFamily: font.fontFamily,
                                                    letterSpacing: font.letterSpacing,
                                                }}
                                            >
                                                <h3
                                                    className="text-lg"
                                                    style={{ fontWeight: font.headingWeight }}
                                                >
                                                    {font.name}
                                                </h3>
                                                <p
                                                    className="text-sm text-gray-600"
                                                    style={{
                                                        fontWeight: font.bodyWeight,
                                                        lineHeight: font.lineHeight,
                                                    }}
                                                >
                                                    The quick brown fox jumps over the lazy dog.
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Save Button - Kept at bottom */}
            <button
                onClick={handleSubmit}
                disabled={mutation.isLoading}
                className="flex items-center justify-center w-full gap-2 px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-xl hover:bg-blue-700"
            >
                {mutation.isLoading ? 'Saving...' : 'Save Settings'}
            </button>

            {/* Info Panel */}
            <div className="p-4 mt-6 border border-blue-100 rounded-lg bg-blue-50">
                <div className="flex gap-3">
                    <Palette className="flex-shrink-0 w-5 h-5 mt-0.5 text-blue-600" />
                    <div>
                        <p className="text-sm text-blue-800">
                            These settings control how your profile looks when shared on social media,
                            in messages, and anywhere else links are previewed.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OgImageEditor;