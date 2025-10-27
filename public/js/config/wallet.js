// Wallet configuration for BSC chain
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";

// BSC Mainnet configuration
const bscMainnet = defineChain({
  id: 56,
  name: 'BNB Smart Chain',
  network: 'bsc',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://bsc-dataseed1.binance.org'],
    },
    public: {
      http: ['https://bsc-dataseed1.binance.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BscScan',
      url: 'https://bscscan.com',
    },
  },
});

// BSC Testnet configuration (for development)
const bscTestnet = defineChain({
  id: 97,
  name: 'BNB Smart Chain Testnet',
  network: 'bsc-testnet',
  nativeCurrency: {
    name: 'tBNB',
    symbol: 'tBNB',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    },
    public: {
      http: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BscScan Testnet',
      url: 'https://testnet.bscscan.com',
    },
  },
});

// Wagmi configuration
export const config = getDefaultConfig({
  appName: 'StarYield Finance',
  projectId: '6315b8b1e9c248cd7ecdf86cee204f69',
  chains: [bscMainnet, bscTestnet],
  ssr: false, // Since we're using vanilla JS, not Next.js
});

// Export chains for reference
export { bscMainnet, bscTestnet };