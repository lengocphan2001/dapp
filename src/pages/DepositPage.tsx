import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { useWeb3 } from '../components/Web3Context';
import { depositService } from '../services/depositService';
import {
  DepositMethod,
  DepositTransaction,
  DepositQuote,
  FiatDepositMethod,
  DepositLimit,
} from '../types/deposit';
import './DepositPage.css';

const DepositPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { account, isConnected } = useWeb3();

  const [depositMethods, setDepositMethods] = useState<DepositMethod[]>([]);
  const [fiatMethods, setFiatMethods] = useState<FiatDepositMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<DepositMethod | FiatDepositMethod | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD');
  const [quote, setQuote] = useState<DepositQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deposits, setDeposits] = useState<DepositTransaction[]>([]);
  const [limits, setLimits] = useState<DepositLimit | null>(null);
  const [activeTab, setActiveTab] = useState<'deposit' | 'history' | 'addresses'>('deposit');

  useEffect(() => {
    loadDepositData();
  }, []);

  const loadDepositData = async () => {
    try {
      const [methods, fiatMethods, userDeposits, userLimits] = await Promise.all([
        depositService.getDepositMethods(),
        depositService.getFiatDepositMethods(),
        depositService.getUserDeposits(user?.id || ''),
        depositService.getDepositLimits(user?.id || ''),
      ]);

      setDepositMethods(methods);
      setFiatMethods(fiatMethods);
      setDeposits(userDeposits);
      setLimits(userLimits);
    } catch (error) {
      console.error('Error loading deposit data:', error);
    }
  };

  const handleMethodSelect = (method: DepositMethod | FiatDepositMethod) => {
    setSelectedMethod(method);
    setQuote(null);
  };

  const handleAmountChange = async (value: string) => {
    setAmount(value);
    
    if (value && selectedMethod && parseFloat(value) > 0) {
      try {
        const depositQuote = await depositService.getDepositQuote(
          selectedMethod.id,
          parseFloat(value),
          currency
        );
        setQuote(depositQuote);
      } catch (error) {
        console.error('Error getting quote:', error);
      }
    } else {
      setQuote(null);
    }
  };

  const handleDeposit = async () => {
    if (!selectedMethod || !amount || !user || !account) return;

    setIsLoading(true);
    try {
      const transaction = await depositService.createDeposit(
        user.id,
        selectedMethod.id,
        parseFloat(amount),
        currency,
        account
      );

      // Add to deposits list
      setDeposits(prev => [transaction, ...prev]);
      
      // Reset form
      setAmount('');
      setQuote(null);
      setSelectedMethod(null);

      // Show success message
      alert(`Deposit created successfully! Transaction ID: ${transaction.id}`);
    } catch (error) {
      console.error('Error creating deposit:', error);
      alert('Error creating deposit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`;
    return `$${num.toFixed(decimals)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#00d4aa';
      case 'pending': return '#ffa500';
      case 'processing': return '#667eea';
      case 'failed': return '#ff6b6b';
      default: return '#999';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Address copied to clipboard!');
  };

  return (
    <div className="deposit-container">
      <header className="deposit-header">
        <div className="header-content">
          <div className="header-left">
            <button className="back-button" onClick={() => navigate('/defi')}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              Back to DeFi
            </button>
            <h1>Deposit Funds</h1>
          </div>
          
          <div className="header-right">
            {isConnected ? (
              <div className="wallet-info">
                <span className="wallet-address">
                  {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}
                </span>
              </div>
            ) : (
              <button className="connect-wallet-button" onClick={() => navigate('/defi')}>
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="deposit-main">
        {/* Deposit Limits */}
        {limits && (
          <div className="limits-card">
            <h3>Deposit Limits</h3>
            <div className="limits-grid">
              <div className="limit-item">
                <span>Daily Limit</span>
                <span>{formatNumber(limits.dailyLimit)}</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(limits.dailyUsed / limits.dailyLimit) * 100}%` }}
                  ></div>
                </div>
                <span className="used-amount">Used: {formatNumber(limits.dailyUsed)}</span>
              </div>
              <div className="limit-item">
                <span>Monthly Limit</span>
                <span>{formatNumber(limits.monthlyLimit)}</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(limits.monthlyUsed / limits.monthlyLimit) * 100}%` }}
                  ></div>
                </div>
                <span className="used-amount">Used: {formatNumber(limits.monthlyUsed)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="deposit-tabs">
          <button 
            className={`tab-button ${activeTab === 'deposit' ? 'active' : ''}`}
            onClick={() => setActiveTab('deposit')}
          >
            Deposit
          </button>
          <button 
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
          <button 
            className={`tab-button ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            Addresses
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'deposit' && (
            <div className="deposit-content">
              {/* Deposit Methods */}
              <div className="methods-section">
                <h2>Crypto Deposits</h2>
                <div className="methods-grid">
                  {depositMethods.map((method) => (
                    <div 
                      key={method.id}
                      className={`method-card ${selectedMethod?.id === method.id ? 'selected' : ''}`}
                      onClick={() => handleMethodSelect(method)}
                    >
                      <img src={method.icon} alt={method.name} className="method-icon" />
                      <div className="method-info">
                        <h3>{method.name}</h3>
                        <p>{method.description}</p>
                        <div className="method-details">
                          <span>Min: {method.minAmount}</span>
                          <span>Max: {method.maxAmount}</span>
                          <span>Fee: {method.fee === 0 ? 'Free' : `${(method.fee * 100).toFixed(2)}%`}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <h2>Fiat Deposits</h2>
                <div className="methods-grid">
                  {fiatMethods.map((method) => (
                    <div 
                      key={method.id}
                      className={`method-card ${selectedMethod?.id === method.id ? 'selected' : ''}`}
                      onClick={() => handleMethodSelect(method)}
                    >
                      <div className="method-icon fiat-icon">
                        {method.provider === 'stripe' && '💳'}
                        {method.provider === 'paypal' && '📱'}
                        {method.provider === 'bank' && '🏦'}
                      </div>
                      <div className="method-info">
                        <h3>{method.name}</h3>
                        <p>Supported: {method.supportedCurrencies.join(', ')}</p>
                        <div className="method-details">
                          <span>Min: ${method.minAmount}</span>
                          <span>Max: ${method.maxAmount}</span>
                          <span>Fee: {method.fee === 0 ? 'Free' : `${(method.fee * 100).toFixed(2)}%`}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deposit Form */}
              {selectedMethod && (
                <div className="deposit-form">
                  <h2>Deposit {selectedMethod.name}</h2>
                  
                  <div className="form-group">
                    <label>Amount</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      placeholder="Enter amount"
                      min={selectedMethod.minAmount}
                      max={selectedMethod.maxAmount}
                    />
                    <span className="amount-limits">
                      Min: {selectedMethod.minAmount} | Max: {selectedMethod.maxAmount}
                    </span>
                  </div>

                  {quote && (
                    <div className="quote-card">
                      <h3>Deposit Quote</h3>
                      <div className="quote-details">
                        <div className="quote-row">
                          <span>Amount:</span>
                          <span>{quote.amount} {quote.currency}</span>
                        </div>
                        <div className="quote-row">
                          <span>Fee:</span>
                          <span>{quote.fee} {quote.currency}</span>
                        </div>
                        <div className="quote-row total">
                          <span>You'll Receive:</span>
                          <span>{quote.netAmount} {quote.currency}</span>
                        </div>
                        <div className="quote-row">
                          <span>Processing Time:</span>
                          <span>{quote.estimatedTime}</span>
                        </div>
                      </div>

                      {quote.depositAddress && (
                        <div className="deposit-address">
                          <h4>Send to this address:</h4>
                          <div className="address-container">
                            <input
                              type="text"
                              value={quote.depositAddress}
                              readOnly
                              className="address-input"
                            />
                            <button 
                              className="copy-button"
                              onClick={() => copyToClipboard(quote.depositAddress!)}
                            >
                              Copy
                            </button>
                          </div>
                          {quote.qrCode && (
                            <div className="qr-code">
                              <img src={quote.qrCode} alt="QR Code" />
                            </div>
                          )}
                        </div>
                      )}

                      <button 
                        className="deposit-button"
                        onClick={handleDeposit}
                        disabled={isLoading || !isConnected}
                      >
                        {isLoading ? 'Processing...' : 'Create Deposit'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-content">
              <h2>Deposit History</h2>
              <div className="deposits-table">
                <div className="table-header">
                  <span>Date</span>
                  <span>Method</span>
                  <span>Amount</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>
                {deposits.map((deposit) => (
                  <div key={deposit.id} className="deposit-row">
                    <span>{new Date(deposit.createdAt).toLocaleDateString()}</span>
                    <span>{deposit.methodId}</span>
                    <span>{deposit.amount} {deposit.currency}</span>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(deposit.status) }}
                    >
                      {deposit.status}
                    </span>
                    <div className="actions">
                      {deposit.txHash && (
                        <button 
                          className="action-button"
                          onClick={() => window.open(`https://etherscan.io/tx/${deposit.txHash}`, '_blank')}
                        >
                          View
                        </button>
                      )}
                      {deposit.status === 'pending' && (
                        <button className="action-button">Cancel</button>
                      )}
                    </div>
                  </div>
                ))}
                {deposits.length === 0 && (
                  <div className="empty-state">
                    <p>No deposits yet. Start by making your first deposit!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="addresses-content">
              <h2>Your Deposit Addresses</h2>
              <div className="addresses-grid">
                <div className="address-card">
                  <div className="address-header">
                    <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH" className="token-icon" />
                    <div>
                      <h3>Ethereum (ETH)</h3>
                      <p>Main ETH Address</p>
                    </div>
                  </div>
                  <div className="address-container">
                    <input
                      type="text"
                      value="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
                      readOnly
                      className="address-input"
                    />
                    <button 
                      className="copy-button"
                      onClick={() => copyToClipboard('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6')}
                    >
                      Copy
                    </button>
                  </div>
                  <div className="qr-code">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6" 
                      alt="QR Code" 
                    />
                  </div>
                </div>

                <div className="address-card">
                  <div className="address-header">
                    <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" alt="USDC" className="token-icon" />
                    <div>
                      <h3>USD Coin (USDC)</h3>
                      <p>USDC Deposit Address</p>
                    </div>
                  </div>
                  <div className="address-container">
                    <input
                      type="text"
                      value="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
                      readOnly
                      className="address-input"
                    />
                    <button 
                      className="copy-button"
                      onClick={() => copyToClipboard('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6')}
                    >
                      Copy
                    </button>
                  </div>
                  <div className="qr-code">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6" 
                      alt="QR Code" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DepositPage; 