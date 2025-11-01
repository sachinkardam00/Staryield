'use client';

import { APYDashboard } from '@/components/Dashboard/APYDashboard';
import { APYDisplay } from '@/components/Dashboard/APYDisplay';
import Link from 'next/link';

export default function APYPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        paddingTop: '60px'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: '700',
            background: 'linear-gradient(135deg, #00d4ff 0%, #f0b90b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            APY Analytics
          </h1>
          
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '18px',
            maxWidth: '600px',
            margin: '0 auto 30px'
          }}>
            Real-time Annual Percentage Yield calculations powered by PancakeSwap data
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link 
              href="/staking" 
              style={{
                padding: '12px 24px',
                backgroundColor: '#00d4ff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0099cc';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#00d4ff';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Start Staking
            </Link>
            <Link 
              href="/" 
              style={{
                padding: '12px 24px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              Back Home
            </Link>
          </div>
        </div>

        {/* Featured APY */}
        <div style={{
          marginBottom: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '20px'
            }}>
              StarYield Token (STAR)
            </h2>
            <APYDisplay tokenSymbol="STAR" showDetails={true} />
          </div>

          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '20px'
            }}>
              BNB Staking
            </h2>
            <APYDisplay tokenSymbol="BNB" showDetails={true} />
          </div>
        </div>

        {/* Multi-token Dashboard */}
        <div style={{ marginBottom: '40px' }}>
          <APYDashboard />
        </div>

        {/* Information Section */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '20px'
          }}>
            How APY is Calculated
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              padding: '20px',
              backgroundColor: 'rgba(0, 212, 255, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 212, 255, 0.3)'
            }}>
              <h4 style={{ color: '#00d4ff', marginBottom: '10px' }}>Data Source</h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.5' }}>
                Real-time pool data from PancakeSwap V3 subgraph including trading volume, fees, and total value locked (TVL).
              </p>
            </div>

            <div style={{
              padding: '20px',
              backgroundColor: 'rgba(240, 185, 11, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(240, 185, 11, 0.3)'
            }}>
              <h4 style={{ color: '#f0b90b', marginBottom: '10px' }}>APR Calculation</h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.5' }}>
                Annual Percentage Rate based on daily trading fees and pool liquidity: (Daily Fees × 365) ÷ TVL
              </p>
            </div>

            <div style={{
              padding: '20px',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              <h4 style={{ color: '#8b5cf6', marginBottom: '10px' }}>APY Compounding</h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.5' }}>
                Annual Percentage Yield with daily compounding: (1 + APR/365)^365 - 1
              </p>
            </div>
          </div>

          <div style={{
            marginTop: '20px',
            padding: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontSize: '12px',
              margin: 0 
            }}>
              <strong>Disclaimer:</strong> APY rates are estimates based on current market conditions and may fluctuate. 
              Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}