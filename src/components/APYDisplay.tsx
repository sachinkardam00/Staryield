'use client';

import { useAPY } from '@/hooks/useAPY';

interface APYDisplayProps {
  tokenSymbol?: string;
  showDetails?: boolean;
  className?: string;
}

export function APYDisplay({ tokenSymbol = 'STAR', showDetails = false, className = '' }: APYDisplayProps) {
  const { data: apyData, isLoading, isError, error } = useAPY({ tokenSymbol });

  if (isLoading) {
    return (
      <div className={`apy-display loading ${className}`}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid rgba(0, 212, 255, 0.3)',
            borderTop: '2px solid #00d4ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Loading APY...</span>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`apy-display error ${className}`}>
        <div style={{
          padding: '12px 16px',
          backgroundColor: 'rgba(255, 67, 67, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 67, 67, 0.3)',
          color: '#ff6b6b'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '500' }}>
            ⚠️ APY Unavailable
          </div>
          {showDetails && (
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
              {error?.message || 'Failed to fetch APY data'}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!apyData) {
    return null;
  }

  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const formatCurrency = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toFixed(0)}`;
  };

  return (
    <div className={`apy-display ${className}`}>
      {/* Main APY Display */}
      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(240, 185, 11, 0.1) 100%)',
        borderRadius: '16px',
        border: '1px solid rgba(0, 212, 255, 0.3)',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '8px',
          fontWeight: '500'
        }}>
          Current APY
        </div>
        <div style={{
          fontSize: '32px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #00d4ff 0%, #f0b90b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1.2'
        }}>
          {formatNumber(apyData.apy, 1)}%
        </div>
        <div style={{
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.5)',
          marginTop: '4px'
        }}>
          Annual Percentage Yield
        </div>
      </div>

      {/* Detailed Information */}
      {showDetails && (
        <div style={{
          marginTop: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '12px'
        }}>
          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '4px'
            }}>
              APR
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#00d4ff'
            }}>
              {formatNumber(apyData.apr, 1)}%
            </div>
          </div>

          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '4px'
            }}>
              TVL
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#f0b90b'
            }}>
              {formatCurrency(apyData.tvl)}
            </div>
          </div>

          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '4px'
            }}>
              24h Volume
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#8b5cf6'
            }}>
              {formatCurrency(apyData.volume24h)}
            </div>
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div style={{
        marginTop: '12px',
        textAlign: 'center',
        fontSize: '11px',
        color: 'rgba(255, 255, 255, 0.4)'
      }}>
        Last updated: {apyData.lastUpdated.toLocaleTimeString()}
      </div>

      {/* PancakeSwap Attribution */}
      <div style={{
        marginTop: '8px',
        textAlign: 'center',
        fontSize: '10px',
        color: 'rgba(255, 255, 255, 0.3)'
      }}>
        Powered by 🥞 PancakeSwap
      </div>
    </div>
  );
}