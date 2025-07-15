const TelegramBot = require('node-telegram-bot-api');

// Replace with your bot token from BotFather
const token = '7167895247:AAEFrSwFBaabDoGqicgaMe7Ins77tWgtGXc';
const bot = new TelegramBot(token, { polling: true });

// Your deployed app URL
const APP_URL = 'https://dapp-eight-sigma.vercel.app';

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `
🚀 Welcome to DeFi DApp!

This is your gateway to decentralized finance. Click the button below to open the DeFi dashboard.

Features:
• 💰 Token Trading
• 🏊 Liquidity Pools  
• 🏦 Staking
• 🌾 Yield Farming
• 📊 Portfolio Tracking
  `;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '🚀 Open DeFi DApp',
          web_app: { url: APP_URL }
        }
      ],
      [
        {
          text: '📊 View Stats',
          callback_data: 'stats'
        }
      ],
      [
        {
          text: '❓ Help',
          callback_data: 'help'
        }
      ]
    ]
  };

  bot.sendMessage(chatId, welcomeMessage, {
    reply_markup: keyboard,
    parse_mode: 'Markdown'
  });
});

// Handle /defi command
bot.onText(/\/defi/, (msg) => {
  const chatId = msg.chat.id;
  
  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '🚀 Open DeFi Dashboard',
          web_app: { url: `${APP_URL}/defi` }
        }
      ]
    ]
  };

  bot.sendMessage(chatId, 'Opening DeFi Dashboard...', {
    reply_markup: keyboard
  });
});

// Handle callback queries
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  switch (data) {
    case 'stats':
      const statsMessage = `
📊 DeFi DApp Statistics:

💰 Total Value Locked: $15M
📈 24h Volume: $2.5M
👥 Total Users: 12,500
🔄 Total Transactions: 45,000
📊 Average APR: 12.8%

Click the button below to explore more!
      `;
      
      const statsKeyboard = {
        inline_keyboard: [
          [
            {
              text: '🚀 Open DeFi DApp',
              web_app: { url: APP_URL }
            }
          ]
        ]
      };

      bot.sendMessage(chatId, statsMessage, {
        reply_markup: statsKeyboard,
        parse_mode: 'Markdown'
      });
      break;

    case 'help':
      const helpMessage = `
❓ How to use DeFi DApp:

1️⃣ **Connect Wallet**
   • Click "Connect Wallet" in the app
   • Use MetaMask or other Web3 wallets

2️⃣ **Start Trading**
   • Navigate to "Swap" tab
   • Select tokens to trade
   • Review quote and execute

3️⃣ **Provide Liquidity**
   • Go to "Liquidity Pools" tab
   • Add liquidity to earn fees
   • Monitor your positions

4️⃣ **Stake & Farm**
   • Visit "Staking" and "Yield Farms"
   • Stake tokens for rewards
   • Participate in farming programs

Need more help? Contact support!
      `;

      const helpKeyboard = {
        inline_keyboard: [
          [
            {
              text: '🚀 Open DeFi DApp',
              web_app: { url: APP_URL }
            }
          ]
        ]
      };

      bot.sendMessage(chatId, helpMessage, {
        reply_markup: helpKeyboard,
        parse_mode: 'Markdown'
      });
      break;
  }

  // Answer callback query
  bot.answerCallbackQuery(query.id);
});

// Handle /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  const helpMessage = `
🤖 DeFi DApp Bot Commands:

/start - Start the bot and open DeFi DApp
/defi - Open DeFi Dashboard directly
/help - Show this help message

💡 Tips:
• Use the menu button to quickly access the app
• Make sure you have MetaMask installed for DeFi features
• Start with small amounts when trading
  `;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '🚀 Open DeFi DApp',
          web_app: { url: APP_URL }
        }
      ]
    ]
  };

  bot.sendMessage(chatId, helpMessage, {
    reply_markup: keyboard,
    parse_mode: 'Markdown'
  });
});

// Error handling
bot.on('error', (error) => {
  console.error('Bot error:', error);
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('🤖 DeFi DApp Bot is running...');
console.log('📱 Send /start to begin');
console.log('🌐 Make sure to update APP_URL with your deployed app URL'); 