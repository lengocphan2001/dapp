import { ethers } from 'ethers';
import {
  Token,
  Pool,
  SwapQuote,
  SwapParams,
  AddLiquidityParams,
  RemoveLiquidityParams,
  StakingPool,
  YieldFarm,
  StakeParams,
  UnstakeParams,
  ClaimRewardsParams,
  DeFiStats,
} from '../types/defi';

// Mock data for demo purposes
const mockTokens: Token[] = [
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    price: 2500,
    priceChange24h: 2.5,
    marketCap: 300000000000,
    volume24h: 15000000000,
  },
  {
    address: '0xA0b86a33E6441b8C4C8C8C8C8C8C8C8C8C8C8C8',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    price: 1.00,
    priceChange24h: 0.1,
    marketCap: 25000000000,
    volume24h: 5000000000,
  },
  {
    address: '0xB0b86a33E6441b8C4C8C8C8C8C8C8C8C8C8C8C8',
    symbol: 'USDT',
    name: 'Tether',
    decimals: 6,
    logoURI: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    price: 1.00,
    priceChange24h: -0.05,
    marketCap: 80000000000,
    volume24h: 80000000000,
  },
  {
    address: '0xC0b86a33E6441b8C4C8C8C8C8C8C8C8C8C8C8C8',
    symbol: 'DAI',
    name: 'Dai',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
    price: 1.00,
    priceChange24h: 0.02,
    marketCap: 5000000000,
    volume24h: 2000000000,
  },
];

const mockPools: Pool[] = [
  {
    id: '1',
    token0: mockTokens[0], // ETH
    token1: mockTokens[1], // USDC
    reserve0: '1000',
    reserve1: '2500000',
    totalSupply: '50000',
    fee: 0.003,
    apr: 12.5,
    tvl: 5000000,
    volume24h: 250000,
  },
  {
    id: '2',
    token0: mockTokens[0], // ETH
    token1: mockTokens[2], // USDT
    reserve0: '800',
    reserve1: '2000000',
    totalSupply: '40000',
    fee: 0.003,
    apr: 11.8,
    tvl: 4000000,
    volume24h: 180000,
  },
  {
    id: '3',
    token0: mockTokens[1], // USDC
    token1: mockTokens[2], // USDT
    reserve0: '1000000',
    reserve1: '1000000',
    totalSupply: '1000000',
    fee: 0.001,
    apr: 8.2,
    tvl: 2000000,
    volume24h: 500000,
  },
];

const mockStakingPools: StakingPool[] = [
  {
    id: '1',
    token: mockTokens[0],
    totalStaked: '5000',
    totalRewards: '100',
    apr: 15.5,
    lockPeriod: 30,
    minStake: '0.1',
    maxStake: '1000',
  },
  {
    id: '2',
    token: mockTokens[1],
    totalStaked: '1000000',
    totalRewards: '50000',
    apr: 8.2,
    lockPeriod: 7,
    minStake: '100',
    maxStake: '100000',
  },
];

const mockYieldFarms: YieldFarm[] = [
  {
    id: '1',
    name: 'ETH-USDC Farm',
    token: mockTokens[0],
    rewardToken: mockTokens[1],
    totalStaked: '1000',
    totalRewards: '50000',
    apr: 25.5,
    endTime: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
  },
  {
    id: '2',
    name: 'USDC-USDT Farm',
    token: mockTokens[1],
    rewardToken: mockTokens[0],
    totalStaked: '500000',
    totalRewards: '10',
    apr: 18.2,
    endTime: Date.now() + 60 * 24 * 60 * 60 * 1000, // 60 days from now
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const defiService = {
  // Token operations
  getTokens: async (): Promise<Token[]> => {
    await delay(500);
    return mockTokens;
  },

  getTokenPrice: async (tokenAddress: string): Promise<number> => {
    await delay(300);
    const token = mockTokens.find(t => t.address === tokenAddress);
    return token?.price || 0;
  },

  // Pool operations
  getPools: async (): Promise<Pool[]> => {
    await delay(800);
    return mockPools;
  },

  getPool: async (poolId: string): Promise<Pool | null> => {
    await delay(300);
    return mockPools.find(p => p.id === poolId) || null;
  },

  // Swap operations
  getSwapQuote: async (
    inputToken: Token,
    outputToken: Token,
    inputAmount: string
  ): Promise<SwapQuote> => {
    await delay(1000);
    
    const inputPrice = inputToken.price || 0;
    const outputPrice = outputToken.price || 0;
    const inputValue = parseFloat(inputAmount) * inputPrice;
    const outputValue = inputValue * 0.997; // 0.3% fee
    const outputAmount = (outputValue / outputPrice).toString();
    
    return {
      inputToken,
      outputToken,
      inputAmount,
      outputAmount,
      priceImpact: 0.1,
      fee: (parseFloat(inputAmount) * 0.003).toString(),
      route: [inputToken.address, outputToken.address],
      gasEstimate: '150000',
    };
  },

  executeSwap: async (params: SwapParams): Promise<any> => {
    await delay(2000);
    
    // Simulate transaction
    const txHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    return {
      hash: txHash,
      status: 'confirmed',
      gasUsed: '120000',
      gasPrice: '20000000000',
    };
  },

  // Liquidity operations
  addLiquidity: async (params: AddLiquidityParams): Promise<any> => {
    await delay(3000);
    
    const txHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    return {
      hash: txHash,
      status: 'confirmed',
      gasUsed: '250000',
      gasPrice: '20000000000',
    };
  },

  removeLiquidity: async (params: RemoveLiquidityParams): Promise<any> => {
    await delay(3000);
    
    const txHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    return {
      hash: txHash,
      status: 'confirmed',
      gasUsed: '200000',
      gasPrice: '20000000000',
    };
  },

  // Staking operations
  getStakingPools: async (): Promise<StakingPool[]> => {
    await delay(600);
    return mockStakingPools;
  },

  stake: async (params: StakeParams): Promise<any> => {
    await delay(2000);
    
    const txHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    return {
      hash: txHash,
      status: 'confirmed',
      gasUsed: '150000',
      gasPrice: '20000000000',
    };
  },

  unstake: async (params: UnstakeParams): Promise<any> => {
    await delay(2000);
    
    const txHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    return {
      hash: txHash,
      status: 'confirmed',
      gasUsed: '120000',
      gasPrice: '20000000000',
    };
  },

  claimRewards: async (params: ClaimRewardsParams): Promise<any> => {
    await delay(1500);
    
    const txHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    return {
      hash: txHash,
      status: 'confirmed',
      gasUsed: '80000',
      gasPrice: '20000000000',
    };
  },

  // Yield farming operations
  getYieldFarms: async (): Promise<YieldFarm[]> => {
    await delay(600);
    return mockYieldFarms;
  },

  // Analytics and stats
  getDeFiStats: async (): Promise<DeFiStats> => {
    await delay(500);
    
    return {
      totalValueLocked: 15000000,
      totalVolume24h: 2500000,
      totalUsers: 12500,
      totalTransactions: 45000,
      averageAPR: 12.8,
    };
  },

  // User positions
  getUserPositions: async (userAddress: string): Promise<any[]> => {
    await delay(800);
    
    // Mock user positions
    return [
      {
        id: '1',
        pool: mockPools[0],
        liquidity: '1000',
        token0Deposited: '0.5',
        token1Deposited: '1250',
        token0Unclaimed: '0.01',
        token1Unclaimed: '25',
        apr: 12.5,
        value: 2500,
      },
    ];
  },

  getUserStaking: async (userAddress: string): Promise<any[]> => {
    await delay(600);
    
    return mockStakingPools.map(pool => ({
      ...pool,
      userStaked: '100',
      userRewards: '5.5',
      userCanClaim: '2.3',
    }));
  },

  getUserFarms: async (userAddress: string): Promise<any[]> => {
    await delay(600);
    
    return mockYieldFarms.map(farm => ({
      ...farm,
      userStaked: '50',
      userRewards: '12.5',
      userCanClaim: '5.2',
    }));
  },

  // Transaction history
  getTransactionHistory: async (userAddress: string): Promise<any[]> => {
    await delay(1000);
    
    return [
      {
        hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        type: 'swap',
        status: 'confirmed',
        from: userAddress,
        value: '0.1',
        gasUsed: '120000',
        gasPrice: '20000000000',
        timestamp: Date.now() - 3600000,
        blockNumber: 15000000,
        input: 'ETH',
        output: 'USDC',
      },
      {
        hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        type: 'addLiquidity',
        status: 'confirmed',
        from: userAddress,
        value: '0.5',
        gasUsed: '250000',
        gasPrice: '20000000000',
        timestamp: Date.now() - 7200000,
        blockNumber: 14999999,
        input: 'ETH-USDC LP',
      },
    ];
  },
};

// Real blockchain integration functions (commented out for demo)
/*
export const realDefiService = {
  // These would be the real implementations using ethers.js and smart contracts
  
  executeSwap: async (params: SwapParams, signer: ethers.Signer): Promise<any> => {
    const routerContract = new ethers.Contract(
      ROUTER_ADDRESS,
      ROUTER_ABI,
      signer
    );
    
    const tx = await routerContract.swapExactTokensForTokens(
      params.inputAmount,
      params.outputAmount,
      params.route,
      params.recipient,
      params.deadline
    );
    
    return await tx.wait();
  },
  
  addLiquidity: async (params: AddLiquidityParams, signer: ethers.Signer): Promise<any> => {
    const routerContract = new ethers.Contract(
      ROUTER_ADDRESS,
      ROUTER_ABI,
      signer
    );
    
    const tx = await routerContract.addLiquidity(
      params.token0.address,
      params.token1.address,
      params.amount0Desired,
      params.amount1Desired,
      params.amount0Min,
      params.amount1Min,
      params.recipient,
      params.deadline
    );
    
    return await tx.wait();
  },
  
  // ... other real implementations
};
*/ 