# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- API documentation
- Mobile app
- Custom domain support
- Advanced analytics dashboard
- Bulk link import/export
- Link scheduling

## [0.3.0] - 2025-08-08

### 🚀 New Features

- ✨ Update the codebase to use TypeScript
- ✨ Formating changes
- ✨ Added New CLI to convert Mongodb data to MySQL

### ⚡ Improvements

- ⚡ Everything uses React-Icons or Lucide-React insted of SVGs to provide consistency.
- ⚡ Added Username and Bio to onboarding (Optional)
- ⚡ Added a wanring when clicking on "NSFW" links

### 🔧 Bug Fixes

- 🐛 Fixed the og
- 🐛 Fixed API praising bugs

## [0.2.0] - 2025-08-07

### 🚀 New Features

- ✨ Redesigned hero section with slate gradient theme for improved visual appeal
- ✨ Updated navigation bar to match the slate theme of the footer
- ✨ Added version display with git hash in the footer
- ✨ Implemented changelog API for dynamic version history
- ✨ Implemented a new "Tabbed Sections" layouts that breaks link sections into tabs
- ✨ Improved footer layout with better grid structure and mobile responsiveness
- ✨ Created glassmorphic tabbed sections component for better content organization
- ✨ Enhanced social cards component with improved sizing and responsiveness
- ✨ Added new tab-button component with animation and active state indicators
- ✨ Implemented collapsible sections in the admin panel for better link management
- ✨ Added mobile-optimized layout for the admin dashboard
- ✨ Introduced improved drag and drop interface for section reordering
- ✨ Implemented custom page meta tags for improved SEO and social sharing
- ✨ Added user handle editing capability in settings page
- ✨ Fixed authentication system to properly direct new users to onboarding flow
- ✨ Implemented tabbed layouts for user profiles with smooth transitions
- ✨ Added reorderable sections in admin panel with visual feedback
- ✨ Created user onboarding flow with step-by-step guidance
- ✨ Implemented handle availability checker in real-time
- ✨ Added multiple layout options for profile organization
- ✨ Enhanced profile customization with additional theming options
- ✨ Implemented social cards grid layout option
- ✨ Added OG image customization for better social media previews
- ✨ Created fully mobile-responsive OG image editor with real-time preview
- ✨ Added theme application system to automatically apply profile themes to OG images
- ✨ Implemented typography customization for OG images
- ✨ Added statistics display toggle for OG images
- ✨ Improved user profile metadata with dynamic Open Graph tags
- ✨ Added geolocation support for analytics with IP-based country detection
- ✨ Created database models for better analytics tracking (page views, link clicks)
- ✨ Implemented social media preview customization with multiple templates
- ✨ Added color picker interface for fine-tuning social preview appearance
- ✨ Created adaptive layout system for different screen sizes in profile editor
- ✨ Enhanced 404 Not Found page with improved visual design and user experience
- ✨ Created custom error pages for better error handling throughout the application
- ✨ Implemented responsive design fixes for OG image editor on mobile devices
- ✨ Added smooth animations to error pages for better visual feedback
- ✨ Improved "favicon toggle" functionality in link editor with proper state persistence
- ✨ Enhanced UX for handle claim suggestions on 404 pages
- ✨ Created page router friendly error pages with better debugging capabilities

### 🔧 Bug Fixes

- 🐛 Fixed mobile menu layout issues on smaller screens
- 🐛 Corrected social icon spacing in the footer
- 🐛 Resolved navigation inconsistencies between mobile and desktop
- 🐛 Fixed tab text visibility issues with proper z-index layering
- 🐛 Resolved section reordering functionality in the admin panel
- 🐛 Fixed profile page layout spacing and sizing on mobile devices
- 🐛 Corrected avatar and bio display sizing on profile pages
- 🐛 Fixed section dragging and dropping in the admin interface
- 🐛 Resolved authentication redirection issues for new users
- 🐛 Fixed handle validation and uniqueness checking
- 🐛 Corrected meta tag generation for social media previews
- 🐛 Fixed tab navigation accessibility issues
- 🐛 Resolved social icon rendering on different backgrounds
- 🐛 Fixed mobile responsive layout for onboarding screens
- 🐛 Fixed database relation definitions in Prisma schema for analytics models
- 🐛 Resolved Vercel OG image generation issues with proper component structure
- 🐛 Fixed color picker positioning and interaction on mobile devices
- 🐛 Corrected theme application system for profile customization
- 🐛 Fixed social card icon rendering for special cases and aliases
- 🐛 Resolved layout issues with the OG customizer on small screens
- 🐛 Fixed navigation for mobile users in the admin dashboard
- 🐛 Fixed OG image editor overflowing screen boundaries on small devices
- 🐛 Resolved issues with color picker positioning in mobile view
- 🐛 Fixed responsive layout issues with tabs in OG image editor
- 🐛 Corrected error page routing and display on various error types
- 🐛 Fixed favicon toggle not properly saving state to database
- 🐛 Resolved UI inconsistencies in link editing modals
- 🐛 Fixed error display and handling for various error scenarios
- 🐛 Corrected drag and drop confusion between links and sections in editor

### ⚡ Improvements

- ⚡ Enhanced overall UI consistency with slate theme
- ⚡ Optimized footer grid layout for better content organization
- ⚡ Improved loading of version information
- ⚡ Added transition animations to navigation elements
- ⚡ Enhanced mobile responsiveness across all components
- ⚡ Improved profile layout with better spacing and visual hierarchy
- ⚡ Enhanced admin dashboard with better visual feedback during interactions
- ⚡ Optimized social icons for better visibility and sizing
- ⚡ Refined tab navigation with improved animations and state management
- ⚡ Added visual feedback for drag and drop operations
- ⚡ Improved typography across all components for better readability
- ⚡ Enhanced user onboarding experience with clearer instructions
- ⚡ Improved handle editing workflow with validation feedback
- ⚡ Optimized authentication flow for smoother user experience
- ⚡ Enhanced section management with better organization options
- ⚡ Improved profile customization with more intuitive controls
- ⚡ Refined tabbed interface for better usability on all devices
- ⚡ Added performance optimizations for smoother animations
- ⚡ Enhanced user data models for better analytics tracking
- ⚡ Improved social media preview generation with Vercel OG Image
- ⚡ Optimized theme application across different components
- ⚡ Enhanced layout responsiveness for various screen sizes
- ⚡ Improved color picker interface with better usability
- ⚡ Added tooltips and help text for better user guidance
- ⚡ Enhanced mobile navigation with dedicated bottom controls
- ⚡ Improved share button functionality for better content distribution
- ⚡ Optimized page metadata for better SEO and social sharing
- ⚡ Enhanced mobile experience with better spacing and sizing in OG editor
- ⚡ Improved error page UX with clear actions and better guidance
- ⚡ Added proper scrolling behavior to theme galleries on small screens
- ⚡ Enhanced color picker interface with improved touch interaction
- ⚡ Improved visual feedback during OG image editing
- ⚡ Optimized error page loading and rendering
- ⚡ Added custom 500 error page with helpful messaging
- ⚡ Enhanced debugging information for developers in error pages

## [0.1.0] - 2025-08-04

### 🎉 Initial Release

#### Added

- **Core Features**
  - User authentication via Google, GitHub, and Discord OAuth
  - Custom handle/username system
  - Link management with drag & drop reordering
  - Section organization for grouping links
  - Real-time link analytics (views, clicks)
  - Profile customization (bio, profile image)

- **Theming & Customization**
  - Multiple built-in themes (Minimal, Modern, Gradient, Neon, etc.)
  - Custom color schemes
  - Background pattern options
  - Typography customization
  - Mobile-responsive design

- **User Experience**
  - Intuitive admin dashboard
  - Real-time preview of changes
  - Drag & drop link management
  - Section-based organization
  - Link archiving functionality

- **Privacy & Security**
  - GDPR compliance
  - Complete data export functionality
  - Account deletion with data cleanup
  - Privacy-first approach
  - No data selling policy

- **Technical Features**
  - Server-side rendering with Next.js 13
  - MySQL database with Prisma ORM
  - Responsive design with Tailwind CSS
  - Component library with Radix UI
  - Smooth animations with Framer Motion

- **Pages & Layout**
  - Landing page with feature showcase
  - User profile pages
  - Admin dashboard
  - Settings panel
  - Legal pages (Privacy, Terms, GDPR, Cookies)
  - About and Contact pages
  - Press kit with downloadable assets

- **Developer Experience**
  - Open source under AGPL 3 license
  - Comprehensive documentation
  - ESLint and Prettier configuration
  - TypeScript-ready codebase
  - Docker support

#### Technical Stack

- **Frontend:** Next.js 13, React 18, Tailwind CSS
- **Backend:** Next.js API routes, Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** NextAuth.js with OAuth providers
- **UI Components:** Radix UI primitives
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Deployment:** Vercel

#### Security

- OAuth-based authentication (no password storage)
- CSRF protection
- Secure session management
- Data encryption in transit
- Regular security updates

---

## Release Notes

### 🎯 What's Next?

- Enhanced analytics with detailed metrics
- Custom domain support for pro users
- API access for developers
- Mobile application
- Advanced customization options

### 🐛 Known Issues

- None at this time

### 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### 📞 Support

- 🐛 [Report bugs](https://github.com/LynkrApp/Website/issues)
- 💡 [Request features](https://github.com/LynkrApp/Website/issues)
- 💬 [Join our Discord](https://discord.gg/g76w2v7RzG)
- 📧 [Email us](mailto:hello@lynkr.link)

---

**Full Changelog**: https://github.com/LynkrApp/Website/commits/v0.2.0
