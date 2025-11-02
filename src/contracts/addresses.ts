import { bscMainnet, bscTestnet } from '@/lib/wagmi';

type AddressMap = Record<number, `0x${string}`>;

export const TOKEN_ADDRESSES: { stakingToken: AddressMap } = {
  stakingToken: {
    [bscMainnet.id]: '0x0000000000000000000000000000000000000000', // Replace with your mainnet token address
    [bscTestnet.id]: '0x0000000000000000000000000000000000000000', // Replace with your testnet token address
  },
};

export const STAKING_ADDRESSES: AddressMap = {
  [bscMainnet.id]: '0x0000000000000000000000000000000000000000', // Replace with your mainnet staking contract
  [bscTestnet.id]: '0x0000000000000000000000000000000000000000', // Replace with your testnet staking contract
};

// Helper function to get addresses for current chain
export function getTokenAddress(chainId: number) {
  return TOKEN_ADDRESSES.stakingToken[chainId];
}

export function getStakingAddress(chainId: number) {
  return STAKING_ADDRESSES[chainId];
}

// Router/Adapter addresses via env (preferred for deployment)
export function getRouterAddress(): `0x${string}` | undefined {
  const addr = process.env.NEXT_PUBLIC_ROUTER_ADDRESS as `0x${string}` | undefined;
  return addr && addr !== '0x0000000000000000000000000000000000000000' ? addr : undefined;
}

export function getAdapterAddress(): `0x${string}` | undefined {
  const addr = process.env.NEXT_PUBLIC_ADAPTER_ADDRESS as `0x${string}` | undefined;
  return addr && addr !== '0x0000000000000000000000000000000000000000' ? addr : undefined;
}

export function getReferralAddress(): `0x${string}` | undefined {
  const addr = process.env.NEXT_PUBLIC_REFERRAL_ADDRESS as `0x${string}` | undefined;
  return addr && addr !== '0x0000000000000000000000000000000000000000' ? addr : undefined;
}

export function getLoyaltyAddress(): `0x${string}` | undefined {
  const addr = process.env.NEXT_PUBLIC_LOYALTY_ADDRESS as `0x${string}` | undefined;
  return addr && addr !== '0x0000000000000000000000000000000000000000' ? addr : undefined;
}

// Common token addresses used for integrations
export const COMMON_TOKENS: Record<string, AddressMap> = {
  // Wrapped BNB (WBNB)
  WBNB: {
    [bscMainnet.id]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    [bscTestnet.id]: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
  },
};

export function getWBNBAddress(chainId: number): `0x${string}` | undefined {
  return COMMON_TOKENS.WBNB[chainId];
}

export function getCommonTokenAddress(chainId: number, symbol: string): `0x${string}` | undefined {
  const key = symbol.toUpperCase();
  if (key === 'BNB') return getWBNBAddress(chainId);
  if (COMMON_TOKENS[key]) return COMMON_TOKENS[key][chainId];
  return undefined;
}