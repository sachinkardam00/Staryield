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