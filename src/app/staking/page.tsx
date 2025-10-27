'use client';

import { useState } from 'react';
import { useChainId } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { RequireChain } from '@/guards/RequireChain';
import { getTokenAddress, getStakingAddress } from '@/contracts/addresses';
import { ApproveStakeButton } from '@/features/staking/components/ApproveStakeButton';

export default function StakingPage() {
  const chainId = useChainId();
  const [amount, setAmount] = useState('');

  const token = getTokenAddress(chainId);
  const staking = getStakingAddress(chainId);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '500px', 
        margin: '0 auto', 
        paddingTop: '60px'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '700',
            background: 'linear-gradient(135deg, #00d4ff 0%, #f0b90b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            marginBottom: '10px'
          }}>
            Stake Your Tokens
          </h1>
          
          <p style={{
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '40px',
            fontSize: '16px'
          }}>
            Earn rewards by staking your tokens in our secure protocol
          </p>

          <div style={{ marginBottom: '30px' }}>
            <ConnectButton />
          </div>

          <RequireChain allowTestnet>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Amount to Stake
                </label>
                <input
                  type="number"
                  placeholder="Enter amount (e.g., 100)"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00d4ff';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 212, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              {token && staking ? (
                <ApproveStakeButton
                  tokenAddress={token}
                  stakingAddress={staking}
                  tokenDecimals={18}
                  amountInput={amount}
                  onSuccess={(txHash) => {
                    alert(`Staking successful! Transaction: ${txHash}`);
                    setAmount(''); // Clear the input
                  }}
                />
              ) : (
                <div style={{ 
                  padding: '20px', 
                  textAlign: 'center', 
                  backgroundColor: 'rgba(255, 193, 7, 0.1)', 
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 193, 7, 0.3)',
                  color: '#ffc107'
                }}>
                  ⚠️ Contract addresses not configured for this network. 
                  <br />
                  Please update the addresses in <code>src/contracts/addresses.ts</code>
                </div>
              )}
            </div>
          </RequireChain>
          
          <div style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(0, 212, 255, 0.3)'
          }}>
            <h3 style={{ 
              color: '#00d4ff', 
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              How it works:
            </h3>
            <ul style={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              lineHeight: '1.6',
              paddingLeft: '20px'
            }}>
              <li>Connect your wallet using the button above</li>
              <li>Make sure you're on the correct network (BSC or BSC Testnet)</li>
              <li>Enter the amount of tokens you want to stake</li>
              <li>First, approve the contract to spend your tokens</li>
              <li>Then, stake your tokens to start earning rewards</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}