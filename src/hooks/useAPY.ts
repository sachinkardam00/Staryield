'use client';

import { useQuery } from '@tanstack/react-query';
import { useChainId } from 'wagmi';
import { pancakeSwapService, APYData } from '@/services/pancakeswap';
import { getTokenAddress, getCommonTokenAddress } from '@/contracts/addresses';

interface UseAPYOptions {
  tokenSymbol?: string;
  refetchInterval?: number;
  enabled?: boolean;
  tokenAddress?: `0x${string}` | string;
}

export function useAPY(options: UseAPYOptions = {}) {
  const {
    tokenSymbol = 'STAR',
    refetchInterval = 25000, // Refetch every 25 seconds as requested
    enabled = true,
    tokenAddress: overrideTokenAddress,
  } = options;

  const chainIdFromHook = useChainId();
  const chainId = chainIdFromHook || 56; // default to BSC mainnet if unavailable
  // Resolve token address: explicit override -> common token map (e.g., BNB->WBNB) -> staking token
  const resolvedCommon = getCommonTokenAddress(chainId, tokenSymbol);
  const tokenAddress = (overrideTokenAddress as `0x${string}` | undefined) || resolvedCommon || getTokenAddress(chainId);

  return useQuery<APYData, Error>({
  queryKey: ['apy', tokenAddress, tokenSymbol, chainId],
    queryFn: async () => {
      if (!tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000') {
        // Return mock data if no real token address is configured
        return pancakeSwapService.getMockStakingAPY(tokenSymbol);
      }
      
      return await pancakeSwapService.getTokenAPY(tokenAddress, tokenSymbol);
    },
    enabled,
    refetchInterval,
    staleTime: 20000, // Consider data stale after 20 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook for multiple tokens APY
export function useMultipleAPY(tokens: Array<{ address: string; symbol: string }>) {
  return useQuery<Record<string, APYData>, Error>({
    queryKey: ['multiple-apy', tokens],
    queryFn: async () => {
      const results: Record<string, APYData> = {};
      
      await Promise.all(
        tokens.map(async (token) => {
          try {
            const apy = await pancakeSwapService.getTokenAPY(token.address, token.symbol);
            results[token.symbol] = apy;
          } catch (error) {
            console.error(`Failed to fetch APY for ${token.symbol}:`, error);
            results[token.symbol] = pancakeSwapService.getMockStakingAPY(token.symbol);
          }
        })
      );
      
      return results;
    },
    enabled: tokens.length > 0,
    refetchInterval: 60000, // Refetch every minute for multiple tokens
    staleTime: 50000,
    retry: 2,
  });
}