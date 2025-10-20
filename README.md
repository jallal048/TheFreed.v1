<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# TheFreed - Content Monetization Platform

> A comprehensive frontend-only simulation of a content monetization platform, built with React + TypeScript

## 🚀 Features

- **Multi-role System**: Fans, Creators, and Admins with different capabilities
- **Subscription Management**: Monthly subscriptions with discount packages
- **Content Types**: Public, subscriber-only, and pay-per-view content
- **Messaging System**: Real-time chat with tips and PPV messages
- **Admin Panel**: Complete management dashboard
- **Gamification**: Achievements and ranking system
- **Internationalization**: Multi-language support (EN/ES)
- **Dark Mode**: Full dark/light theme support
- **Responsive Design**: Mobile-first approach

## 🛠️ Tech Stack

- **React 19.1.0** + **TypeScript**
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Context API** for state management
- **No backend required** - fully simulated in frontend

## 💻 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jallal048/TheFreed.v1.git
   cd TheFreed.v1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm run preview
```

## 👥 User Accounts (Pre-configured)

| Role | Username | Password | Description |
|------|----------|----------|--------------|
| Fan | `MyFan` | `password` | Regular user with subscriptions |
| Creator | `aurora_arts` | `password` | Artist with premium content |
| Admin | `AdminUser` | `password` | Platform administrator |

## 🏢 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── pages/              # Main application pages
├── services/           # Business logic services
├── utils/              # Utility functions
├── locales/            # Translation files
├── types.ts            # TypeScript definitions
├── constants.ts        # Mock data and configuration
└── App.tsx             # Main application component
```

## 🌐 Key Features Deep Dive

### 🎨 Creator Features
- Profile customization with categories
- Content scheduling and management
- Subscription pricing and packages
- Fan lists for targeted content
- Revenue tracking and analytics
- Live messaging with fans

### 👥 Fan Features
- Discover and explore content
- Subscription management
- Bookmarking and favorites
- Direct messaging with creators
- Achievement system
- Personalized recommendations

### 🔒 Admin Features
- User management (suspend, ban, verify)
- Content moderation and reports
- Financial oversight and payouts
- Platform settings and announcements
- Support ticket management
- Auto-moderation queue

## 🎮 Demo Data

The app comes with rich mock data including:
- 50+ generated creators across multiple categories
- Hundreds of posts with various content types
- Complex user relationships and interactions
- Realistic transaction history
- Pre-configured admin scenarios

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript checks

### Environment Variables (Optional)

Copy `.env.example` to `.env.local` for additional configuration:

```bash
cp .env.example .env.local
```

## 📝 Architecture Notes

- **No Backend**: Entirely frontend-based simulation
- **State Management**: React Context API with persistent mock data
- **Routing**: Custom navigation provider (no React Router)
- **Styling**: Tailwind CSS with custom components
- **Type Safety**: Full TypeScript coverage

## 📊 Performance

- Optimized for development and demonstration
- Large mock dataset for realistic testing
- Context-based state management
- Responsive design for all screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run type checks: `npm run type-check`
5. Submit a pull request

## 📝 License

This project is for educational and demonstration purposes.

---

**Built with ❤️ for the creator economy**