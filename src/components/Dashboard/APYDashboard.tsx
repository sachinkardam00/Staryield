'use client';

import { useMultipleAPY } from '@/hooks/useAPY';

interface APYDashboardProps {
  tokens?: Array<{ address: string; symbol: string; name: string }>;
  className?: string;
}

export function APYDashboard({ 
  tokens = [
    { address: '0x0000000000000000000000000000000000000000', symbol: 'STAR', name: 'StarYield' },
    { address: '0x0000000000000000000000000000000000000001', symbol: 'BNB', name: 'BNB' },
    { address: '0x0000000000000000000000000000000000000002', symbol: 'CAKE', name: 'PancakeSwap' },
  ],
  className = ''
}: APYDashboardProps) {
  const { data: apyData, isLoading, isError } = useMultipleAPY(tokens);

  if (isLoading) {
    return (
      <div className={`apy-dashboard loading ${className}`}>
        <div style={{
          padding: '20px',
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
          <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Loading APY rates...</div>
        </div>
      </div>
    );
  }

  if (isError || !apyData) {
    return (
      <div className={`apy-dashboard error ${className}`}>
        <div style={{
          padding: '20px',
          backgroundColor: 'rgba(255, 67, 67, 0.1)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 67, 67, 0.3)',
          color: '#ff6b6b',
          textAlign: 'center'
        }}>
          Failed to load APY data
        </div>
      </div>
    );
  }

  return (
    <div className={`apy-dashboard ${className}`}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #00d4ff 0%, #f0b90b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          Live APY Rates
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {tokens.map((token) => {
            const apy = apyData[token.symbol];
            if (!apy) return null;

            return (
              <div
                key={token.symbol}
                style={{
                  padding: '20px',
                  background: `linear-gradient(135deg, 
                    ${token.symbol === 'STAR' ? 'rgba(0, 212, 255, 0.1)' : 
                      token.symbol === 'BNB' ? 'rgba(240, 185, 11, 0.1)' : 
                      'rgba(139, 92, 246, 0.1)'} 0%, 
                    rgba(255, 255, 255, 0.05) 100%)`,
                  borderRadius: '16px',
                  border: `1px solid ${
                    token.symbol === 'STAR' ? 'rgba(0, 212, 255, 0.3)' : 
                    token.symbol === 'BNB' ? 'rgba(240, 185, 11, 0.3)' : 
                    'rgba(139, 92, 246, 0.3)'
                  }`,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '4px'
                }}>
                  {token.name}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '12px'
                }}>
                  {token.symbol}
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: token.symbol === 'STAR' ? '#00d4ff' : 
                         token.symbol === 'BNB' ? '#f0b90b' : '#8b5cf6',
                  marginBottom: '8px'
                }}>
                  {apy.apy.toFixed(1)}%
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}>
                  APY
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: '20px',
          textAlign: 'center',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.4)'
        }}>
          Rates update every 30 seconds • Powered by 🥞 PancakeSwap
        </div>
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