import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { useWeb3 } from '../components/Web3Context';
import { defiService } from '../services/defiService';
import { Token, Pool, DeFiStats, StakingPool, YieldFarm } from '../types/defi';
import './DeFiDashboardPage.css';

const DeFiDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { 
    isConnected, 
    isConnecting, 
    connect, 
    disconnect, 
    account, 
    walletInfo,
    chainId 
  } = useWeb3();

  const [tokens, setTokens] = useState<Token[]>([]);
  const [pools, setPools] = useState<Pool[]>([]);
  const [stakingPools, setStakingPools] = useState<StakingPool[]>([]);
  const [yieldFarms, setYieldFarms] = useState<YieldFarm[]>([]);
  const [stats, setStats] = useState<DeFiStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'swap' | 'pools' | 'staking' | 'farms'>('overview');

  useEffect(() => {
    loadDeFiData();
  }, []);

  const loadDeFiData = async () => {
    setIsLoading(true);
    try {
      const [tokensData, poolsData, stakingData, farmsData, statsData] = await Promise.all([
        defiService.getTokens(),
        defiService.getPools(),
        defiService.getStakingPools(),
        defiService.getYieldFarms(),
        defiService.getDeFiStats(),
      ]);

      setTokens(tokensData);
      setPools(poolsData);
      setStakingPools(stakingData);
      setYieldFarms(farmsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading DeFi data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`;
    return `$${num.toFixed(decimals)}`;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = (chainId: number | null) => {
    switch (chainId) {
      case 1: return 'Ethereum';
      case 56: return 'BSC';
      case 137: return 'Polygon';
      default: return 'Unknown';
    }
  };

  if (isLoading) {
    return (
      <div className="defi-dashboard-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading DeFi data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="defi-dashboard-container">
      <header className="defi-header">
        <div className="header-content">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate('/dashboard')}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              Back to Dashboard
            </button>
            <h1>DeFi Dashboard</h1>
          </div>
          
          <div className="header-right">
            {isConnected ? (
              <div className="wallet-info">
                <div className="network-badge">
                  {getNetworkName(chainId)}
                </div>
                <div className="account-info">
                  <span className="account-address">{formatAddress(account || '')}</span>
                  <span className="account-balance">
                    {walletInfo?.balance ? `${parseFloat(walletInfo.balance).toFixed(4)} ETH` : '0 ETH'}
                  </span>
                </div>
                <button className="disconnect-button" onClick={disconnect}>
                  Disconnect
                </button>
              </div>
            ) : (
              <button 
                className="connect-button" 
                onClick={connect}
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
            
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="defi-main">
        {/* Stats Overview */}
        {stats && (
          <div className="stats-overview">
            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="stat-content">
                <h3>Total Value Locked</h3>
                <p className="stat-value">{formatNumber(stats.totalValueLocked)}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <div className="stat-content">
                <h3>24h Volume</h3>
                <p className="stat-value">{formatNumber(stats.totalVolume24h)}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
              </div>
              <div className="stat-content">
                <h3>Total Users</h3>
                <p className="stat-value">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="stat-content">
                <h3>Average APR</h3>
                <p className="stat-value">{stats.averageAPR.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="defi-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'swap' ? 'active' : ''}`}
            onClick={() => setActiveTab('swap')}
          >
            Swap
          </button>
          <button 
            className={`tab-button ${activeTab === 'pools' ? 'active' : ''}`}
            onClick={() => setActiveTab('pools')}
          >
            Liquidity Pools
          </button>
          <button 
            className={`tab-button ${activeTab === 'staking' ? 'active' : ''}`}
            onClick={() => setActiveTab('staking')}
          >
            Staking
          </button>
          <button 
            className={`tab-button ${activeTab === 'farms' ? 'active' : ''}`}
            onClick={() => setActiveTab('farms')}
          >
            Yield Farms
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-content">
              <div className="section">
                <h2>Top Tokens</h2>
                <div className="tokens-grid">
                  {tokens.slice(0, 4).map((token) => (
                    <div key={token.address} className="token-card">
                      <div className="token-info">
                        <img src={token.logoURI} alt={token.symbol} className="token-logo" />
                        <div>
                          <h3>{token.symbol}</h3>
                          <p>{token.name}</p>
                        </div>
                      </div>
                      <div className="token-price">
                        <p className="price">${token.price?.toFixed(2)}</p>
                        <p className={`change ${(token.priceChange24h || 0) >= 0 ? 'positive' : 'negative'}`}>
                          {(token.priceChange24h || 0) >= 0 ? '+' : ''}{token.priceChange24h?.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="section">
                <h2>Top Pools</h2>
                <div className="pools-grid">
                  {pools.slice(0, 3).map((pool) => (
                    <div key={pool.id} className="pool-card">
                      <div className="pool-tokens">
                        <img src={pool.token0.logoURI} alt={pool.token0.symbol} className="token-logo" />
                        <img src={pool.token1.logoURI} alt={pool.token1.symbol} className="token-logo" />
                        <span>{pool.token0.symbol}-{pool.token1.symbol}</span>
                      </div>
                      <div className="pool-stats">
                        <div className="stat">
                          <span>TVL</span>
                          <span>{formatNumber(pool.tvl)}</span>
                        </div>
                        <div className="stat">
                          <span>APR</span>
                          <span>{pool.apr.toFixed(1)}%</span>
                        </div>
                        <div className="stat">
                          <span>24h Vol</span>
                          <span>{formatNumber(pool.volume24h)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'swap' && (
            <div className="swap-content">
              <div className="swap-card">
                <h2>Swap Tokens</h2>
                <p className="swap-notice">
                  {isConnected 
                    ? 'Connect your wallet to start swapping tokens'
                    : 'Please connect your wallet to use the swap feature'
                  }
                </p>
                {!isConnected && (
                  <button className="connect-wallet-button" onClick={connect}>
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'pools' && (
            <div className="pools-content">
              <div className="pools-header">
                <h2>Liquidity Pools</h2>
                <button className="add-liquidity-button">
                  Add Liquidity
                </button>
              </div>
              <div className="pools-table">
                <div className="table-header">
                  <span>Pool</span>
                  <span>TVL</span>
                  <span>APR</span>
                  <span>24h Volume</span>
                  <span>Actions</span>
                </div>
                {pools.map((pool) => (
                  <div key={pool.id} className="pool-row">
                    <div className="pool-info">
                      <div className="pool-tokens">
                        <img src={pool.token0.logoURI} alt={pool.token0.symbol} className="token-logo" />
                        <img src={pool.token1.logoURI} alt={pool.token1.symbol} className="token-logo" />
                      </div>
                      <span>{pool.token0.symbol}-{pool.token1.symbol}</span>
                    </div>
                    <span>{formatNumber(pool.tvl)}</span>
                    <span>{pool.apr.toFixed(1)}%</span>
                    <span>{formatNumber(pool.volume24h)}</span>
                    <div className="pool-actions">
                      <button className="action-button">Add</button>
                      <button className="action-button">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'staking' && (
            <div className="staking-content">
              <div className="staking-header">
                <h2>Staking Pools</h2>
              </div>
              <div className="staking-grid">
                {stakingPools.map((pool) => (
                  <div key={pool.id} className="staking-card">
                    <div className="staking-token">
                      <img src={pool.token.logoURI} alt={pool.token.symbol} className="token-logo" />
                      <div>
                        <h3>{pool.token.symbol} Staking</h3>
                        <p>Lock: {pool.lockPeriod} days</p>
                      </div>
                    </div>
                    <div className="staking-stats">
                      <div className="stat">
                        <span>APR</span>
                        <span className="apr">{pool.apr.toFixed(1)}%</span>
                      </div>
                      <div className="stat">
                        <span>Total Staked</span>
                        <span>{pool.totalStaked}</span>
                      </div>
                    </div>
                    <button className="stake-button">
                      Stake {pool.token.symbol}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'farms' && (
            <div className="farms-content">
              <div className="farms-header">
                <h2>Yield Farms</h2>
              </div>
              <div className="farms-grid">
                {yieldFarms.map((farm) => (
                  <div key={farm.id} className="farm-card">
                    <div className="farm-header">
                      <h3>{farm.name}</h3>
                      <span className="farm-apr">{farm.apr.toFixed(1)}% APR</span>
                    </div>
                    <div className="farm-tokens">
                      <div className="token">
                        <img src={farm.token.logoURI} alt={farm.token.symbol} className="token-logo" />
                        <span>{farm.token.symbol}</span>
                      </div>
                      <div className="reward-token">
                        <img src={farm.rewardToken.logoURI} alt={farm.rewardToken.symbol} className="token-logo" />
                        <span>{farm.rewardToken.symbol}</span>
                      </div>
                    </div>
                    <div className="farm-stats">
                      <div className="stat">
                        <span>Total Staked</span>
                        <span>{farm.totalStaked}</span>
                      </div>
                      <div className="stat">
                        <span>Rewards</span>
                        <span>{farm.totalRewards}</span>
                      </div>
                    </div>
                    <button className="farm-button">
                      Start Farming
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DeFiDashboardPage; 