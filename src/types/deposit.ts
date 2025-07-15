export interface DepositMethod {
  id: string;
  name: string;
  type: 'crypto' | 'fiat' | 'card';
  icon: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  fee: number;
  processingTime: string;
  isActive: boolean;
  supportedTokens?: string[];
}

export interface DepositTransaction {
  id: string;
  userId: string;
  methodId: string;
  amount: number;
  currency: string;
  tokenAddress?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  txHash?: string;
  walletAddress: string;
  depositAddress?: string;
  fee: number;
  netAmount: number;
  createdAt: Date;
  completedAt?: Date;
  notes?: string;
}

export interface DepositAddress {
  id: string;
  userId: string;
  currency: string;
  address: string;
  label?: string;
  isActive: boolean;
  createdAt: Date;
  lastUsed?: Date;
}

export interface DepositLimit {
  userId: string;
  dailyLimit: number;
  monthlyLimit: number;
  totalLimit: number;
  dailyUsed: number;
  monthlyUsed: number;
  totalUsed: number;
  resetDate: Date;
}

export interface FiatDepositMethod {
  id: string;
  name: string;
  provider: 'stripe' | 'paypal' | 'bank' | 'crypto';
  supportedCurrencies: string[];
  minAmount: number;
  maxAmount: number;
  fee: number;
  processingTime: string;
  isActive: boolean;
}

export interface DepositQuote {
  methodId: string;
  amount: number;
  currency: string;
  fee: number;
  netAmount: number;
  exchangeRate?: number;
  estimatedTime: string;
  depositAddress?: string;
  qrCode?: string;
}

export interface DepositSettings {
  enabled: boolean;
  requireKYC: boolean;
  minDepositAmount: number;
  maxDepositAmount: number;
  supportedCurrencies: string[];
  supportedTokens: string[];
  autoApprove: boolean;
  requireConfirmation: boolean;
} 