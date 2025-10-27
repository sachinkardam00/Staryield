'use client';

import { CustomConnectButton } from '@/components/CustomConnectButton';
import { FastLink } from '@/components/FastLink';
import { useAccount, useBalance } from 'wagmi';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });
  const [activeTab, setActiveTab] = useState('tab1');

  useEffect(() => {
    // Add admin class to body
    document.body.className = 'admin';
    
    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.className = '';
    };
  }, []);

  useEffect(() => {
    // Initialize number animations
    const initNumberAnimations = () => {
      if (typeof window !== 'undefined' && (window as any).jQuery) {
        const $ = (window as any).jQuery;
        $('.animate-number').each(function() {
          const $this = $(this);
          const countTo = $this.attr('data-value');
          const countFrom = 0;
          const duration = 3000;

          $({ countNum: countFrom }).animate({
            countNum: countTo
          }, {
            duration: duration,
            easing: 'linear',
            step: function() {
              $this.text(commaSeparateNumber(Math.floor(this.countNum)));
            },
            complete: function() {
              $this.text(commaSeparateNumber(this.countNum));
            }
          });
        });
      }
    };

    const commaSeparateNumber = (val: number) => {
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    setTimeout(initNumberAnimations, 1000);
  }, []);

  const handleStake = () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    alert('Stake functionality will be implemented with smart contract integration');
  };

  const handleApprove = () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    alert('Approve functionality will be implemented with smart contract integration');
  };

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
                <li className="active">
                  <Link href="/dashboard" className="link">Stake</Link>
                </li>
                <li>
                  <Link href="/referral" className="link">Affiliate</Link>
                </li>
                <li>
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
            <div className="col-lg-8">
              <div className="card-box">
                <div className="card-box-title d-flex align-items-center justify-content-between">
                  <h3>Overall Portfolio</h3>
                  <div>
                    <a href="#" className="btn btn-green">
                      <i className="fa-solid fa-square-arrow-up-right"></i> Verified Contract
                    </a>
                    <a href="#" className="btn btn-blue">
                      <i className="fa-solid fa-headset"></i> Support
                    </a>
                  </div>
                </div>
                <ul className="top-stats-ul clearfix">
                  <li>
                    <h4>Total Staked</h4>
                    <h3>BNB <span className="animate-number" data-value="1400">1400</span></h3>
                  </li>
                  <li>
                    <h4>Total Earned</h4>
                    <h3>BNB <span className="animate-number" data-value="1000">1000</span></h3>
                  </li>
                  <li>
                    <h4>Active Staking</h4>
                    <h3>BNB <span className="animate-number" data-value="15000">15,000</span></h3>
                  </li>
                  <li>
                    <h4>Withdrawn Earning</h4>
                    <h3>BNB <span className="animate-number" data-value="11000">11,000</span></h3>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card-box">
                <div className="claim-box d-flex align-items-center">
                  <div className="claim-logo">
                    <img src="/images/bnb.png" alt="BNB" />
                  </div>
                  <div className="claim-box-details">
                    <h4>Unclaimed Earning</h4>
                    <h3><b className="ticker">BNB</b> <span className="animate-number" data-value="11000">11,000</span></h3>
                    <button className="btn btn-blue">
                      <i className="fa-regular fa-hand-pointer"></i> Claim
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-body">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="staking-container">
                <div className="staking-tabs tabs">
                  <ul className="tab-links clearfix">
                    <li className={activeTab === 'tab1' ? 'active' : ''}>
                      <a href="#tab1" onClick={(e) => { e.preventDefault(); setActiveTab('tab1'); }}>Comet Tier</a>
                    </li>
                    <li className={activeTab === 'tab2' ? 'active' : ''}>
                      <a href="#tab2" onClick={(e) => { e.preventDefault(); setActiveTab('tab2'); }}>Meteor Tier</a>
                    </li>
                    <li className={activeTab === 'tab3' ? 'active' : ''}>
                      <a href="#tab3" onClick={(e) => { e.preventDefault(); setActiveTab('tab3'); }}>Supernova Tier</a>
                    </li>
                  </ul>
                  <div className="tab-content">
                    {/* Comet Tier */}
                    {activeTab === 'tab1' && (
                      <div className="tab active" id="tab1">
                        <div className="staking-wrap">
                          <div className="staking-top">
                            <div className="s-title"><i>1</i><span>Comet Tier</span><b>Stake $BNB</b></div>
                            <div className="s-data">
                              <h4>You Staked</h4>
                              <h5>0 <b>BNB</b></h5>
                            </div>
                            <div className="s-data">
                              <h4>APY/APR</h4>
                              <h5>1095%</h5>
                            </div>
                            <div className="s-data">
                              <h4>Locked Period</h4>
                              <h5>14 <b>Days</b></h5>
                            </div>
                            <div className="s-data">
                              <h4>Min Investment</h4>
                              <h5>0.1 <b>BNB</b></h5>
                            </div>
                            <div className="s-data">
                              <h4>Daily</h4>
                              <h5>3%</h5>
                            </div>
                          </div>
                          <div className="staking-field">
                            <div className="staking-form">
                              <div className="token-ticker">
                                <img src="/images/bnb.png" alt="BNB" />&nbsp; BNB
                              </div>
                              <div className="input-box">
                                <input type="text" placeholder="0" />
                                <span className="max">Max</span>
                              </div>
                            </div>
                            <div className="staking-titles">
                              <div id="balance">
                                Balance: {isConnected && balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Connect wallet'}
                              </div>
                              <div>Enter Amount Above</div>
                            </div>
                            <div className="staking-button half clearfix">
                              <div className="s-button">
                                <button className="btn btn-white normal full" onClick={handleApprove}>
                                  Approve
                                </button>
                              </div>
                              <div className="s-button">
                                <button className="btn btn-skyblue normal full" onClick={handleStake}>
                                  Stake
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Similar structure for Meteor and Supernova tiers would go here */}
                    {activeTab === 'tab2' && (
                      <div className="tab active" id="tab2">
                        <div className="staking-wrap">
                          {/* Meteor tier content - similar structure with different values */}
                          <div className="staking-top">
                            <div className="s-title"><i>2</i><span>Meteor Tier</span><b>Stake $BNB</b></div>
                            <div className="s-data">
                              <h4>APY/APR</h4>
                              <h5>1825%</h5>
                            </div>
                            <div className="s-data">
                              <h4>Locked Period</h4>
                              <h5>21 <b>Days</b></h5>
                            </div>
                            <div className="s-data">
                              <h4>Min Investment</h4>
                              <h5>1 <b>BNB</b></h5>
                            </div>
                            <div className="s-data">
                              <h4>Daily</h4>
                              <h5>5%</h5>
                            </div>
                          </div>
                          <div className="staking-field">
                            <div className="staking-form">
                              <div className="token-ticker">
                                <img src="/images/bnb.png" alt="BNB" />&nbsp; BNB
                              </div>
                              <div className="input-box">
                                <input type="text" placeholder="0" />
                                <span className="max">Max</span>
                              </div>
                            </div>
                            <div className="staking-titles">
                              <div id="balance">
                                Balance: {isConnected && balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Connect wallet'}
                              </div>
                              <div>Enter Amount Above</div>
                            </div>
                            <div className="staking-button half clearfix">
                              <div className="s-button">
                                <button className="btn btn-white normal full" onClick={handleApprove}>
                                  Approve
                                </button>
                              </div>
                              <div className="s-button">
                                <button className="btn btn-skyblue normal full" onClick={handleStake}>
                                  Stake
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'tab3' && (
                      <div className="tab active" id="tab3">
                        <div className="staking-wrap">
                          {/* Supernova tier content */}
                          <div className="staking-top">
                            <div className="s-title"><i>3</i><span>Supernova Tier</span><b>Stake $BNB</b></div>
                            <div className="s-data">
                              <h4>APY/APR</h4>
                              <h5>2555%</h5>
                            </div>
                            <div className="s-data">
                              <h4>Locked Period</h4>
                              <h5>30 <b>Days</b></h5>
                            </div>
                            <div className="s-data">
                              <h4>Min Investment</h4>
                              <h5>5 <b>BNB</b></h5>
                            </div>
                            <div className="s-data">
                              <h4>Daily</h4>
                              <h5>7%</h5>
                            </div>
                          </div>
                          <div className="staking-field">
                            <div className="staking-form">
                              <div className="token-ticker">
                                <img src="/images/bnb.png" alt="BNB" />&nbsp; BNB
                              </div>
                              <div className="input-box">
                                <input type="text" placeholder="0" />
                                <span className="max">Max</span>
                              </div>
                            </div>
                            <div className="staking-titles">
                              <div id="balance">
                                Balance: {isConnected && balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Connect wallet'}
                              </div>
                              <div>Enter Amount Above</div>
                            </div>
                            <div className="staking-button half clearfix">
                              <div className="s-button">
                                <button className="btn btn-white normal full" onClick={handleApprove}>
                                  Approve
                                </button>
                              </div>
                              <div className="s-button">
                                <button className="btn btn-skyblue normal full" onClick={handleStake}>
                                  Stake
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <h3 className="box-o-title">Loyalty Points (Stars)</h3>
              <div className="card-box point-1">
                <ul className="stat-list">
                  <li className="d-flex align-items-center">
                    <div className="stat-icon">
                      <img src="/images/stat-icon-1.png" alt="Total Stars" />
                    </div>
                    <div className="stat-details">
                      <h4>Total Stars</h4>
                      <h3>14,120</h3>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="stat-icon">
                      <img src="/images/stat-icon-2.png" alt="Stars by staking" />
                    </div>
                    <div className="stat-details">
                      <h4>Stars earned by staking</h4>
                      <h3>5000</h3>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="stat-icon">
                      <img src="/images/stat-icon-3.png" alt="Stars by referrals" />
                    </div>
                    <div className="stat-details">
                      <h4>Stars earned by friend&apos;s staking</h4>
                      <h3>8000</h3>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="stat-icon">
                      <img src="/images/stat-icon-4.png" alt="Referrals" />
                    </div>
                    <div className="stat-details">
                      <h4>Referrals</h4>
                      <h3>1800</h3>
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