import {
  DepositMethod,
  DepositTransaction,
  DepositAddress,
  DepositLimit,
  FiatDepositMethod,
  DepositQuote,
  DepositSettings,
} from '../types/deposit';

// Mock deposit methods
const mockDepositMethods: DepositMethod[] = [
  {
    id: 'crypto-eth',
    name: 'Ethereum (ETH)',
    type: 'crypto',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    description: 'Deposit ETH directly to your wallet',
    minAmount: 0.001,
    maxAmount: 100,
    fee: 0,
    processingTime: '1-3 confirmations',
    isActive: true,
    supportedTokens: ['ETH'],
  },
  {
    id: 'crypto-usdc',
    name: 'USD Coin (USDC)',
    type: 'crypto',
    icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    description: 'Deposit USDC on Ethereum network',
    minAmount: 10,
    maxAmount: 100000,
    fee: 0,
    processingTime: '1-3 confirmations',
    isActive: true,
    supportedTokens: ['USDC'],
  },
  {
    id: 'crypto-usdt',
    name: 'Tether (USDT)',
    type: 'crypto',
    icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    description: 'Deposit USDT on Ethereum network',
    minAmount: 10,
    maxAmount: 100000,
    fee: 0,
    processingTime: '1-3 confirmations',
    isActive: true,
    supportedTokens: ['USDT'],
  },
  {
    id: 'crypto-bnb',
    name: 'BNB Smart Chain',
    type: 'crypto',
    icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    description: 'Deposit BNB and BSC tokens',
    minAmount: 0.01,
    maxAmount: 1000,
    fee: 0,
    processingTime: '1-3 confirmations',
    isActive: true,
    supportedTokens: ['BNB', 'BUSD', 'CAKE'],
  },
];

const mockFiatDepositMethods: FiatDepositMethod[] = [
  {
    id: 'stripe-card',
    name: 'Credit/Debit Card',
    provider: 'stripe',
    supportedCurrencies: ['USD', 'EUR', 'GBP'],
    minAmount: 10,
    maxAmount: 10000,
    fee: 0.029, // 2.9%
    processingTime: 'Instant',
    isActive: true,
  },
  {
    id: 'paypal',
    name: 'PayPal',
    provider: 'paypal',
    supportedCurrencies: ['USD', 'EUR', 'GBP'],
    minAmount: 10,
    maxAmount: 5000,
    fee: 0.025, // 2.5%
    processingTime: 'Instant',
    isActive: true,
  },
  {
    id: 'bank-transfer',
    name: 'Bank Transfer',
    provider: 'bank',
    supportedCurrencies: ['USD', 'EUR', 'GBP'],
    minAmount: 100,
    maxAmount: 50000,
    fee: 0,
    processingTime: '1-3 business days',
    isActive: true,
  },
];

const mockDepositSettings: DepositSettings = {
  enabled: true,
  requireKYC: false,
  minDepositAmount: 10,
  maxDepositAmount: 100000,
  supportedCurrencies: ['USD', 'EUR', 'GBP'],
  supportedTokens: ['ETH', 'USDC', 'USDT', 'BNB', 'BUSD'],
  autoApprove: true,
  requireConfirmation: false,
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate mock deposit addresses
const generateDepositAddress = (currency: string): string => {
  const addresses: { [key: string]: string } = {
    ETH: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    USDC: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    USDT: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    BNB: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  };
  return addresses[currency] || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
};

export const depositService = {
  // Get deposit methods
  getDepositMethods: async (): Promise<DepositMethod[]> => {
    await delay(500);
    return mockDepositMethods;
  },

  getFiatDepositMethods: async (): Promise<FiatDepositMethod[]> => {
    await delay(500);
    return mockFiatDepositMethods;
  },

  // Get deposit settings
  getDepositSettings: async (): Promise<DepositSettings> => {
    await delay(300);
    return mockDepositSettings;
  },

  // Get deposit quote
  getDepositQuote: async (
    methodId: string,
    amount: number,
    currency: string
  ): Promise<DepositQuote> => {
    await delay(800);

    const cryptoMethod = mockDepositMethods.find(m => m.id === methodId);
    const fiatMethod = mockFiatDepositMethods.find(m => m.id === methodId);
    const method = cryptoMethod || fiatMethod;

    if (!method) {
      throw new Error('Deposit method not found');
    }

    const fee = method.fee * amount;
    const netAmount = amount - fee;
    const depositAddress = cryptoMethod ? generateDepositAddress(currency) : undefined;

    return {
      methodId,
      amount,
      currency,
      fee,
      netAmount,
      exchangeRate: 1,
      estimatedTime: method.processingTime,
      depositAddress,
      qrCode: depositAddress ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${depositAddress}` : undefined,
    };
  },

  // Create deposit transaction
  createDeposit: async (
    userId: string,
    methodId: string,
    amount: number,
    currency: string,
    walletAddress: string
  ): Promise<DepositTransaction> => {
    await delay(1000);

    const cryptoMethod = mockDepositMethods.find(m => m.id === methodId);
    const fiatMethod = mockFiatDepositMethods.find(m => m.id === methodId);
    const method = cryptoMethod || fiatMethod;

    if (!method) {
      throw new Error('Deposit method not found');
    }

    const fee = method.fee * amount;
    const netAmount = amount - fee;
    const depositAddress = cryptoMethod ? generateDepositAddress(currency) : undefined;

    const transaction: DepositTransaction = {
      id: `dep_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      userId,
      methodId,
      amount,
      currency,
      status: 'pending',
      walletAddress,
      depositAddress,
      fee,
      netAmount,
      createdAt: new Date(),
    };

    // Simulate transaction processing
    setTimeout(() => {
      // In real implementation, this would be handled by webhook or polling
      console.log(`Processing deposit: ${transaction.id}`);
    }, 5000);

    return transaction;
  },

  // Get user deposit transactions
  getUserDeposits: async (userId: string): Promise<DepositTransaction[]> => {
    await delay(600);

    // Mock user deposits
    return [
      {
        id: 'dep_1',
        userId,
        methodId: 'crypto-eth',
        amount: 0.5,
        currency: 'ETH',
        status: 'completed',
        txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        depositAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        fee: 0,
        netAmount: 0.5,
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        completedAt: new Date(Date.now() - 86400000 + 300000), // 5 minutes later
      },
      {
        id: 'dep_2',
        userId,
        methodId: 'crypto-usdc',
        amount: 1000,
        currency: 'USDC',
        status: 'pending',
        walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        depositAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        fee: 0,
        netAmount: 1000,
        createdAt: new Date(),
      },
    ];
  },

  // Get deposit limits
  getDepositLimits: async (userId: string): Promise<DepositLimit> => {
    await delay(300);

    return {
      userId,
      dailyLimit: 10000,
      monthlyLimit: 100000,
      totalLimit: 1000000,
      dailyUsed: 1500,
      monthlyUsed: 15000,
      totalUsed: 50000,
      resetDate: new Date(Date.now() + 86400000), // Tomorrow
    };
  },

  // Get deposit addresses
  getUserDepositAddresses: async (userId: string): Promise<DepositAddress[]> => {
    await delay(400);

    return [
      {
        id: 'addr_1',
        userId,
        currency: 'ETH',
        address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        label: 'Main ETH Address',
        isActive: true,
        createdAt: new Date(Date.now() - 86400000),
        lastUsed: new Date(Date.now() - 3600000),
      },
      {
        id: 'addr_2',
        userId,
        currency: 'USDC',
        address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        label: 'USDC Deposit',
        isActive: true,
        createdAt: new Date(Date.now() - 172800000),
        lastUsed: new Date(Date.now() - 7200000),
      },
    ];
  },

  // Check deposit status
  checkDepositStatus: async (transactionId: string): Promise<DepositTransaction> => {
    await delay(500);

    // Mock status check
    const statuses: Array<'pending' | 'processing' | 'completed' | 'failed'> = ['pending', 'processing', 'completed', 'failed'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      id: transactionId,
      userId: 'user_123',
      methodId: 'crypto-eth',
      amount: 0.5,
      currency: 'ETH',
      status: randomStatus,
      txHash: randomStatus === 'completed' ? '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef' : undefined,
      walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      depositAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      fee: 0,
      netAmount: 0.5,
      createdAt: new Date(Date.now() - 300000),
      completedAt: randomStatus === 'completed' ? new Date() : undefined,
    };
  },

  // Cancel deposit
  cancelDeposit: async (transactionId: string): Promise<boolean> => {
    await delay(800);
    return true;
  },

  // Get deposit statistics
  getDepositStats: async (userId: string): Promise<any> => {
    await delay(600);

    return {
      totalDeposits: 15,
      totalAmount: 25000,
      averageDeposit: 1666.67,
      lastDeposit: new Date(Date.now() - 86400000),
      pendingDeposits: 2,
      completedDeposits: 13,
      failedDeposits: 0,
    };
  },
};

// Real blockchain integration functions (commented out for demo)
/*
export const realDepositService = {
  // These would be the real implementations using blockchain APIs
  
  createDeposit: async (
    userId: string,
    methodId: string,
    amount: number,
    currency: string,
    walletAddress: string
  ): Promise<DepositTransaction> => {
    // Real blockchain integration
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    
    // Generate deposit address
    const depositWallet = ethers.Wallet.createRandom();
    const depositAddress = depositWallet.address;
    
    // Create transaction record
    const transaction: DepositTransaction = {
      id: `dep_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      userId,
      methodId,
      amount,
      currency,
      status: 'pending',
      walletAddress,
      depositAddress,
      fee: 0,
      netAmount: amount,
      createdAt: new Date(),
    };
    
    // Save to database
    await saveDepositTransaction(transaction);
    
    // Set up webhook for deposit confirmation
    await setupDepositWebhook(depositAddress, transaction.id);
    
    return transaction;
  },
  
  // ... other real implementations
};
*/ 