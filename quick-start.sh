#!/bin/bash

echo "🚀 DeFi DApp Telegram Bot Quick Start"
echo "====================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js is installed"

# Create bot directory
echo "📁 Creating bot directory..."
mkdir -p defi-bot
cd defi-bot

# Copy bot files
echo "📋 Copying bot files..."
cp ../bot.js .
cp ../bot-package.json package.json

# Install dependencies
echo "📦 Installing bot dependencies..."
npm install

echo ""
echo "🎉 Bot setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit bot.js and replace 'YOUR_BOT_TOKEN_HERE' with your actual bot token"
echo "2. Update APP_URL with your deployed DApp URL"
echo "3. Run: npm start"
echo ""
echo "🤖 To create your bot:"
echo "1. Open Telegram and search for @BotFather"
echo "2. Send /newbot"
echo "3. Follow the prompts"
echo "4. Save the bot token"
echo ""
echo "🌐 To deploy your DApp:"
echo "1. Push code to GitHub"
echo "2. Deploy to Netlify/Vercel/GitHub Pages"
echo "3. Update APP_URL in bot.js"
echo ""
echo "📖 For detailed instructions, see TELEGRAM_SETUP.md" 