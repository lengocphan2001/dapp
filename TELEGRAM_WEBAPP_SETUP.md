# Telegram Web App Setup Guide

This guide will help you set up Telegram Web App authentication for your DeFi DApp, similar to how the Telegram Wallet app works.

## Prerequisites

1. A Telegram Bot (created via @BotFather)
2. A deployed web application
3. Node.js and npm installed

## Step 1: Configure Your Telegram Bot

### 1.1 Create a Bot (if you haven't already)
1. Message @BotFather on Telegram
2. Send `/newbot`
3. Follow the instructions to create your bot
4. Save the bot token

### 1.2 Configure Web App Settings
1. Message @BotFather with `/mybots`
2. Select your bot
3. Go to "Bot Settings" → "Menu Button"
4. Set the menu button URL to your deployed app URL (e.g., `https://your-app.vercel.app`)

### 1.3 Set Bot Commands
Send this to @BotFather:
```
/setcommands
```
Then send:
```
start - Start the DeFi DApp
defi - Open DeFi Dashboard
dashboard - Open main dashboard
help - Show help information
```

## Step 2: Environment Variables

Create a `.env` file in your project root:

```env
REACT_APP_TELEGRAM_BOT_TOKEN=your_bot_token_here
REACT_APP_APP_URL=https://your-app.vercel.app
```

## Step 3: Update Bot Configuration

Update the bot token in `defi-bot/bot.js`:

```javascript
const token = 'YOUR_BOT_TOKEN_HERE';
const APP_URL = 'https://your-app.vercel.app';
```

## Step 4: Deploy Your Application

### Option A: Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy the application
4. Update the `APP_URL` in your bot with the Vercel URL

### Option B: Deploy to Netlify
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Deploy the application
4. Update the `APP_URL` in your bot with the Netlify URL

## Step 5: Test the Integration

1. Start your bot: `node defi-bot/bot.js`
2. Message your bot with `/start`
3. Click the "Open DeFi DApp" button
4. The app should open in Telegram and automatically authenticate you

## How It Works

### Authentication Flow
1. User clicks the Web App button in Telegram
2. Telegram opens your app with user data in the URL
3. The app automatically extracts and validates the user data
4. User is authenticated without any login form
5. User can access all DeFi features immediately

### Security Features
- Telegram provides cryptographically signed user data
- The app validates the authentication hash
- User data is securely stored in localStorage
- Session persists until user logs out

## Troubleshooting

### Common Issues

1. **App doesn't open in Telegram**
   - Check that your bot token is correct
   - Verify the APP_URL is accessible
   - Make sure the Web App script is loaded

2. **Authentication fails**
   - Check browser console for errors
   - Verify Telegram Web App script is loaded
   - Ensure user data is being passed correctly

3. **App shows login page instead of dashboard**
   - Check that `telegramAuth.isTelegramWebApp()` returns true
   - Verify user data extraction is working
   - Check the authentication validation logic

### Debug Mode

Add this to your browser console to debug:
```javascript
// Check if Telegram Web App is available
console.log('Telegram WebApp:', window.Telegram?.WebApp);

// Check user data
console.log('User data:', window.Telegram?.WebApp?.initDataUnsafe?.user);

// Check if running in Telegram
console.log('Is Telegram WebApp:', !!window.Telegram?.WebApp);
```

## Advanced Configuration

### Custom Themes
You can customize the Telegram Web App appearance:

```javascript
// In telegramAuth.ts
window.Telegram.WebApp.setHeaderColor('#667eea');
window.Telegram.WebApp.setBackgroundColor('#0f0f23');
```

### Backend Validation
For production, implement server-side validation:

```javascript
// Validate hash on your backend
const validateHash = (initData, botToken) => {
  // Implementation depends on your backend
  // See Telegram documentation for details
};
```

## Security Best Practices

1. **Never expose your bot token** in client-side code
2. **Validate authentication** on your backend
3. **Use HTTPS** for all communications
4. **Implement rate limiting** for API calls
5. **Store sensitive data** securely

## Support

If you encounter issues:
1. Check the Telegram Web App documentation
2. Review the browser console for errors
3. Verify all environment variables are set
4. Test with a fresh Telegram session

## Next Steps

Once basic authentication is working:
1. Add Web3 wallet integration
2. Implement DeFi features
3. Add transaction notifications
4. Set up user preferences
5. Add admin features 