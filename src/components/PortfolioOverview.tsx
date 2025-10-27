'use client';

import { useAPY } from '@/hooks/useAPY';
import { useAccount } from 'wagmi';

interface PortfolioOverviewProps {
  className?: string;
}

export function PortfolioOverview({ className = '' }: PortfolioOverviewProps) {
  const { address } = useAccount();
  const { data: apyData } = useAPY({ tokenSymbol: 'BNB', refetchInterval: 25000 });

  // Mock portfolio data - replace with real contract calls
  const portfolioData = {
    totalStaked: 1400,
    totalEarned: 1000,
    activeStaking: 15000,
    withdrawnEarning: 11000,
    unclaimedEarning: 11000
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    });
  };

  return (
    <div className={`portfolio-overview ${className}`}>
      {/* Header with verification badges */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: 'white',
          margin: 0
        }}>
          OVERALL PORTFOLIO
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{
            padding: '6px 12px',
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#22c55e',
            fontWeight: '600'
          }}>
            🔒 VERIFIED CONTRACT
          </div>
          <div style={{
            padding: '6px 12px',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#3b82f6',
            fontWeight: '600'
          }}>
            🛡️ SUPPORT
          </div>
        </div>
      </div>

      {/* Portfolio Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          padding: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '8px'
          }}>
            Total Staked
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#f0b90b'
          }}>
            BNB {formatNumber(portfolioData.totalStaked)}
          </div>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '8px'
          }}>
            Total Earned
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#22c55e'
          }}>
            BNB {formatNumber(portfolioData.totalEarned)}
          </div>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '8px'
          }}>
            Active Staking
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#00d4ff'
          }}>
            BNB {formatNumber(portfolioData.activeStaking)}
          </div>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '8px'
          }}>
            Withdrawn Earning
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#8b5cf6'
          }}>
            BNB {formatNumber(portfolioData.withdrawnEarning)}
          </div>
        </div>
      </div>

      {/* Unclaimed Earnings Card */}
      <div style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(240, 185, 11, 0.1) 0%, rgba(255, 215, 0, 0.1) 100%)',
        borderRadius: '16px',
        border: '1px solid rgba(240, 185, 11, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{
            fontSize: '16px',
            color: 'white',
            fontWeight: '600',
            marginBottom: '4px'
          }}>
            Unclaimed Earning
          </div>
          <div style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#f0b90b'
          }}>
            BNB {formatNumber(portfolioData.unclaimedEarning)}
          </div>
        </div>
        <button style={{
          padding: '12px 24px',
          backgroundColor: '#f0b90b',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#d4a00a';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#f0b90b';
          e.currentTarget.style.transform = 'translateY(0)';
        }}>
          🔥 CLAIM
        </button>
      </div>
    </div>
  );
}