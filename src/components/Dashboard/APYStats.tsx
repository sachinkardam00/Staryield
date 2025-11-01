'use client';

import { useAPY } from '@/hooks/useAPY';

export function APYStats() {
  const { data: apyData, isLoading, error } = useAPY({ tokenSymbol: 'STAR' });

  if (isLoading) {
    return (
      <li>
        <h4>Current APY</h4>
        <h3>Loading...</h3>
      </li>
    );
  }

  if (error) {
    return (
      <li>
        <h4>Current APY</h4>
        <h3>---</h3>
      </li>
    );
  }

  const apyValue = apyData?.apy;
  const displayValue = typeof apyValue === 'number' ? `${apyValue.toFixed(1)}%` : '---';

  return (
    <li>
      <h4>Current APY</h4>
      <h3>{displayValue}</h3>
    </li>
  );
}