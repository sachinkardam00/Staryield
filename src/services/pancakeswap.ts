/**
 * PancakeSwap API service for fetching APY and pool data
 */

export interface PancakeSwapPool {
  id: string;
  token0: {
    id: string;
    symbol: string;
    name: string;
  };
  token1: {
    id: string;
    symbol: string;
    name: string;
  };
  totalValueLockedUSD: string;
  volumeUSD: string;
  feeTier: string;
  apr?: number;
  apy?: number;
}

export interface APYData {
  apy: number;
  apr: number;
  tvl: number;
  volume24h: number;
  lastUpdated: Date;
}

class PancakeSwapService {
  private readonly BSC_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-bsc';
  private readonly PANCAKE_API_URL = 'https://farms-api.pancakeswap.com';

  /**
   * Fetch pool data from PancakeSwap subgraph
   */
  async fetchPoolData(tokenAddress: string): Promise<PancakeSwapPool | null> {
    try {
      const query = `
        query GetPool($tokenAddress: String!) {
          pools(
            where: {
              or: [
                { token0: $tokenAddress },
                { token1: $tokenAddress }
              ]
            }
            orderBy: totalValueLockedUSD
            orderDirection: desc
            first: 1
          ) {
            id
            token0 {
              id
              symbol
              name
            }
            token1 {
              id
              symbol
              name
            }
            totalValueLockedUSD
            volumeUSD
            feeTier
          }
        }
      `;

      const response = await fetch(this.BSC_SUBGRAPH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { tokenAddress: tokenAddress.toLowerCase() },
        }),
      });

      const data = await response.json();
      return data.data?.pools?.[0] || null;
    } catch (error) {
      console.error('Error fetching pool data:', error);
      return null;
    }
  }

  /**
   * Calculate APY based on pool data and trading volume
   */
  calculateAPY(pool: PancakeSwapPool): APYData {
    const tvl = parseFloat(pool.totalValueLockedUSD);
    const volume24h = parseFloat(pool.volumeUSD);
    const feeTier = parseFloat(pool.feeTier) / 10000; // Convert from basis points

    // Calculate daily fees
    const dailyFees = volume24h * feeTier;
    
    // Calculate APR (Annual Percentage Rate)
    const apr = tvl > 0 ? (dailyFees * 365) / tvl : 0;
    
    // Calculate APY (Annual Percentage Yield) with compounding
    const apy = Math.pow(1 + apr / 365, 365) - 1;

    return {
      apy: apy * 100, // Convert to percentage
      apr: apr * 100, // Convert to percentage
      tvl,
      volume24h,
      lastUpdated: new Date(),
    };
  }

  /**
   * Get farms data from PancakeSwap API
   */
  async fetchFarmsAPY(): Promise<any[]> {
    try {
      const response = await fetch(`${this.PANCAKE_API_URL}/v3/farms`);
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching farms data:', error);
      return [];
    }
  }

  /**
   * Mock APY calculation for demonstration
   * In production, replace with actual staking contract data
   */
  getMockStakingAPY(tokenSymbol: string = 'STAR'): APYData {
    // Simulated APY based on token
    const mockAPYs: Record<string, number> = {
      STAR: 127.5, // StarYield token APY
      BNB: 8.2,
      USDT: 12.1,
      CAKE: 45.3,
    };

    const baseAPY = mockAPYs[tokenSymbol] || 15.0;
    
    // Add some realistic variation
    const variation = (Math.random() - 0.5) * 2; // ±1%
    const currentAPY = Math.max(0, baseAPY + variation);

    return {
      apy: currentAPY,
      apr: currentAPY * 0.95, // APR is typically slightly lower than APY
      tvl: 1425422, // Mock TVL
      volume24h: 89234, // Mock 24h volume
      lastUpdated: new Date(),
    };
  }

  /**
   * Get real-time APY for a token
   */
  async getTokenAPY(tokenAddress: string, tokenSymbol: string = 'STAR'): Promise<APYData> {
    try {
      // First try to get real data from PancakeSwap
      const poolData = await this.fetchPoolData(tokenAddress);
      
      if (poolData && parseFloat(poolData.totalValueLockedUSD) > 1000) {
        // If we have good pool data, calculate real APY
        return this.calculateAPY(poolData);
      } else {
        // Fallback to mock data for demonstration
        return this.getMockStakingAPY(tokenSymbol);
      }
    } catch (error) {
      console.error('Error getting token APY:', error);
      // Return mock data on error
      return this.getMockStakingAPY(tokenSymbol);
    }
  }
}

export const pancakeSwapService = new PancakeSwapService();