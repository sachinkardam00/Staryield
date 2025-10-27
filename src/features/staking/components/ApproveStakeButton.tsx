'use client';

import { useEffect, useMemo, useState } from 'react';
import { Address, erc20Abi, formatUnits, parseUnits } from 'viem';
import {
  useAccount,
  useReadContracts,
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';

type Props = {
  tokenAddress: Address;
  stakingAddress: Address;
  tokenDecimals: number;
  amountInput: string;
  onSuccess?: (txHash: `0x${string}`) => void;
};

export function ApproveStakeButton({
  tokenAddress,
  stakingAddress,
  tokenDecimals,
  amountInput,
  onSuccess,
}: Props) {
  const { address } = useAccount();
  const [needsApproval, setNeedsApproval] = useState(true);

  const amount = useMemo(() => {
    if (!amountInput) return BigInt(0);
    try {
      return parseUnits(amountInput, tokenDecimals);
    } catch {
      return BigInt(0);
    }
  }, [amountInput, tokenDecimals]);

  const { data: reads, refetch: refetchReads, isFetching } = useReadContracts({
    allowFailure: false,
    contracts: [
      { address: tokenAddress, abi: erc20Abi, functionName: 'decimals' },
      address
        ? {
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'allowance',
            args: [address, stakingAddress],
          }
        : undefined,
      address
        ? { address: tokenAddress, abi: erc20Abi, functionName: 'balanceOf', args: [address] }
        : undefined,
    ].filter(Boolean) as any,
    query: { enabled: Boolean(address) },
  });

  const allowance: bigint | undefined = reads?.[1] as any;
  const balance: bigint | undefined = reads?.[2] as any;

  useEffect(() => {
    if (allowance === undefined) return;
    setNeedsApproval(allowance < amount);
  }, [allowance, amount]);

  const { data: simStake } = useSimulateContract({
    address: stakingAddress,
    abi: [
      {
        name: 'deposit',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'amount', type: 'uint256' }],
        outputs: [],
      },
    ],
    functionName: 'deposit',
    args: [amount],
    query: { enabled: Boolean(address && amount > BigInt(0) && !needsApproval) },
  });

  const { writeContract, data: txHash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isMining, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isSuccess && txHash && onSuccess) onSuccess(txHash);
    if (isSuccess) refetchReads();
  }, [isSuccess, txHash, onSuccess, refetchReads]);

  const canStake = amount > BigInt(0) && balance !== undefined && balance >= amount && !needsApproval;

  function onApprove() {
    if (!address) return;
    writeContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [stakingAddress, amount],
    });
  }

  function onStake() {
    if (!simStake?.request) return;
    writeContract(simStake.request);
  }

  const disabled = isPending || isMining || isFetching || amount === BigInt(0);

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {address ? (
        <>
          <div style={{ fontSize: 12, opacity: 0.8, color: '#666' }}>
            Balance: {balance !== undefined ? formatUnits(balance, tokenDecimals) : '—'}
          </div>
          {needsApproval ? (
            <button 
              disabled={disabled} 
              onClick={onApprove}
              style={{
                padding: '12px 20px',
                backgroundColor: disabled ? '#cccccc' : '#f0b90b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              {isPending ? 'Approving…' : 'Approve Token'}
            </button>
          ) : (
            <button 
              disabled={disabled || !canStake} 
              onClick={onStake}
              style={{
                padding: '12px 20px',
                backgroundColor: (disabled || !canStake) ? '#cccccc' : '#00d4ff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: (disabled || !canStake) ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              {isPending || isMining ? 'Staking…' : 'Stake Tokens'}
            </button>
          )}
          {writeError ? (
            <div style={{ color: 'crimson', fontSize: 12, padding: '8px', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>
              {writeError.message}
            </div>
          ) : null}
          {isSuccess && (
            <div style={{ color: 'green', fontSize: 12, padding: '8px', backgroundColor: '#e6ffe6', borderRadius: '4px' }}>
              Transaction successful!
            </div>
          )}
        </>
      ) : (
        <div style={{ 
          padding: '12px', 
          textAlign: 'center', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '8px',
          color: '#666'
        }}>
          Connect your wallet to continue.
        </div>
      )}
    </div>
  );
}