'use client';

import { useAPY } from '@/hooks/useAPY';

interface StakingTier {
  id: string;
  name: string;
  level: number;
  stakeCurrency: string;
  minInvestment: number;
  lockedPeriod: string;
  dailyReturn: string;
  apyApr: string;
  isActive?: boolean;
  gradient: string;
  borderColor: string;
  icon: string;
}

interface StakingTiersProps {
  selectedAmount?: string;
  onTierSelect?: (tier: StakingTier) => void;
  className?: string;
}

export function StakingTiers({ selectedAmount = '0', onTierSelect, className = '' }: StakingTiersProps) {
  const { data: apyData } = useAPY({ tokenSymbol: 'BNB', refetchInterval: 25000 });

  const baseTiers: StakingTier[] = [
    {
      id: 'comet',
      name: 'Comet Tier',
      level: 1,
      stakeCurrency: 'BNB',
      minInvestment: 0.1,
      lockedPeriod: '14 Days',
      dailyReturn: '3%',
      apyApr: `${apyData ? (apyData.apy * 0.8).toFixed(0) : '1095'}%`,
      isActive: true,
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.1) 100%)',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      icon: '☄️'
    },
    {
      id: 'meteor',
      name: 'Meteor Tier',
      level: 2,
      stakeCurrency: 'BNB',
      minInvestment: 1.0,
      lockedPeriod: '30 Days',
      dailyReturn: '5%',
      apyApr: `${apyData ? (apyData.apy * 1.2).toFixed(0) : '1825'}%`,
      gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(196, 181, 253, 0.1) 100%)',
      borderColor: 'rgba(139, 92, 246, 0.3)',
      icon: '🌠'
    },
    {
      id: 'supernova',
      name: 'Supernova Tier',
      level: 3,
      stakeCurrency: 'BNB',
      minInvestment: 10.0,
      lockedPeriod: '90 Days',
      dailyReturn: '8%',
      apyApr: `${apyData ? (apyData.apy * 1.8).toFixed(0) : '2920'}%`,
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(252, 211, 77, 0.1) 100%)',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      icon: '💥'
    }
  ];

  const enteredAmount = parseFloat(selectedAmount) || 0;
  const availableTiers = baseTiers.filter(tier => enteredAmount >= tier.minInvestment);
  const recommendedTier = availableTiers[availableTiers.length - 1];

  return (
    <div className={`staking-tiers ${className}`}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: 'white',
          margin: 0
        }}>
          STAKING TIERS
        </h3>
        <div style={{
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.6)'
        }}>
          Refreshes every 25s
        </div>
      </div>

      {/* Tier Selection Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {baseTiers.map((tier) => (
          <button
            key={tier.id}
            onClick={() => onTierSelect?.(tier)}
            style={{
              padding: '8px 16px',
              backgroundColor: tier.isActive ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: tier.isActive ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: tier.isActive ? '#3b82f6' : 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              transition: 'all 0.2s',
              textTransform: 'uppercase'
            }}
            onMouseEnter={(e) => {
              if (!tier.isActive) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!tier.isActive) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }
            }}
          >
            {tier.name.replace(' Tier', '')}
          </button>
        ))}
      </div>

      {/* Active Tier Details */}
      {baseTiers.filter(t => t.isActive).map((tier) => (
        <div
          key={tier.id}
          style={{
            padding: '24px',
            background: tier.gradient,
            borderRadius: '16px',
            border: `1px solid ${tier.borderColor}`,
            marginBottom: '20px'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '700',
                color: 'white'
              }}>
                {tier.level}
              </div>
              <div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '4px'
                }}>
                  {tier.name}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}>
                  Stake ${tier.stakeCurrency}
                </div>
              </div>
            </div>
            
            {enteredAmount >= tier.minInvestment && (
              <div style={{
                padding: '6px 12px',
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#22c55e',
                fontWeight: '600'
              }}>
                ✓ AVAILABLE
              </div>
            )}
          </div>

          {/* Tier Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '16px'
          }}>
            <div>
              <div style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '4px'
              }}>
                You Staked
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#3b82f6'
              }}>
                {enteredAmount > 0 ? `${enteredAmount}` : '0'} {tier.stakeCurrency}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '4px'
              }}>
                APY/APR
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#f0b90b'
              }}>
                {tier.apyApr}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '4px'
              }}>
                Locked Period
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#00d4ff'
              }}>
                {tier.lockedPeriod}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '4px'
              }}>
                Min Investment
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#8b5cf6'
              }}>
                {tier.minInvestment} {tier.stakeCurrency}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '4px'
              }}>
                Daily
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#22c55e'
              }}>
                {tier.dailyReturn}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Recommendation Banner */}
      {enteredAmount > 0 && recommendedTier && (
        <div style={{
          padding: '16px',
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
          borderRadius: '12px',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '14px',
            color: '#22c55e',
            fontWeight: '600',
            marginBottom: '4px'
          }}>
            💡 Recommended for {enteredAmount} BNB
          </div>
          <div style={{
            fontSize: '16px',
            color: 'white',
            fontWeight: '700'
          }}>
            {recommendedTier.name} - {recommendedTier.apyApr} APY
          </div>
        </div>
      )}
    </div>
  );
}