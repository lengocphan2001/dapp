export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  price?: number;
  priceChange24h?: number;
  marketCap?: number;
  volume24h?: number;
}

export interface Pool {
  id: string;
  token0: Token;
  token1: Token;
  reserve0: string;
  reserve1: string;
  totalSupply: string;
  fee: number;
  apr: number;
  tvl: number;
  volume24h: number;
}

export interface UserPosition {
  id: string;
  pool: Pool;
  liquidity: string;
  token0Deposited: string;
  token1Deposited: string;
  token0Unclaimed: string;
  token1Unclaimed: string;
  apr: number;
  value: number;
}

export interface SwapQuote {
  inputToken: Token;
  outputToken: Token;
  inputAmount: string;
  outputAmount: string;
  priceImpact: number;
  fee: string;
  route: string[];
  gasEstimate: string;
}

export interface Transaction {
  hash: string;
  type: 'swap' | 'addLiquidity' | 'removeLiquidity' | 'stake' | 'unstake' | 'claim';
  status: 'pending' | 'confirmed' | 'failed';
  from: string;
  to?: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  timestamp: number;
  blockNumber: number;
  input: string;
  output?: string;
}

export interface StakingPool {
  id: string;
  token: Token;
  totalStaked: string;
  totalRewards: string;
  apr: number;
  lockPeriod: number;
  minStake: string;
  maxStake: string;
  userStaked?: string;
  userRewards?: string;
  userCanClaim?: string;
}

export interface YieldFarm {
  id: string;
  name: string;
  token: Token;
  rewardToken: Token;
  totalStaked: string;
  totalRewards: string;
  apr: number;
  endTime: number;
  userStaked?: string;
  userRewards?: string;
  userCanClaim?: string;
}

export interface WalletInfo {
  address: string;
  balance: string;
  chainId: number;
  network: string;
  isConnected: boolean;
  tokens: Token[];
}

export interface DeFiStats {
  totalValueLocked: number;
  totalVolume24h: number;
  totalUsers: number;
  totalTransactions: number;
  averageAPR: number;
}

export interface DeFiUser {
  id: string;
  telegramId: number;
  walletAddress: string;
  totalValueLocked: number;
  totalEarnings: number;
  totalTransactions: number;
  positions: UserPosition[];
  stakingPools: StakingPool[];
  yieldFarms: YieldFarm[];
  transactions: Transaction[];
  createdAt: Date;
  lastActive: Date;
}

export interface DeFiConfig {
  supportedNetworks: {
    chainId: number;
    name: string;
    rpcUrl: string;
    explorerUrl: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
  }[];
  defaultTokens: Token[];
  defaultPools: Pool[];
  stakingPools: StakingPool[];
  yieldFarms: YieldFarm[];
}

export interface SwapParams {
  inputToken: Token;
  outputToken: Token;
  inputAmount: string;
  slippageTolerance: number;
  deadline: number;
  recipient: string;
}

export interface AddLiquidityParams {
  token0: Token;
  token1: Token;
  amount0Desired: string;
  amount1Desired: string;
  amount0Min: string;
  amount1Min: string;
  deadline: number;
  recipient: string;
}

export interface RemoveLiquidityParams {
  poolId: string;
  liquidity: string;
  amount0Min: string;
  amount1Min: string;
  deadline: number;
  recipient: string;
}

export interface StakeParams {
  poolId: string;
  amount: string;
  lockPeriod?: number;
}

export interface UnstakeParams {
  poolId: string;
  amount: string;
}

export interface ClaimRewardsParams {
  poolId: string;
  farmId?: string;
} 