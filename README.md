# Telegram DApp - User Management System

A modern React TypeScript application that provides Telegram authentication and comprehensive user management with admin capabilities.

## Features

### 🔐 Authentication
- **Telegram Login/Register**: Seamless authentication using Telegram Web App
- **Demo Mode**: Test the application without actual Telegram integration
- **Session Management**: Persistent login sessions with token-based authentication
- **Role-based Access Control**: User and Admin roles with different permissions

### 💰 DeFi Platform
- **Wallet Connection**: Connect MetaMask and other Web3 wallets
- **Multi-Chain Support**: Ethereum, BSC, Polygon networks
- **Token Trading**: Swap tokens with real-time quotes and price impact
- **Liquidity Pools**: Add/remove liquidity to earn trading fees
- **Staking**: Stake tokens to earn rewards with lock periods
- **Yield Farming**: Participate in farming programs for additional rewards
- **Portfolio Tracking**: View your positions, staking, and farming activities
- **Transaction History**: Complete history of all DeFi transactions

### 👥 User Management (Admin Panel)
- **User Overview**: View all registered users with detailed information
- **Role Management**: Promote/demote users between User and Admin roles
- **Status Control**: Activate/deactivate user accounts
- **User Search**: Find users by name, username, or Telegram ID
- **User Details**: Detailed user information modal
- **User Deletion**: Remove users from the system with confirmation

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Beautiful Interface**: Modern, clean design with smooth animations
- **Telegram Integration**: Native Telegram Web App styling and interactions
- **Loading States**: Smooth loading indicators and transitions
- **Error Handling**: User-friendly error messages and notifications

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Routing**: React Router DOM
- **Styling**: CSS3 with modern design patterns
- **State Management**: React Context API
- **HTTP Client**: Axios (for real API integration)
- **Telegram Integration**: Telegram Web App SDK
- **Blockchain**: Ethers.js + Web3 React
- **DeFi**: Custom DeFi service with mock data
- **Wallet Integration**: MetaMask and Web3 wallet support

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── AuthContext.tsx  # Authentication context provider
│   ├── Web3Context.tsx  # Web3 wallet context provider
│   └── ProtectedRoute.tsx # Route protection component
├── pages/              # Page components
│   ├── LoginPage.tsx    # Login/Register page
│   ├── DashboardPage.tsx # User dashboard
│   ├── DeFiDashboardPage.tsx # DeFi platform dashboard
│   └── AdminPage.tsx    # Admin panel
├── services/           # API and external services
│   ├── api.ts          # Main API service
│   ├── mockApi.ts      # Mock API for demo
│   └── defiService.ts  # DeFi blockchain service
├── types/              # TypeScript type definitions
│   ├── index.ts        # Main type definitions
│   └── defi.ts         # DeFi-specific type definitions
├── utils/              # Utility functions
│   └── telegramAuth.ts # Telegram authentication utilities
└── App.tsx             # Main application component
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Demo Mode

The application includes a demo mode that allows you to test all features without actual Telegram integration:

1. Click "Demo Login" on the login page
2. You'll be logged in as a demo user
3. For admin access, use the demo admin account (ID: 987654321)

## Telegram Integration

### Setting up Telegram Bot

1. **Create a Telegram Bot**
   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Use `/newbot` command to create a new bot
   - Save the bot token

2. **Configure Web App**
   - Use `/setmenubutton` to set up the menu button
   - Use `/setcommands` to set bot commands

3. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_TELEGRAM_BOT_TOKEN=your_bot_token_here
   REACT_APP_API_URL=http://localhost:3001/api
   ```

### Real API Integration

To connect to a real backend API:

1. **Update API Configuration**
   - Modify `src/services/api.ts`
   - Uncomment the real API service
   - Comment out the mock service

2. **Backend Requirements**
   Your backend should implement these endpoints:
   - `POST /api/auth/telegram` - Telegram authentication
   - `POST /api/auth/register` - User registration
   - `POST /api/auth/logout` - User logout
   - `GET /api/auth/me` - Get current user
   - `GET /api/admin/users` - Get all users (admin)
   - `PUT /api/admin/users/:id/role` - Update user role (admin)
   - `PUT /api/admin/users/:id/status` - Toggle user status (admin)
   - `DELETE /api/admin/users/:id` - Delete user (admin)

## Usage

### For Users

1. **Login/Register**
   - Open the app from Telegram or use demo mode
   - Click "Login with Telegram" or "Demo Login"
   - Complete the authentication process

2. **Dashboard**
   - View your account information
   - See your role and status
   - Access DeFi dashboard for trading and investing
   - Access admin panel (if admin)

3. **DeFi Platform**
   - Connect your Web3 wallet (MetaMask)
   - View token prices and market data
   - Swap tokens with real-time quotes
   - Provide liquidity to earn trading fees
   - Stake tokens for rewards
   - Participate in yield farming programs
   - Track your portfolio and transaction history

### For Admins

1. **Access Admin Panel**
   - Login with admin credentials
   - Click "Admin Panel" on the dashboard

2. **Manage Users**
   - View all registered users
   - Search for specific users
   - Change user roles (User ↔ Admin)
   - Toggle user active status
   - View detailed user information
   - Delete users (with confirmation)

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with React rules
- **Prettier**: Code formatting (recommended)

### Adding New Features

1. **New Pages**: Add to `src/pages/` and update routing in `App.tsx`
2. **New Components**: Add to `src/components/` for reusability
3. **New Services**: Add to `src/services/` for API calls
4. **New Types**: Add to `src/types/index.ts`

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Static Hosting

The build folder can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Any static hosting service

### Environment Variables for Production

Set these environment variables in your hosting platform:
- `REACT_APP_TELEGRAM_BOT_TOKEN`
- `REACT_APP_API_URL`

## Security Considerations

- **Telegram Validation**: Always validate Telegram authentication data on the backend
- **Role Verification**: Verify admin permissions on the server side
- **Input Sanitization**: Sanitize all user inputs
- **HTTPS**: Use HTTPS in production
- **Token Management**: Implement proper JWT token handling

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## Acknowledgments

- Telegram for the Web App platform
- React team for the amazing framework
- The open-source community for inspiration and tools
