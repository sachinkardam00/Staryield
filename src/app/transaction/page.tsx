'use client';

import { CustomConnectButton } from '@/components/CustomConnectButton';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { formatEther } from 'viem';
import { getRouterAddress } from '@/contracts/addresses';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: string;
  methodId: string;
  functionName: string;
  isError: string;
}

interface SimpleTransaction {
  hash: string;
  value: string;
  timestamp: number;
  type: 'stake' | 'unstake' | 'claim' | 'withdraw' | 'harvest';
  status: 'success' | 'failed';
}

export default function TransactionPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [transactions, setTransactions] = useState<SimpleTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const { address, isConnected, chain } = useAccount();

  useEffect(() => {
    // Add admin class to body
    document.body.className = 'admin';
    
    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.className = '';
    };
  }, []);

  useEffect(() => {
    if (!address || !isConnected) return;

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const routerAddress = getRouterAddress() as string;
        if (!routerAddress) return;

        const apiKey = process.env.NEXT_PUBLIC_BSCSCAN_API_KEY || '';
        const baseUrl = 'https://api-testnet.bscscan.com/api';
        
        // Fetch normal transactions (for deposits)
        const normalTxUrl = `${baseUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`;
        
        console.log('Fetching transactions from BSCScan API...');
        const response = await fetch(normalTxUrl);
        const data = await response.json();
        
        if (data.status !== '1' || !data.result) {
          console.log('No transactions found or API error:', data.message);
          setTransactions([]);
          return;
        }

        const txs: SimpleTransaction[] = [];

        // Process transactions to router
        for (const tx of data.result as Transaction[]) {
          if (tx.to.toLowerCase() !== routerAddress.toLowerCase()) continue;
          if (tx.from.toLowerCase() !== address.toLowerCase()) continue;

          let type: 'stake' | 'unstake' | 'claim' | 'withdraw' | 'harvest' = 'stake';
          const valueInBNB = (parseInt(tx.value) / 1e18).toString();
          
          // Determine transaction type based on method ID and value
          if (tx.methodId) {
            // Common method IDs (first 4 bytes of function signature hash)
            if (tx.methodId === '0xa694fc3a') type = 'stake'; // stake()
            else if (tx.methodId === '0x2e1a7d4d') type = 'unstake'; // unstake(uint256)
            else if (tx.methodId === '0x4e71d92d') type = 'claim'; // claim()
            else if (tx.methodId === '0x3ccfd60b') type = 'withdraw'; // withdraw()
            else if (tx.methodId === '0x4641257d') type = 'harvest'; // harvest()
            else if (tx.functionName.includes('stake')) type = 'stake';
            else if (tx.functionName.includes('unstake') || tx.functionName.includes('Unstake')) type = 'unstake';
            else if (tx.functionName.includes('claim') || tx.functionName.includes('Claim')) type = 'claim';
            else if (tx.functionName.includes('withdraw') || tx.functionName.includes('Withdraw')) type = 'withdraw';
            else if (tx.functionName.includes('harvest') || tx.functionName.includes('Harvest')) type = 'harvest';
          } else if (parseInt(tx.value) > 0) {
            type = 'stake'; // Transactions with value are likely stakes
          }

          txs.push({
            hash: tx.hash,
            value: valueInBNB,
            timestamp: parseInt(tx.timestamp),
            type,
            status: tx.isError === '0' ? 'success' : 'failed'
          });
        }

        console.log(`Found ${txs.length} transactions to router`);
        setTransactions(txs);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [address, isConnected]);

  return (
    <>
      <div className="admin-header">
        <div className="hesder-video">
          <video autoPlay muted loop>
            <source src="/images/galaxy-bg-2.mp4" type="video/mp4" />
          </video>
        </div>
        <header>
          <div className="container">
            <div className="header-container d-flex justify-content-between align-items-center">
              <Link href="/" className="logo">
                <img src="/images/logo.png" alt="StarYield" />
              </Link>
              <ul className="main-menu clearfix">
                <li>
                  <Link href="/dashboard" className="link">Stake</Link>
                </li>
                <li>
                  <Link href="/referral" className="link">Affiliate</Link>
                </li>
                <li className="active">
                  <Link href="/transaction" className="link">History</Link>
                </li>
                <li><a href="#" className="link">Referral Banners</a></li>
                <li><a href="#" className="link">Documentation</a></li>
                <li className="menu-enter">
                  <Link href="/dashboard" className="btn btn-blue">Enter App</Link>
                </li>
              </ul>
              <ul className="header-buttons clearfix">
                <li className="switch d-flex align-items-center">
                  <a className="active" href="#"><img src="/images/bnb.png" alt="BNB" />BNB</a>
                  <a href="#"><img src="/images/trx.png" alt="TRX" />TRX</a>
                  <a href="#"><img src="/images/usdt-logo.png" alt="USDT" />USDT</a>
                </li>
                <li><CustomConnectButton /></li>
                <li className="menu-toggle">
                  <a href="javascript:void(0);" id="menu-toggle" className="btn btn-skyblue">
                    <i className="fas fa-bars"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </header>
      </div>

      <div className="top-stats">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <ul className="features-menu d-flex justify-content-center">
                <li>
                  <a href="#">Cross-chain</a>
                  <div className="feature-pop">
                    <h4>Interstellar Transfers (Coming Soon)</h4>
                    <p>To maximize the potential of our platform, we are working towards facilitating operations across multiple blockchain networks.</p>
                  </div>
                </li>
                <li>
                  <a href="#">Governance</a>
                  <div className="feature-pop">
                    <h4>Staryield Governance (Coming Soon)</h4>
                    <p>In the spirit of decentralized finance, we plan to introduce a governance token.</p>
                  </div>
                </li>
                <li>
                  <a href="#">Star Art Vault</a>
                  <div className="feature-pop">
                    <h4>NFT Staking(Coming Soon)</h4>
                    <p>In keeping up with the explosive growth of Non-Fungible Tokens (NFTs), we aim to incorporate NFT staking into our platform.</p>
                  </div>
                </li>
                <li>
                  <a href="#">StarYieldSwap</a>
                  <div className="feature-pop">
                    <h4>DEX(Coming Soon)</h4>
                    <p>We envision establishing our own dedicated DeFi exchange, StarYieldSwap. This platform will facilitate seamless swaps between different cryptocurrencies, driving further utility and making asset management even more flexible for our users.</p>
                  </div>
                </li>
                <li>
                  <a href="#">Space Radar</a>
                  <div className="feature-pop">
                    <h4>Advanced Portfolio Analytics (Coming Soon)</h4>
                    <p>To provide our users with deep insights into their investments, we aim to develop an advanced portfolio analytics tool.</p>
                  </div>
                </li>
                <li>
                  <a href="#">Comet Club</a>
                  <div className="feature-pop">
                    <h4>Loyalty and Rewards Program (Coming Soon)</h4>
                    <p>Our plan includes the launch of a loyalty and rewards program to show appreciation for our loyal users.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-body">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <div className="filter-wrapper">
                <h3>Filter</h3>
                <ul className="filter-list clearfix">
                  <li>
                    <div className="filter-box">
                      <input
                        type="radio"
                        name="type"
                        id="trans-1"
                        checked={selectedFilter === 'all'}
                        onChange={() => setSelectedFilter('all')}
                      />
                      <label htmlFor="trans-1">
                        <span></span>All Transaction
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="filter-box">
                      <input
                        type="radio"
                        name="type"
                        id="trans-2"
                        checked={selectedFilter === 'stake'}
                        onChange={() => setSelectedFilter('stake')}
                      />
                      <label htmlFor="trans-2">
                        <span></span>Stake
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="filter-box">
                      <input
                        type="radio"
                        name="type"
                        id="trans-3"
                        checked={selectedFilter === 'earnings'}
                        onChange={() => setSelectedFilter('earnings')}
                      />
                      <label htmlFor="trans-3">
                        <span></span>Earnings
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="filter-box">
                      <input
                        type="radio"
                        name="type"
                        id="trans-4"
                        checked={selectedFilter === 'claimed'}
                        onChange={() => setSelectedFilter('claimed')}
                      />
                      <label htmlFor="trans-4">
                        <span></span>Claimed Earning
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="filter-box">
                      <input
                        type="radio"
                        name="type"
                        id="trans-5"
                        checked={selectedFilter === 'referral'}
                        onChange={() => setSelectedFilter('referral')}
                      />
                      <label htmlFor="trans-5">
                        <span></span>Referral Reward
                      </label>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-8 offset-lg-1">
              <div className="transactions">
                <h3>Your Transactions</h3>
                {!isConnected ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                    <h4 style={{marginBottom: '20px'}}>Please connect your wallet to view transactions</h4>
                  </div>
                ) : chain && chain.id !== 97 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#ff6b6b' }}>
                    <h4>⚠️ Please switch to BSC Testnet (Chain ID: 97)</h4>
                  </div>
                ) : loading ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                    <i className="fa-solid fa-spinner fa-spin" style={{fontSize: '32px', marginBottom: '15px'}}></i>
                    <h4>Loading your transactions...</h4>
                  </div>
                ) : (
                  <div style={{ padding: '20px' }}>
                    {transactions.length === 0 ? (
                      <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                        <h4 style={{marginBottom: '15px'}}>No transactions found</h4>
                        <p style={{color: '#aaa'}}>Your staking transactions will appear here once you make your first stake.</p>
                      </div>
                    ) : (
                      <>
                        {transactions.filter(tx => {
                          if (selectedFilter === 'all') return true;
                          if (selectedFilter === 'stake') return tx.type === 'stake';
                          if (selectedFilter === 'earnings') return tx.type === 'harvest';
                          if (selectedFilter === 'claimed') return tx.type === 'claim';
                          return false;
                        }).length > 0 && (
                          <ul className="transaction-list" style={{marginBottom: '20px'}}>
                            {transactions.filter(tx => {
                              if (selectedFilter === 'all') return true;
                              if (selectedFilter === 'stake') return tx.type === 'stake';
                              if (selectedFilter === 'earnings') return tx.type === 'harvest';
                              if (selectedFilter === 'claimed') return tx.type === 'claim';
                              return false;
                            }).map((tx) => (
                              <li key={tx.hash}>
                                <div className="trans-item d-flex justify-content-between align-items-center">
                                  <div className="d-flex align-items-center">
                                    <img src="/images/bnb.png" className="trans-icon" alt="BNB" style={{width: '30px', height: '30px', marginRight: '10px'}} />
                                    <div className={`trans-amount ${tx.type === 'stake' || tx.type === 'claim' || tx.type === 'withdraw' ? 'green' : 'red'}`}>
                                      {parseFloat(tx.value).toFixed(4)} <span>BNB</span>
                                    </div>
                                  </div>
                                  <div className="trans-type">
                                    {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                                    {tx.status === 'failed' && <span style={{color: '#ff6b6b', marginLeft: '5px'}}>Failed</span>}
                                  </div>
                                  <div className="trans-date">
                                    {new Date(tx.timestamp * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    <br />
                                    <small style={{color: '#888', fontSize: '11px'}}>
                                      {new Date(tx.timestamp * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </small>
                                  </div>
                                  <a 
                                    href={`https://testnet.bscscan.com/tx/${tx.hash}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{color: '#4CAF50', textDecoration: 'none', fontSize: '12px'}}
                                  >
                                    View
                                  </a>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                    
                    {transactions.length > 0 && (
                      <>
                        <div style={{ 
                          padding: '30px', 
                          background: 'rgba(255,255,255,0.05)', 
                          borderRadius: '10px',
                          marginBottom: '20px',
                          textAlign: 'center'
                        }}>
                          <h4 style={{color: '#4CAF50', marginBottom: '15px'}}>
                            <i className="fa-solid fa-check-circle"></i> Complete History on BSCScan
                          </h4>
                          <p style={{marginBottom: '20px', color: '#aaa'}}>
                            View all your staking transactions, claims, and withdrawals on the BSC Testnet block explorer
                          </p>
                          <a 
                            href={`https://testnet.bscscan.com/address/${address}#tokentxns`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-blue"
                            style={{display: 'inline-block', textDecoration: 'none'}}
                          >
                            <i className="fa-solid fa-external-link"></i> View on BSCScan
                          </a>
                        </div>
                        
                        <div style={{
                          padding: '20px',
                          background: 'rgba(255,255,255,0.03)',
                          borderRadius: '10px',
                          marginTop: '20px'
                        }}>
                          <h4 style={{marginBottom: '15px', color: '#FFD700'}}>
                            <i className="fa-solid fa-info-circle"></i> Transaction Types
                          </h4>
                          <ul style={{listStyle: 'none', padding: 0, color: '#ccc'}}>
                            <li style={{padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                              <strong style={{color: '#4CAF50'}}>📥 Stake:</strong> When you stake BNB to the contract
                            </li>
                            <li style={{padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                              <strong style={{color: '#ff6b6b'}}>📤 Unstake:</strong> When you request to unstake your BNB
                            </li>
                            <li style={{padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                              <strong style={{color: '#4CAF50'}}>💰 Claim:</strong> When you claim your staking rewards
                            </li>
                            <li style={{padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                              <strong style={{color: '#4CAF50'}}>✅ Withdraw:</strong> When you withdraw your unbonded BNB
                            </li>
                            <li style={{padding: '10px 0'}}>
                              <strong style={{color: '#FFD700'}}>🌾 Harvest:</strong> When rewards are generated from adapter
                            </li>
                          </ul>
                        </div>

                        <div style={{
                          padding: '15px',
                          background: 'rgba(255,165,0,0.1)',
                          borderRadius: '8px',
                          marginTop: '20px',
                          border: '1px solid rgba(255,165,0,0.3)'
                        }}>
                          <p style={{margin: 0, color: '#ffa500'}}>
                            <i className="fa-solid fa-lightbulb"></i> <strong>Tip:</strong> Bookmark your BSCScan page for quick access to your transaction history
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}