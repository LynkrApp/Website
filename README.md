<div align="center">
  <img src="public/logo.png" alt="Lynkr Logo" width="80" height="80">
  
  # Lynkr
  
  **The ultimate free & open source link in bio platform**
  
  Create beautiful, organized link pages that drive engagement and grow your audience.
  
  [![GitHub Stars](https://img.shields.io/github/stars/LynkrApp/Website?style=for-the-badge)](https://github.com/LynkrApp/Website/stargazers)
  [![GitHub Issues](https://img.shields.io/github/issues/LynkrApp/Website?style=for-the-badge)](https://github.com/LynkrApp/Website/issues)
  [![GitHub License](https://img.shields.io/github/license/LynkrApp/Website?style=for-the-badge)](https://github.com/LynkrApp/Website/blob/main/LICENSE)
  [![Discord](https://img.shields.io/discord/1387524650895933540?style=for-the-badge&logo=discord)](https://discord.gg/g76w2v7RzG)

  [🌐 Live Demo](https://lynkr.link) • [📖 Documentation](#getting-started) • [🐛 Report Bug](https://github.com/LynkrApp/Website/issues) • [💡 Request Feature](https://github.com/LynkrApp/Website/issues)
</div>

---

## ✨ Features

- 🆓 **100% Free & Open Source** - No hidden fees, no locked features
- ⚡ **Lightning Fast** - Built with Next.js for optimal performance
- 🎨 **Fully Customizable** - Themes, colors, layouts, and animated backgrounds
- 📊 **Built-in Analytics** - Track clicks, views, and engagement metrics
- 🗂️ **Organized Sections** - Group your links for better organization
- 🔒 **Privacy-First** - GDPR compliant with complete data ownership
- 📱 **Mobile Responsive** - Perfect on all devices
- 🔐 **Secure Authentication** - OAuth integration with Google, GitHub, and Discord
- 🎯 **Drag & Drop** - Intuitive interface for managing links
- 📤 **Data Export** - Download your data anytime in JSON format

## 🛠️ Tech Stack

- **Framework:** [Next.js 13](https://nextjs.org/)
- **Database:** [Prisma](https://prisma.io/) with Mongoose
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [Radix UI](https://radix-ui.com/)
- **Animations:** [Framer Motion](https://framer.com/motion/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Drag & Drop:** [dnd kit](https://dndkit.com/)
- **Analytics:** [Recharts](https://recharts.org/)

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn or bun
- Mongoose database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LynkrApp/Website.git
   cd Website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="mongodb://username:password@localhost:27017/lynkr"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # OAuth Providers
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   
   DISCORD_CLIENT_ID="your-discord-client-id"
   DISCORD_CLIENT_SECRET="your-discord-client-secret"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── components/          # Reusable UI components
│   ├── core/           # Core application components
│   ├── layout/         # Layout components
│   ├── root/           # Root level components (navbar, footer)
│   ├── shared/         # Shared components across features
│   └── utils/          # Utility components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and configurations
├── pages/              # Next.js pages (file-based routing)
│   ├── api/           # API routes
│   ├── admin/         # Admin dashboard pages
│   └── auth/          # Authentication pages
├── prisma/             # Database schema and migrations
├── public/             # Static assets
├── styles/             # Global styles
└── utils/              # Helper functions
```

## 🤝 Contributing

We love contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

We use ESLint and Prettier for code formatting. Run the following commands:

```bash
npm run lint          # Check for linting errors
npm run lint:fix      # Fix linting errors
```

## 📜 Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm run postinstall   # Generate Prisma client
```

## 🐛 Bug Reports

If you find a bug, please create an issue with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details

## 💡 Feature Requests

We welcome feature requests! Please:

- Check existing issues first
- Describe the feature clearly
- Explain the use case
- Add mockups/examples if helpful

## 📄 License

This project is licensed under the AGPL 3 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vercel](https://vercel.com) for hosting
- [Prisma](https://prisma.io) for database management
- [Radix UI](https://radix-ui.com) for accessible components
- [Lucide](https://lucide.dev) for beautiful icons
- All our amazing contributors!

## 🌟 Support

- ⭐ Star this repository
- 🐦 Follow us on [Twitter](https://x.com/HeyLynkr)
- 💬 Join our [Discord](https://discord.gg/g76w2v7RzG)
- 📧 Email us at [hello@lynkr.link](mailto:hello@lynkr.link)

## 📊 Status

- **Website:** [lynkr.link](https://lynkr.link)
- **Status Page:** [status.lynkr.link](https://lynkrapp.instatus.com)
- **Documentation:** Coming soon
- **API:** Coming soon

---

<div align="center">
  Made with ❤️ by the <a href="https://bytebrush.dev">ByteBrush Studios</a> team
  
  <br>
  
  <a href="https://github.com/LynkrApp/Website">⭐ Star us on GitHub</a> •
  <a href="https://x.com/HeyLynkr">🐦 Follow on Twitter</a> •
  <a href="https://discord.gg/g76w2v7RzG">💬 Join Discord</a>
</div>
