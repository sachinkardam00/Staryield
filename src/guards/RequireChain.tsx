'use client';

import { ReactNode } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { bscMainnet, bscTestnet } from '@/lib/wagmi';

type Props = { children: ReactNode; allowTestnet?: boolean };

export function RequireChain({ children, allowTestnet = true }: Props) {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected) return <>{children}</>;

  const ok = allowTestnet ? [bscMainnet.id, bscTestnet.id] : [bscMainnet.id];
  const wrong = !ok.includes(chainId as typeof bscMainnet.id | typeof bscTestnet.id);

  if (!wrong) return <>{children}</>;

  const target = allowTestnet ? bscTestnet : bscMainnet;
  return (
    <div style={{ padding: 12, border: '1px solid #f0b90b', borderRadius: 8, margin: '20px 0' }}>
      <div style={{ marginBottom: 8 }}>Wrong network. Please switch to {target.name}.</div>
      <button 
        disabled={isPending} 
        onClick={() => switchChain({ chainId: target.id })}
        style={{
          padding: '8px 16px',
          backgroundColor: '#f0b90b',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isPending ? 'not-allowed' : 'pointer',
          opacity: isPending ? 0.7 : 1
        }}
      >
        {isPending ? 'Switching…' : `Switch to ${target.name}`}
      </button>
    </div>
  );
}