'use client';

import { useState } from 'react';
import { useChainId } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { RequireChain } from '@/guards/RequireChain';
import { getTokenAddress, getStakingAddress } from '@/contracts/addresses';
import { ApproveStakeButton } from '@/features/staking/components/ApproveStakeButton';
import { PortfolioOverview } from '@/components/PortfolioOverview';
import { StakingTiers } from '@/components/StakingTiers';
import { LiveAPYCalculator } from '@/components/LiveAPYCalculator';

export default function StakingPage() {
  const chainId = useChainId();
  const [amount, setAmount] = useState('');
  const [selectedTier, setSelectedTier] = useState('comet');

  const token = getTokenAddress(chainId);
  const staking = getStakingAddress(chainId);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      padding: '20px'
    }}>
      {/* Header Navigation */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px 0'
      }}>
        <div style={{
          display: 'flex',
          gap: '24px',
          marginBottom: '40px',
          padding: '16px 24px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {[
            { name: 'CROSS-CHAIN', active: false },
            { name: 'GOVERNANCE', active: false },
            { name: 'STAR ART VAULT', active: false },
            { name: 'STARYIELDSWAP', active: true },
            { name: 'SPACE RADAR', active: false },
            { name: 'COMET CLUB', active: false }
          ].map((item) => (
            <button
              key={item.name}
              style={{
                padding: '8px 16px',
                backgroundColor: item.active ? 'rgba(0, 212, 255, 0.2)' : 'transparent',
                border: item.active ? '1px solid rgba(0, 212, 255, 0.4)' : '1px solid transparent',
                borderRadius: '6px',
                color: item.active ? '#00d4ff' : 'rgba(255, 255, 255, 0.7)',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'uppercase'
              }}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '30px',
          alignItems: 'start'
        }}>
          {/* Left Column - Portfolio & Tiers */}
          <div style={{ display: 'grid', gap: '30px' }}>
            {/* Portfolio Overview */}
            <PortfolioOverview />

            {/* Staking Tiers */}
            <StakingTiers 
              selectedAmount={amount}
              onTierSelect={(tier) => setSelectedTier(tier.id)}
            />

            {/* Staking Interface */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '20px'
              }}>
                STAKE BNB TOKENS
              </h3>

              <div style={{ marginBottom: '24px' }}>
                <ConnectButton />
              </div>

              <RequireChain allowTestnet>
                <div style={{ display: 'grid', gap: '20px' }}>
                  {/* Amount Input with BNB Icon */}
                  <div>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '12px', 
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      Amount to Stake
                    </label>
                    
                    <div style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        position: 'absolute',
                        left: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        zIndex: 1
                      }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          background: 'linear-gradient(135deg, #f0b90b 0%, #ffd700 100%)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: '700',
                          color: 'white'
                        }}>
                          ♦
                        </div>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'rgba(255, 255, 255, 0.8)'
                        }}>
                          BNB
                        </span>
                      </div>
                      
                      <input
                        type="number"
                        placeholder="0.000"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '16px 16px 16px 80px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600',
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
                      
                      <button
                        onClick={() => setAmount('1.0')}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          padding: '6px 12px',
                          backgroundColor: 'rgba(59, 130, 246, 0.2)',
                          border: '1px solid rgba(59, 130, 246, 0.4)',
                          borderRadius: '6px',
                          color: '#3b82f6',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Max
                      </button>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '8px',
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)'
                    }}>
                      <span>Balance: 0.0000 BNB</span>
                      <span>Enter Amount Above</span>
                    </div>
                  </div>
                  
                  {/* Staking Buttons */}
                  {token && staking ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px'
                    }}>
                      <button style={{
                        padding: '16px 24px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}>
                        APPROVE
                      </button>
                      
                      <button style={{
                        padding: '16px 24px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}>
                        STAKE
                      </button>
                    </div>
                  ) : (
                    <div style={{ 
                      padding: '20px', 
                      textAlign: 'center', 
                      backgroundColor: 'rgba(255, 193, 7, 0.1)', 
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 193, 7, 0.3)',
                      color: '#ffc107'
                    }}>
                      ⚠️ Contract addresses not configured for this network
                    </div>
                  )}
                </div>
              </RequireChain>
            </div>

            {/* Loyalty Points Section */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '20px'
              }}>
                LOYALTY POINTS (STARS)
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                {[
                  { icon: '💎', label: 'Total Stars', value: '14.120' },
                  { icon: '🚀', label: 'Stars earned by staking', value: '5000' },
                  { icon: '🤝', label: 'Stars earned by friend\'s staking', value: '8000' },
                  { icon: '👥', label: 'Referrals', value: '1800' }
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div style={{
                      fontSize: '20px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 212, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginBottom: '4px'
                      }}>
                        {item.label}
                      </div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: 'white'
                      }}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Live APY Calculator */}
          <div style={{
            position: 'sticky',
            top: '20px'
          }}>
            <LiveAPYCalculator 
              stakingAmount={amount}
              selectedTier={selectedTier}
            />
          </div>
        </div>
      </div>
    </div>
  );
}