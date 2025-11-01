'use client';

import { useAPY } from '@/hooks/useAPY';
import { useMemo } from 'react';

interface LiveAPYCalculatorProps {
  stakingAmount: string;
  selectedTier?: string;
  className?: string;
}

export function LiveAPYCalculator({ stakingAmount, selectedTier = 'comet', className = '' }: LiveAPYCalculatorProps) {
  const { data: apyData, isLoading } = useAPY({ 
    tokenSymbol: 'BNB', 
    refetchInterval: 25000 // 25 seconds as requested
  });

  const calculations = useMemo(() => {
    const amount = parseFloat(stakingAmount) || 0;
    if (amount <= 0 || !apyData) return null;

    // Tier multipliers
    const tierMultipliers = {
      comet: 0.8,
      meteor: 1.2,
      supernova: 1.8
    };

    const multiplier = tierMultipliers[selectedTier as keyof typeof tierMultipliers] || 1;
    const tierAPY = apyData.apy * multiplier;
    const tierAPR = apyData.apr * multiplier;

    // Calculate earnings
    const dailyEarning = (amount * tierAPR / 100) / 365;
    const weeklyEarning = dailyEarning * 7;
    const monthlyEarning = dailyEarning * 30;
    const yearlyEarning = amount * (tierAPY / 100);

    // Best APY comparison (show highest tier)
    return {
      currentAPY: tierAPY,
      currentAPR: tierAPR,
      dailyEarning,
      weeklyEarning,
      monthlyEarning,
      yearlyEarning,
      stakingAmount: amount
    };
  }, [stakingAmount, apyData, selectedTier]);

  const formatNumber = (num: number, decimals = 4) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const formatCurrency = (num: number) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  };

  if (isLoading) {
    return (
      <div className={`live-apy-calculator loading ${className}`}>
        <div style={{
          padding: '24px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '3px solid rgba(0, 212, 255, 0.3)',
            borderTop: '3px solid #00d4ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 12px'
          }} />
          <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Calculating live APY...</div>
        </div>
      </div>
    );
  }

  if (!calculations) {
    return (
      <div className={`live-apy-calculator empty ${className}`}>
        <div style={{
          padding: '24px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '12px'
          }}>💰</div>
          <div style={{
            fontSize: '16px',
            color: 'white',
            marginBottom: '8px'
          }}>
            Enter BNB amount to see live calculations
          </div>
          <div style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            APY updates every 25 seconds
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`live-apy-calculator ${className}`}>
      {/* Header with refresh indicator */}
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
          LIVE APY CALCULATOR
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.6)'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            animation: 'pulse 2s infinite'
          }} />
          Live • Updates every 25s
        </div>
      </div>

      {/* Current APY */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(56, 189, 248, 0.1) 100%)',
          borderRadius: '12px',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '8px',
            textTransform: 'uppercase'
          }}>
            Current APY ({selectedTier} tier)
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#00d4ff',
            marginBottom: '4px'
          }}>
            {formatNumber(calculations.currentAPY, 1)}%
          </div>
          <div style={{
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.5)'
          }}>
            APR: {formatNumber(calculations.currentAPR, 1)}%
          </div>
        </div>
      </div>

      {/* Earnings Projections */}
      <div style={{
        padding: '24px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '20px'
      }}>
        <div style={{
          fontSize: '16px',
          fontWeight: '600',
          color: 'white',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          Projected Earnings for {formatCurrency(calculations.stakingAmount)} BNB
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: '16px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '4px'
            }}>
              Daily
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#22c55e'
            }}>
              {formatCurrency(calculations.dailyEarning)} BNB
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '4px'
            }}>
              Weekly
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#3b82f6'
            }}>
              {formatCurrency(calculations.weeklyEarning)} BNB
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '4px'
            }}>
              Monthly
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#8b5cf6'
            }}>
              {formatCurrency(calculations.monthlyEarning)} BNB
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '4px'
            }}>
              Yearly
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#f59e0b'
            }}>
              {formatCurrency(calculations.yearlyEarning)} BNB
            </div>
          </div>
        </div>
      </div>

      {/* Attribution removed per request */}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}