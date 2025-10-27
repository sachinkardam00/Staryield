'use client';

import { CustomConnectButton } from '@/components/CustomConnectButton';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TransactionPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    // Add admin class to body
    document.body.className = 'admin';
    
    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.className = '';
    };
  }, []);

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
                <ul className="transaction-list">
                  <li>
                    <div className="trans-item d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <img src="/images/bnb.png" className="trans-icon" alt="BNB" />
                        <div className="trans-amount green">
                          +1.256 <span>BNB</span>
                        </div>
                      </div>
                      <div className="trans-type">Stake</div>
                      <div className="trans-date">29th Feb, 2024</div>
                    </div>
                  </li>
                  <li>
                    <div className="trans-item d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <img src="/images/bnb.png" className="trans-icon" alt="BNB" />
                        <div className="trans-amount red">
                          -1.256 <span>BNB</span>
                        </div>
                      </div>
                      <div className="trans-type">Unstake</div>
                      <div className="trans-date">29th Feb, 2024</div>
                    </div>
                  </li>
                  <li>
                    <div className="trans-item d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <img src="/images/bnb.png" className="trans-icon" alt="BNB" />
                        <div className="trans-amount green">
                          +1.256 <span>BNB</span>
                        </div>
                      </div>
                      <div className="trans-type">Referral Commission</div>
                      <div className="trans-date">29th Feb, 2024</div>
                    </div>
                  </li>
                  <li>
                    <div className="trans-item d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <img src="/images/bnb.png" className="trans-icon" alt="BNB" />
                        <div className="trans-amount red">
                          +1.256 <span>BNB</span>
                        </div>
                      </div>
                      <div className="trans-type">Withdrawal</div>
                      <div className="trans-date">29th Feb, 2024</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}