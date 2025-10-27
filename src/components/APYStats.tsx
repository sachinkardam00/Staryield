'use client';

import { useAPY } from '@/hooks/useAPY';

export function APYStats() {
  const { data: apyData, isLoading } = useAPY({ tokenSymbol: 'STAR' });

  if (isLoading) {
    return (
      <li>
        <h4>Current APY</h4>
        <h3>Loading...</h3>
      </li>
    );
  }

  return (
    <li>
      <h4>Current APY</h4>
      <h3>{apyData ? `${apyData.apy.toFixed(1)}%` : '---'}</h3>
    </li>
  );
}