# Kelo - Web3 BNPL Platform

A revolutionary Buy Now, Pay Later platform for Kenya built on Web3 technology, featuring instant approval, flexible payment plans, and seamless M-Pesa integration.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual credentials
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

## 📋 Prerequisites

- Node.js 18.x or higher
- Google Cloud Project with OAuth 2.0 credentials
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page with authentication
│   ├── marketplace/       # Product browsing and shopping
│   ├── cart/             # Shopping cart management
│   ├── checkout/         # Multi-step checkout process
│   ├── dashboard/        # User dashboard and BNPL management
│   └── api/auth/         # Authentication API routes
├── components/            # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard-specific components
│   ├── layout/           # Layout components (sidebar, main)
│   ├── marketplace/      # Marketplace components
│   ├── payment/          # Payment and BNPL widgets
│   └── ui/               # shadcn/ui base components
├── lib/                  # Utilities and services
│   ├── auth/            # Authentication services
│   ├── hooks/           # Custom React hooks
│   ├── services/        # Business logic services
│   └── wallet/          # Smart wallet services
```

## 🔧 Technology Stack

- **Frontend:** Next.js 13.5.1 (React) with App Router
- **Styling:** Tailwind CSS + shadcn/ui components
- **Authentication:** Google OAuth 2.0 + Smart Wallet integration
- **Blockchain:** Wagmi + Viem for Web3 connectivity (Base L2)
- **State Management:** React Context + Zustand for cart
- **Deployment:** Netlify with optimized build configuration

## 🎯 Core Features

### User Features
- **Instant BNPL Approval:** Get approved in seconds for purchases
- **Flexible Payment Plans:** Pay in 4 interest-free installments or extended terms
- **Smart Wallet Integration:** Automatic Web3 wallet creation and management
- **M-Pesa Integration:** Seamless mobile money payments
- **Credit Score Building:** Improve creditworthiness with on-time payments
- **Yield Generation:** Earn APY on deposited crypto assets

### Technical Features
- **Responsive Design:** Mobile-first approach with touch-optimized UI
- **Real-time Cart:** Persistent shopping cart with live calculations
- **Multi-step Checkout:** Streamlined purchase flow with payment options
- **Dashboard Analytics:** Comprehensive financial overview and management
- **Security:** Bank-level encryption and Web3 security features

## 🔐 Environment Configuration

Create `.env.local` with the following variables:

```ini
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback

# JWT Configuration (32+ character random string)
JWT_SECRET=your_jwt_secret_key_here_at_least_32_characters_long

# Wallet Encryption (32+ character random string)
WALLET_ENCRYPTION_KEY=your_wallet_encryption_key_here_at_least_32_characters_long

# Blockchain Configuration
BASE_RPC_URL=https://mainnet.base.org

# Environment
NODE_ENV=development
```

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests
npm test
```

## 📱 Mobile Optimization

- **Touch Targets:** Minimum 44x44px for all interactive elements
- **Responsive Breakpoints:** Mobile-first design with proper breakpoints
- **Performance:** Optimized images and lazy loading
- **Navigation:** Collapsible sidebar with mobile overlay
- **Forms:** Touch-friendly inputs with appropriate keyboard types

## 🔍 Troubleshooting

### Common Issues

1. **Memory Allocation Error:**
   ```bash
   # Solution: Increase Node.js memory limit
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm run dev
   ```

2. **Google OAuth Errors:**
   - Verify OAuth credentials in Google Cloud Console
   - Check redirect URI matches exactly
   - Ensure test user email is added to OAuth consent screen

3. **Font Loading Issues:**
   - Ensure `display: 'swap'` is set for Google Fonts
   - Check internet connection for font downloads

## 🚀 Deployment

The project is configured for Netlify deployment with optimized build settings:

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NODE_OPTIONS = "--max-old-space-size=4096"
```

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

This is a private project. For questions or support, please contact the development team.

---

**Built with ❤️ for the Kenyan market**