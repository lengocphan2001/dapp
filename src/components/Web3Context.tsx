import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { WalletInfo } from '../types/defi';

interface Web3State {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  walletInfo: WalletInfo | null;
}

interface Web3ContextType extends Web3State {
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  getBalance: () => Promise<string>;
  getTokenBalance: (tokenAddress: string) => Promise<string>;
  sendTransaction: (transaction: any) => Promise<any>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

type Web3Action =
  | { type: 'SET_PROVIDER'; payload: ethers.BrowserProvider }
  | { type: 'SET_SIGNER'; payload: ethers.JsonRpcSigner }
  | { type: 'SET_ACCOUNT'; payload: string }
  | { type: 'SET_CHAIN_ID'; payload: number }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_CONNECTING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_WALLET_INFO'; payload: WalletInfo }
  | { type: 'DISCONNECT' };

const web3Reducer = (state: Web3State, action: Web3Action): Web3State => {
  switch (action.type) {
    case 'SET_PROVIDER':
      return { ...state, provider: action.payload };
    case 'SET_SIGNER':
      return { ...state, signer: action.payload };
    case 'SET_ACCOUNT':
      return { ...state, account: action.payload };
    case 'SET_CHAIN_ID':
      return { ...state, chainId: action.payload };
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'SET_CONNECTING':
      return { ...state, isConnecting: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_WALLET_INFO':
      return { ...state, walletInfo: action.payload };
    case 'DISCONNECT':
      return {
        ...state,
        provider: null,
        signer: null,
        account: null,
        chainId: null,
        isConnected: false,
        walletInfo: null,
        error: null,
      };
    default:
      return state;
  }
};

const initialState: Web3State = {
  provider: null,
  signer: null,
  account: null,
  chainId: null,
  isConnected: false,
  isConnecting: false,
  error: null,
  walletInfo: null,
};

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(web3Reducer, initialState);

  const connect = async () => {
    dispatch({ type: 'SET_CONNECTING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to use this app.');
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];

      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(account);

      dispatch({ type: 'SET_PROVIDER', payload: provider });
      dispatch({ type: 'SET_SIGNER', payload: signer });
      dispatch({ type: 'SET_ACCOUNT', payload: account });
      dispatch({ type: 'SET_CHAIN_ID', payload: Number(network.chainId) });
      dispatch({ type: 'SET_CONNECTED', payload: true });

      // Set up wallet info
      const walletInfo: WalletInfo = {
        address: account,
        balance: ethers.formatEther(balance),
        chainId: Number(network.chainId),
        network: network.name,
        isConnected: true,
        tokens: [],
      };

      dispatch({ type: 'SET_WALLET_INFO', payload: walletInfo });

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          dispatch({ type: 'SET_ACCOUNT', payload: accounts[0] });
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', (chainId: string) => {
        dispatch({ type: 'SET_CHAIN_ID', payload: Number(chainId) });
      });

    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_CONNECTING', payload: false });
    }
  };

  const disconnect = () => {
    dispatch({ type: 'DISCONNECT' });
  };

  const switchNetwork = async (chainId: number) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added, add it
        const chainConfig = getChainConfig(chainId);
        if (chainConfig) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [chainConfig],
          });
        }
      }
    }
  };

  const getBalance = async (): Promise<string> => {
    if (!state.provider || !state.account) return '0';
    
    const balance = await state.provider.getBalance(state.account);
    return ethers.formatEther(balance);
  };

  const getTokenBalance = async (tokenAddress: string): Promise<string> => {
    if (!state.provider || !state.account) return '0';

    const tokenContract = new ethers.Contract(
      tokenAddress,
      ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'],
      state.provider
    );

    const [balance, decimals] = await Promise.all([
      tokenContract.balanceOf(state.account),
      tokenContract.decimals(),
    ]);

    return ethers.formatUnits(balance, decimals);
  };

  const sendTransaction = async (transaction: any) => {
    if (!state.signer) throw new Error('No signer available');

    const tx = await state.signer.sendTransaction(transaction);
    return await tx.wait();
  };

  const getChainConfig = (chainId: number) => {
    const configs: { [key: number]: any } = {
      56: {
        chainId: '0x38',
        chainName: 'Binance Smart Chain',
        nativeCurrency: {
          name: 'BNB',
          symbol: 'BNB',
          decimals: 18,
        },
        rpcUrls: ['https://bsc-dataseed.binance.org'],
        blockExplorerUrls: ['https://bscscan.com'],
      },
      137: {
        chainId: '0x89',
        chainName: 'Polygon',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        },
        rpcUrls: ['https://polygon-rpc.com'],
        blockExplorerUrls: ['https://polygonscan.com'],
      },
    };

    return configs[chainId];
  };

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          
          if (accounts.length > 0) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const network = await provider.getNetwork();
            const balance = await provider.getBalance(accounts[0]);

            dispatch({ type: 'SET_PROVIDER', payload: provider });
            dispatch({ type: 'SET_SIGNER', payload: signer });
            dispatch({ type: 'SET_ACCOUNT', payload: accounts[0] });
            dispatch({ type: 'SET_CHAIN_ID', payload: Number(network.chainId) });
            dispatch({ type: 'SET_CONNECTED', payload: true });

            const walletInfo: WalletInfo = {
              address: accounts[0],
              balance: ethers.formatEther(balance),
              chainId: Number(network.chainId),
              network: network.name,
              isConnected: true,
              tokens: [],
            };

            dispatch({ type: 'SET_WALLET_INFO', payload: walletInfo });
          }
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    };

    checkConnection();
  }, []);

  const value: Web3ContextType = {
    ...state,
    connect,
    disconnect,
    switchNetwork,
    getBalance,
    getTokenBalance,
    sendTransaction,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
} 