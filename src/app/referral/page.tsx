'use client';

import { CustomConnectButton } from '@/components/UI/CustomConnectButton';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { ReferralSystemABI } from '@/contracts/abi/ReferralSystem';
import { getReferralAddress } from '@/contracts/addresses';
import { formatEther } from 'viem';

export default function ReferralPage() {
  const { address, isConnected } = useAccount();
  const [referralLink, setReferralLink] = useState('https://staryield.com/refer/0x000000000000000000000000');
  const [isClaiming, setIsClaiming] = useState(false);

  const referralAddress = getReferralAddress();

  // Read user data from contract
  const { data: userData, refetch: refetchUserData } = useReadContract({
    address: referralAddress,
    abi: ReferralSystemABI,
    functionName: 'users',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!referralAddress,
    },
  });

  // Get tier name
  const { data: tierName } = useReadContract({
    address: referralAddress,
    abi: ReferralSystemABI,
    functionName: 'getTierName',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!referralAddress,
    },
  });

  // Get commission rate
  const { data: commissionRate } = useReadContract({
    address: referralAddress,
    abi: ReferralSystemABI,
    functionName: 'getCommissionRate',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!referralAddress,
    },
  });

  // Claim commission hook
  const { data: claimHash, writeContract: claimCommission, isPending: isClaimPending } = useWriteContract();

  const { isLoading: isClaimConfirming, isSuccess: isClaimSuccess } = useWaitForTransactionReceipt({
    hash: claimHash,
  });

  useEffect(() => {
    // Add admin class to body
    document.body.className = 'admin';
    
    // Update referral link when wallet connects
    if (isConnected && address) {
      setReferralLink(`${window.location.origin}?ref=${address}`);
    } else {
      setReferralLink(`${window.location.origin}?ref=0x000000000000000000000000`);
    }
    
    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.className = '';
    };
  }, [isConnected, address]);

  // Handle claim success
  useEffect(() => {
    if (isClaimSuccess) {
      setIsClaiming(false);
      refetchUserData();
      alert('Commission claimed successfully!');
    }
  }, [isClaimSuccess, refetchUserData]);

  // Parse user data
  const referralCount = userData ? Number(userData[2]) : 0;
  const totalCommission = userData ? userData[3] : BigInt(0);
  const claimableCommission = userData ? userData[4] : BigInt(0);
  const userTier = userData ? Number(userData[5]) : 0;
  const xpPoints = userData ? Number(userData[6]) : 0;

  // Calculate withdrawn commission
  const withdrawnCommission = useMemo(() => {
    return totalCommission - claimableCommission;
  }, [totalCommission, claimableCommission]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      alert('Referral link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleClaimCommission = async () => {
    if (!referralAddress || !address) {
      alert('Please connect your wallet');
      return;
    }

    if (claimableCommission === BigInt(0)) {
      alert('No commission to claim');
      return;
    }

    try {
      setIsClaiming(true);
      claimCommission({
        address: referralAddress,
        abi: ReferralSystemABI,
        functionName: 'claimCommission',
      });
    } catch (err) {
      console.error('Failed to claim: ', err);
      setIsClaiming(false);
      alert('Failed to claim commission');
    }
  };

  // Determine tier status for UI
  const getTierStatus = (tier: number) => {
    if (tier < userTier) return 'finished';
    if (tier === userTier) return 'active';
    return 'locked';
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
                <li>
                  <Link href="/dashboard" className="link">Stake</Link>
                </li>
                <li className="active">
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
                  <h3>Referral Stats</h3>
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
                    <h4>Your Referrals</h4>
                    <h3>{referralCount}</h3>
                  </li>
                  <li>
                    <h4>Total Commision</h4>
                    <h3>BNB <span>{parseFloat(formatEther(totalCommission)).toFixed(4)}</span></h3>
                  </li>
                  <li>
                    <h4>Withdrawn Commission</h4>
                    <h3>BNB <span>{parseFloat(formatEther(withdrawnCommission)).toFixed(4)}</span></h3>
                  </li>
                  <li>
                    <h4>Earned XPs</h4>
                    <h3>{xpPoints} <span>XP</span></h3>
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
                    <h4>Unclaimed Commission</h4>
                    <h3><b className="ticker">BNB</b> <span>{parseFloat(formatEther(claimableCommission)).toFixed(4)}</span></h3>
                    <button 
                      className="btn btn-blue" 
                      onClick={handleClaimCommission}
                      disabled={!isConnected || claimableCommission === BigInt(0) || isClaimPending || isClaimConfirming || isClaiming}
                    >
                      <i className="fa-regular fa-hand-pointer"></i> {isClaimPending || isClaimConfirming || isClaiming ? 'Claiming...' : 'Claim'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="referral-link card-box">
                <div className="card-box-title d-flex align-items-center justify-content-between">
                  <h3>Your StarPath Link</h3>
                  <p>Invite Explorers, Harvest Rewards</p>
                </div>
                <div className="link-box d-flex align-items-center">
                  <div className="link-title">
                    <i className="fa-solid fa-link"></i> Referal Link
                  </div>
                  <div className="r-link">
                    {referralLink}
                  </div>
                  <button className="btn btn-skyblue" onClick={copyToClipboard}>
                    Copy
                  </button>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card-box current-level">
                <div className="claim-box d-flex align-items-center">
                  <div className="claim-logo">
                    <img src="/images/users.png" alt="Users" />
                  </div>
                  <div className="claim-box-details">
                    <h4>Current Level</h4>
                    <h3><b className="ticker">{tierName || 'Starter'} Tier</b></h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-body">
        <div className="container">
          <ul className="level-list clearfix">
            <li>
              <div className={`level-box ${getTierStatus(0)}`}>
                <h3>5<span>%</span><b>Commission</b></h3>
                <div className="turnover">1-10 Referrals</div>
                <div className="level">Starter</div>
                <div className="ref-status">
                  <div className={`finished-badge ${getTierStatus(0)}`}>
                    {getTierStatus(0) === 'finished' && <><i className="fa-regular fa-circle-check"></i> Done</>}
                    {getTierStatus(0) === 'active' && <><i className="fa-regular fa-clock"></i> Current</>}
                    {getTierStatus(0) === 'locked' && <><i className="fa-solid fa-lock"></i> Locked</>}
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className={`level-box ${getTierStatus(1)}`}>
                <h3>7<span>%</span><b>Commission</b></h3>
                <div className="turnover">11-25 Referrals</div>
                <div className="level bronze">Bronze</div>
                <div className="ref-status">
                  <div className={`finished-badge ${getTierStatus(1)}`}>
                    {getTierStatus(1) === 'finished' && <><i className="fa-regular fa-circle-check"></i> Done</>}
                    {getTierStatus(1) === 'active' && <><i className="fa-regular fa-clock"></i> Current</>}
                    {getTierStatus(1) === 'locked' && <><i className="fa-solid fa-lock"></i> Locked</>}
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className={`level-box ${getTierStatus(2)}`}>
                <h3>10<span>%</span><b>Commission</b></h3>
                <div className="turnover">26-50 Referrals</div>
                <div className="level silver">Silver</div>
                <div className="ref-status">
                  <div className={`finished-badge ${getTierStatus(2)}`}>
                    {getTierStatus(2) === 'finished' && <><i className="fa-regular fa-circle-check"></i> Done</>}
                    {getTierStatus(2) === 'active' && <><i className="fa-regular fa-clock"></i> Current</>}
                    {getTierStatus(2) === 'locked' && <><i className="fa-solid fa-lock"></i> Locked</>}
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className={`level-box ${getTierStatus(3)}`}>
                <h3>12<span>%</span><b>Commission</b></h3>
                <div className="turnover">51-100 Referrals</div>
                <div className="level gold">Gold</div>
                <div className="ref-status">
                  <div className={`finished-badge ${getTierStatus(3)}`}>
                    {getTierStatus(3) === 'finished' && <><i className="fa-regular fa-circle-check"></i> Done</>}
                    {getTierStatus(3) === 'active' && <><i className="fa-regular fa-clock"></i> Current</>}
                    {getTierStatus(3) === 'locked' && <><i className="fa-solid fa-lock"></i> Locked</>}
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className={`level-box ${getTierStatus(4)}`}>
                <h3>15<span>%</span><b>Commission</b></h3>
                <div className="turnover">100+ Referrals</div>
                <div className="level platinum">Platinum</div>
                <div className="ref-status">
                  <div className={`finished-badge ${getTierStatus(4)}`}>
                    {getTierStatus(4) === 'finished' && <><i className="fa-regular fa-circle-check"></i> Done</>}
                    {getTierStatus(4) === 'active' && <><i className="fa-regular fa-clock"></i> Current</>}
                    {getTierStatus(4) === 'locked' && <><i className="fa-solid fa-lock"></i> Locked</>}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}