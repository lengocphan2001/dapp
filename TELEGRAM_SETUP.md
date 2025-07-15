# 🤖 Telegram Bot Setup Guide for DeFi DApp

This guide will help you set up your Telegram bot to run your DeFi DApp.

## 📋 Prerequisites

- Node.js installed on your system
- A Telegram account
- Your DeFi DApp deployed to a public URL

## 🚀 Step 1: Create Telegram Bot

### 1.1 Create Bot with BotFather

1. **Open Telegram** and search for `@BotFather`
2. **Start a chat** with BotFather
3. **Send**: `/newbot`
4. **Follow the prompts**:
   - **Bot name**: `My DeFi DApp` (or any name you like)
   - **Bot username**: `mydefidapp_bot` (must end with 'bot')
5. **Save the bot token** - you'll need this later!

### 1.2 Configure Bot Settings

Send these commands to BotFather:

#### Set Menu Button:
```
/setmenubutton
```
- Select your bot
- **Button text**: `🚀 Open DeFi DApp`
- **URL**: `https://your-app-domain.com` (your deployed app URL)

#### Set Commands:
```
/setcommands
```
- Select your bot
- Add these commands:
```
start - Start the DeFi DApp
defi - Open DeFi Dashboard
help - Get help
```

## 🌐 Step 2: Deploy Your DApp

### Option A: Deploy to Netlify (Recommended - Free)

1. **Push your code to GitHub**
2. **Go to [Netlify](https://netlify.com)**
3. **Click "New site from Git"**
4. **Connect your GitHub repository**
5. **Build settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
6. **Environment variables**:
   - `REACT_APP_TELEGRAM_BOT_TOKEN`: Your bot token
7. **Deploy!**

### Option B: Deploy to Vercel (Free)

1. **Push your code to GitHub**
2. **Go to [Vercel](https://vercel.com)**
3. **Import your repository**
4. **Environment variables**:
   - `REACT_APP_TELEGRAM_BOT_TOKEN`: Your bot token
5. **Deploy!**

### Option C: Deploy to GitHub Pages

1. **Add to package.json**:
```json
{
  "homepage": "https://yourusername.github.io/your-repo-name",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

2. **Install gh-pages**:
```bash
npm install --save-dev gh-pages
```

3. **Deploy**:
```bash
npm run deploy
```

## 🤖 Step 3: Set Up Bot Server

### 3.1 Install Bot Dependencies

```bash
# Copy bot files to a new directory
mkdir defi-bot
cd defi-bot
cp ../bot.js .
cp ../bot-package.json package.json

# Install dependencies
npm install
```

### 3.2 Configure Bot

Edit `bot.js`:

1. **Replace bot token**:
```javascript
const token = 'YOUR_ACTUAL_BOT_TOKEN_HERE';
```

2. **Update app URL**:
```javascript
const APP_URL = 'https://your-deployed-app-url.com';
```

### 3.3 Run Bot

```bash
# Start the bot
npm start

# Or for development with auto-restart
npm run dev
```

## 🔧 Step 4: Configure Your DApp

### 4.1 Environment Variables

Create `.env` file in your DApp root:

```env
REACT_APP_TELEGRAM_BOT_TOKEN=your_bot_token_here
REACT_APP_API_URL=https://your-backend-api.com
```

### 4.2 Update Telegram Integration

The `src/utils/telegramAuth.ts` file is already configured to work with your bot.

## 🧪 Step 5: Test Your Setup

### 5.1 Test Bot Commands

1. **Find your bot** on Telegram (using the username you created)
2. **Send `/start`** - should show welcome message with DeFi DApp button
3. **Send `/defi`** - should open DeFi dashboard directly
4. **Send `/help`** - should show help information

### 5.2 Test Web App Integration

1. **Click "🚀 Open DeFi DApp"** button in bot
2. **Should open your DApp** in Telegram Web App
3. **Test Telegram authentication** - should auto-login
4. **Test DeFi features** - wallet connection, trading, etc.

## 🔒 Step 6: Security Considerations

### 6.1 Bot Token Security

- **Never commit** your bot token to public repositories
- **Use environment variables** for all sensitive data
- **Rotate tokens** regularly

### 6.2 Web App Security

- **Validate Telegram data** on your backend
- **Implement proper authentication** checks
- **Use HTTPS** for all communications

## 🚀 Step 7: Production Deployment

### 7.1 Host Bot Server

You can host your bot on:

- **Heroku** (Free tier available)
- **Railway** (Free tier available)
- **DigitalOcean** (Paid)
- **AWS EC2** (Paid)
- **Your own server**

### 7.2 Example Heroku Deployment

1. **Create Heroku app**
2. **Set environment variables**:
   ```bash
   heroku config:set BOT_TOKEN=your_bot_token
   heroku config:set APP_URL=https://your-app-url.com
   ```
3. **Deploy**:
   ```bash
   git push heroku main
   ```

## 📱 Step 8: User Experience

### 8.1 Bot Features

Your bot now provides:

- **Welcome message** with DeFi DApp access
- **Direct DeFi dashboard** access
- **Statistics** and information
- **Help system** for users
- **Menu button** for quick access

### 8.2 User Flow

1. **User finds your bot** on Telegram
2. **Sends `/start`** to begin
3. **Clicks "Open DeFi DApp"** button
4. **DApp opens** in Telegram Web App
5. **User connects wallet** and starts trading
6. **Bot provides support** and information

## 🛠️ Troubleshooting

### Common Issues

1. **Bot not responding**:
   - Check if bot is running
   - Verify bot token is correct
   - Check server logs

2. **Web App not opening**:
   - Verify APP_URL is correct
   - Check if DApp is deployed and accessible
   - Ensure HTTPS is used

3. **Authentication issues**:
   - Check bot token in environment variables
   - Verify Telegram Web App integration
   - Test with demo mode first

### Debug Commands

Add these to your bot for debugging:

```javascript
bot.onText(/\/debug/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Bot is running! App URL: ${APP_URL}`);
});
```

## 📞 Support

If you encounter issues:

1. **Check the logs** from your bot server
2. **Verify all URLs** are correct and accessible
3. **Test with demo mode** first
4. **Check Telegram Bot API** documentation

## 🎉 Congratulations!

Your DeFi DApp is now fully integrated with Telegram! Users can:

- Access your DeFi platform directly from Telegram
- Trade tokens, provide liquidity, and stake
- Get support and information through the bot
- Enjoy a seamless mobile experience

Remember to:
- Monitor your bot's performance
- Update your DApp regularly
- Provide good user support
- Keep your bot token secure

Happy DeFi trading! 🚀💰 