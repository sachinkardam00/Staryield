'use client';

import { CustomConnectButton } from '@/components/UI/CustomConnectButton';
import { useAccount, useBalance, useWriteContract, useReadContract, usePublicClient } from 'wagmi';
import { useAPY } from '@/hooks/useAPY';
import { parseEther, formatEther } from 'viem';
import { StakingRouterBNBABI } from '@/contracts/abi/StakingRouterBNB';
import { SimpleMockAdapterABI } from '@/contracts/abi/SimpleMockAdapter';
import { LoyaltyPointsABI } from '@/contracts/abi/LoyaltyPoints';
import { ReferralSystemABI } from '@/contracts/abi/ReferralSystem';
import { getRouterAddress, getLoyaltyAddress, getReferralAddress } from '@/contracts/addresses';
import Link from 'next/link';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });
  const publicClient = usePublicClient();
  const [activeTab, setActiveTab] = useState('tab1');
  const [referrerAddress, setReferrerAddress] = useState<string | null>(null);
  const [hasRegistered, setHasRegistered] = useState(false);
  const searchParams = useSearchParams();
  const routerAddress = useMemo(() => getRouterAddress(), []);
  const referralAddress = useMemo(() => getReferralAddress(), []);
  
  // Loading states for transactions
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isForceWithdrawing, setIsForceWithdrawing] = useState(false);
  const [txStatus, setTxStatus] = useState<string>('');

  // Read user's staked shares
  const { data: userShares, refetch: refetchShares } = useReadContract({
    address: routerAddress,
    abi: StakingRouterBNBABI,
    functionName: 'sharesOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!routerAddress }
  });

  // Read total principal to calculate BNB value
  const { data: totalPrincipal } = useReadContract({
    address: routerAddress,
    abi: StakingRouterBNBABI,
    functionName: 'totalPrincipal',
    query: { enabled: !!routerAddress }
  });

  // Read total shares
  const { data: totalShares } = useReadContract({
    address: routerAddress,
    abi: StakingRouterBNBABI,
    functionName: 'totalShares',
    query: { enabled: !!routerAddress }
  });

  // Read pending rewards from router (already harvested rewards)
  const { data: pendingRewards, refetch: refetchRewards } = useReadContract({
    address: routerAddress,
    abi: StakingRouterBNBABI,
    functionName: 'pendingRewards',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!routerAddress }
  });

  // Read pending rewards from adapter (real-time accumulating rewards)
  const adapterAddress = process.env.NEXT_PUBLIC_ADAPTER_ADDRESS as `0x${string}`;
  const { data: adapterPendingRewards, refetch: refetchAdapterRewards } = useReadContract({
    address: adapterAddress,
    abi: SimpleMockAdapterABI,
    functionName: 'calculatePendingRewards',
    query: { 
      enabled: !!adapterAddress,
      refetchInterval: 5000 // Refresh every 5 seconds to show growing rewards
    }
  });

  // Calculate user's share of adapter rewards based on their stake proportion
  const userAdapterRewards = useMemo(() => {
    if (!userShares || !totalShares || totalShares === BigInt(0) || !adapterPendingRewards) {
      return BigInt(0);
    }
    // User's rewards = (their shares / total shares) * total adapter rewards
    return (userShares * adapterPendingRewards) / totalShares;
  }, [userShares, totalShares, adapterPendingRewards]);

  // ============ Loyalty Points Integration ============
  const loyaltyAddress = useMemo(() => getLoyaltyAddress(), []);

  // Read user's loyalty stats
  const { data: loyaltyStats, refetch: refetchLoyalty } = useReadContract({
    address: loyaltyAddress,
    abi: LoyaltyPointsABI,
    functionName: 'getUserStats',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!loyaltyAddress,
      refetchInterval: 10000 // Refresh every 10 seconds
    }
  });

  // Read total pending stars (unclaimed)
  const { data: pendingStars } = useReadContract({
    address: loyaltyAddress,
    abi: LoyaltyPointsABI,
    functionName: 'getTotalPendingStars',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!loyaltyAddress,
      refetchInterval: 10000
    }
  });

  // Read referral count from loyalty contract
  const { data: loyaltyReferralCount } = useReadContract({
    address: loyaltyAddress,
    abi: LoyaltyPointsABI,
    functionName: 'getUserStats',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!loyaltyAddress,
      select: (data) => data ? Number(data[3]) : 0 // Extract referralCount from tuple
    }
  });

  // Parse loyalty stats - ensure all values are numbers
  const totalStars = loyaltyStats && loyaltyStats[0] !== undefined ? Number(loyaltyStats[0]) : 0;
  const stakingStars = loyaltyStats && loyaltyStats[1] !== undefined ? Number(loyaltyStats[1]) : 0;
  const referralStars = loyaltyStats && loyaltyStats[2] !== undefined ? Number(loyaltyStats[2]) : 0;
  // Pending stars are now scaled by 1e18, so divide to get actual value
  const totalPendingStarsNum = pendingStars !== undefined ? Number(pendingStars) / 1e18 : 0;
  const referralCount = loyaltyReferralCount !== undefined ? Number(loyaltyReferralCount) : 0;

  // ============ Referral System Integration ============
  
  // Check if user is already registered
  const { data: userReferralData } = useReadContract({
    address: referralAddress,
    abi: ReferralSystemABI,
    functionName: 'users',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!referralAddress }
  });

  // Register referral hook
  const { writeContract: registerReferral, isPending: isRegistering } = useWriteContract();

  // Capture referrer from URL
  useEffect(() => {
    const ref = searchParams?.get('ref');
    if (ref && ref.startsWith('0x')) {
      setReferrerAddress(ref);
      // Store in localStorage for persistence
      localStorage.setItem('referrer', ref);
    } else {
      // Try to get from localStorage
      const storedRef = localStorage.getItem('referrer');
      if (storedRef) {
        setReferrerAddress(storedRef);
      }
    }
  }, [searchParams]);

  // Auto-register referral when user connects wallet
  useEffect(() => {
    if (!address || !referralAddress || !referrerAddress || hasRegistered) return;
    
    // Check if already registered
    const isRegistered = userReferralData && userReferralData[0]; // isRegistered field
    if (isRegistered) {
      setHasRegistered(true);
      return;
    }

    // Auto-register with referrer
    if (referrerAddress && referrerAddress.toLowerCase() !== address.toLowerCase()) {
      try {
        registerReferral({
          address: referralAddress,
          abi: ReferralSystemABI,
          functionName: 'registerReferral',
          args: [referrerAddress as `0x${string}`],
        });
        setHasRegistered(true);
        console.log('✅ Referral registered:', referrerAddress);
      } catch (error) {
        console.error('Failed to register referral:', error);
      }
    }
  }, [address, referralAddress, referrerAddress, userReferralData, hasRegistered, registerReferral]);

  // Total pending rewards = router pending + user's share of adapter pending (memoized)
  const totalPendingRewards = useMemo(() => 
    (pendingRewards || BigInt(0)) + userAdapterRewards,
    [pendingRewards, userAdapterRewards]
  );

  // Calculate user's staked BNB amount (memoized)
  const userStakedBNB = useMemo(() => 
    userShares && totalPrincipal && totalShares && totalShares > BigInt(0)
      ? (userShares * totalPrincipal) / totalShares
      : BigInt(0),
    [userShares, totalPrincipal, totalShares]
  );
  // Config from env (build-time, memoized). Safe defaults if not provided.
  const REFRESH_MS = useMemo(() => Number(process.env.NEXT_PUBLIC_APY_REFRESH_MS ?? '25000'), []);
  const [F_COMET, F_METEOR, F_SUPERNOVA] = useMemo(() => {
    const raw = (process.env.NEXT_PUBLIC_TIER_FACTORS ?? '0.8,1.2,1.8') as string;
    const parts = raw.split(',').map((s) => Number(s.trim())).filter((n) => isFinite(n) && n > 0);
    return [parts[0] ?? 0.8, parts[1] ?? 1.2, parts[2] ?? 1.8];
  }, []);
  const { data: apyData } = useAPY({ tokenSymbol: 'BNB', refetchInterval: REFRESH_MS });

  useEffect(() => {
    // Add admin class to body
    document.body.className = 'admin';
    
    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.className = '';
    };
  }, []);

  // Number animations for counters (original UI)
  useEffect(() => {
    const initNumberAnimations = () => {
      if (typeof window !== 'undefined' && (window as any).jQuery) {
        const $ = (window as any).jQuery;
        $('.animate-number').each(function(this: any) {
          const $this = $(this);
          const countTo = $this.attr('data-value');
          const countFrom = 0;
          const duration = 3000;

          $({ countNum: countFrom }).animate({
            countNum: countTo
          }, {
            duration: duration,
            easing: 'linear',
            step: function(this: any) {
              $this.text(commaSeparateNumber(Math.floor(this.countNum)));
            },
            complete: function(this: any) {
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

  // (old placeholder handlers removed; real handlers defined below)

  // No dynamic APY text changes in this page to preserve UI/UX
  const fmtPct = (n?: number, dp: number = 2) =>
    typeof n === 'number' && isFinite(n) ? `${n.toFixed(dp)}%` : '—';
  // Contract write helpers
  const { writeContractAsync } = useWriteContract();

  const getActiveInputValue = () => {
    const map: Record<string, string> = { tab1: 'stake-input-1', tab2: 'stake-input-2', tab3: 'stake-input-3' };
    const id = map[activeTab];
    const el = typeof window !== 'undefined' ? document.getElementById(id) as HTMLInputElement | null : null;
    const v = el?.value?.trim() || '';
    return v;
  };

  const handleApprove = useCallback(() => {
    alert('Approval not required for native BNB.');
  }, []);

  const handleStake = useCallback(async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    if (!routerAddress) {
      alert('Router address missing. Set NEXT_PUBLIC_ROUTER_ADDRESS in .env.local');
      return;
    }
    const amountStr = getActiveInputValue();
    const amount = Number(amountStr || '0');
    
    // BSC StakeHub requires minimum 0.1 BNB for delegation
    const MIN_STAKE = 0.1;
    if (!amount || amount <= 0) {
      alert('Enter a valid BNB amount');
      return;
    }
    if (amount < MIN_STAKE) {
      alert(`Minimum stake amount is ${MIN_STAKE} BNB for BSC Testnet.\nThis is required by the BSC StakeHub contract.`);
      return;
    }
    const value = parseEther(amountStr as `${number}`);
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 1800);
    
    setIsStaking(true);
    setTxStatus('Confirming transaction in wallet...');
    
    try {
      setTxStatus('Sending transaction...');
      const hash = await writeContractAsync({
        abi: StakingRouterBNBABI,
        address: routerAddress,
        functionName: 'depositBNB',
        args: [deadline],
        value,
      });
      
      setTxStatus('Transaction submitted! Waiting for confirmation...');
      
      // Wait a bit for transaction to be mined
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setTxStatus('Refreshing data...');
      // Refresh all data after successful stake
      await Promise.all([
        refetchShares(),
        refetchLoyalty()
      ]);
      
      setTxStatus('✅ Stake successful!');
      setTimeout(() => {
        setTxStatus('');
        setIsStaking(false);
      }, 2000);
      
      // Clear input
      const amountInput = document.getElementById(
        activeTab === 'tab1' ? 'stake-input-1' : 
        activeTab === 'tab2' ? 'stake-input-2' : 'stake-input-3'
      ) as HTMLInputElement;
      if (amountInput) amountInput.value = '';
      
    } catch (e: any) {
      console.error(e);
      setTxStatus('');
      setIsStaking(false);
      alert(e?.shortMessage || e?.message || 'Failed to stake');
    }
  }, [isConnected, routerAddress, writeContractAsync, refetchShares, refetchLoyalty, getActiveInputValue, activeTab]);

  const handleUnstake = useCallback(async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    if (!routerAddress) {
      alert('Router address missing');
      return;
    }
    
    console.log('User shares:', userShares?.toString());
    
    if (!userShares || userShares === BigInt(0)) {
      alert('You have no staked BNB to unstake. Your current shares: ' + (userShares?.toString() || '0'));
      return;
    }

    const currentStaked = formatEther(userShares);
    
    // Ask user for custom amount or all
    const amountStr = prompt(`Enter amount to unstake (BNB):\n\nYou have ${currentStaked} BNB staked.\nEnter amount or leave empty to unstake all:`);
    
    // If user cancels, return
    if (amountStr === null) return;
    
    let sharesToUnstake: bigint;
    
    // If empty or "all", unstake everything
    if (amountStr === '' || amountStr.toLowerCase() === 'all') {
      sharesToUnstake = userShares;
    } else {
      // Parse custom amount
      try {
        const requestedAmount = parseFloat(amountStr);
        const maxAmount = parseFloat(currentStaked);
        
        if (isNaN(requestedAmount) || requestedAmount <= 0) {
          alert('Invalid amount. Please enter a positive number.');
          return;
        }
        
        if (requestedAmount > maxAmount) {
          alert(`You only have ${currentStaked} BNB staked. Cannot unstake ${requestedAmount} BNB.`);
          return;
        }
        
        // Convert BNB amount to shares (1:1 ratio for now)
        sharesToUnstake = parseEther(requestedAmount.toString());
        
        // Make sure we don't exceed available shares
        if (sharesToUnstake > userShares) {
          sharesToUnstake = userShares;
        }
      } catch (e) {
        alert('Invalid amount format. Please enter a valid number.');
        return;
      }
    }

    setIsUnstaking(true);
    setTxStatus('Preparing unstake request...');
    
    try {
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 1800);
      
      console.log('Unstaking:', {
        shares: sharesToUnstake.toString(),
        bnbAmount: formatEther(sharesToUnstake),
        deadline: deadline.toString(),
        routerAddress
      });
      
      setTxStatus('Confirm transaction in wallet...');
      await writeContractAsync({
        abi: StakingRouterBNBABI,
        address: routerAddress,
        functionName: 'requestUnstake',
        args: [sharesToUnstake, deadline],
      });
      
      setTxStatus('Transaction submitted! Waiting for confirmation...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setTxStatus('Refreshing data...');
      await refetchShares();
      
      setTxStatus(`✅ Unstake request submitted for ${formatEther(sharesToUnstake)} BNB!`);
      setTimeout(() => {
        setTxStatus('');
        setIsUnstaking(false);
      }, 3000);
      
    } catch (e: any) {
      console.error('Unstake error:', e);
      setTxStatus('');
      setIsUnstaking(false);
      const errorMsg = e?.shortMessage || e?.message || JSON.stringify(e);
      alert('Failed to unstake: ' + errorMsg);
    }
  }, [isConnected, routerAddress, userShares, writeContractAsync, refetchShares]);

  const handleWithdraw = useCallback(async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    if (!routerAddress) {
      alert('Router address missing');
      return;
    }

    // Get the latest unbond queue index (most recent unstake request)
    const indexStr = prompt('Enter the unbond queue index (usually 0 for first unstake):');
    if (!indexStr) return;

    setIsWithdrawing(true);
    setTxStatus('Preparing withdrawal...');
    
    try {
      const index = BigInt(indexStr);
      console.log('Withdrawing unbonded funds, index:', index.toString());

      setTxStatus('Confirm transaction in wallet...');
      await writeContractAsync({
        abi: StakingRouterBNBABI,
        address: routerAddress,
        functionName: 'withdrawUnbonded',
        args: [index],
      });
      
      setTxStatus('Transaction submitted! Waiting for confirmation...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setTxStatus('Refreshing data...');
      await refetchShares();
      
      setTxStatus('✅ Withdrawal successful! BNB returned to your wallet.');
      setTimeout(() => {
        setTxStatus('');
        setIsWithdrawing(false);
      }, 3000);
      
    } catch (e: any) {
      console.error('Withdraw error:', e);
      setTxStatus('');
      setIsWithdrawing(false);
      const errorMsg = e?.shortMessage || e?.message || JSON.stringify(e);
      alert('Failed to withdraw: ' + errorMsg);
    }
  }, [isConnected, routerAddress, writeContractAsync, refetchShares]);

  const handleForceWithdraw = useCallback(async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }
    if (!routerAddress || !publicClient) {
      alert('Router address or client missing');
      return;
    }

    setIsForceWithdrawing(true);
    setTxStatus('🔍 Finding your unclaimed unbond requests...');
    
    try {
      // Get queue length using publicClient
      const queueLength = await publicClient.readContract({
        address: routerAddress,
        abi: StakingRouterBNBABI,
        functionName: 'queueLength',
      }) as bigint;
      
      console.log('Checking', queueLength.toString(), 'unbond requests...');
      
      // Find first unclaimed request belonging to user
      let foundIndex = -1;
      for (let i = 0; i < Number(queueLength); i++) {
        const result = await publicClient.readContract({
          address: routerAddress,
          abi: StakingRouterBNBABI,
          functionName: 'unbondQueue',
          args: [BigInt(i)],
        }) as any;
        
        // The contract returns an array: [user, shares, bnbAmount, readyAt, claimed]
        const reqUser = result[0] || result.user;
        const reqBnbAmount = result[2] || result.bnbAmount;
        const reqClaimed = result[4] !== undefined ? result[4] : result.claimed;
        
        console.log(`Index ${i}: user=${reqUser}, claimed=${reqClaimed}`);
        
        if (reqUser && reqUser.toLowerCase() === address.toLowerCase() && !reqClaimed) {
          foundIndex = i;
          console.log('✅ Found unclaimed request at index:', i, 'Amount:', formatEther(reqBnbAmount), 'BNB');
          break;
        }
      }
      
      if (foundIndex === -1) {
        alert('No unclaimed unbond requests found. Please unstake first.');
        setIsForceWithdrawing(false);
        setTxStatus('');
        return;
      }
      
      const index = BigInt(foundIndex);
      setTxStatus('⚡ Force withdrawing index ' + foundIndex + ' (bypassing cooldown)...');
      console.log('⚠️ FORCE withdrawing (bypassing cooldown), index:', index.toString());

      setTxStatus('Confirm transaction in wallet...');
      await writeContractAsync({
        abi: StakingRouterBNBABI,
        address: routerAddress,
        functionName: 'forceWithdrawUnbonded',
        args: [index],
      });
      
      setTxStatus('Transaction submitted! Waiting for confirmation...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setTxStatus('Refreshing data...');
      await refetchShares();
      
      setTxStatus('✅ Force withdrawal successful! BNB returned instantly.');
      setTimeout(() => {
        setTxStatus('');
        setIsForceWithdrawing(false);
      }, 3000);
      
    } catch (e: any) {
      console.error('Force withdraw error:', e);
      setTxStatus('');
      setIsForceWithdrawing(false);
      const errorMsg = e?.shortMessage || e?.message || JSON.stringify(e);
      alert('Failed to force withdraw: ' + errorMsg);
    }
  }, [isConnected, address, routerAddress, publicClient, writeContractAsync, refetchShares]);

  const handleHarvest = useCallback(async () => {
    if (!isConnected || !routerAddress) return;
    
    try {
      console.log('Harvesting rewards...');
      await writeContractAsync({
        abi: StakingRouterBNBABI,
        address: routerAddress,
        functionName: 'harvest',
        args: [],
      });
      console.log('Harvest successful');
      return true;
    } catch (e: any) {
      console.error('Harvest error:', e);
      return false;
    }
  }, [isConnected, routerAddress, writeContractAsync]);

  const handleClaim = useCallback(async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    if (!routerAddress) {
      alert('Router address missing');
      return;
    }
    
    setIsClaiming(true);
    setTxStatus('Checking pending rewards...');
    
    try {
      // Check if there are rewards to claim
      const adapterAddress = process.env.NEXT_PUBLIC_ADAPTER_ADDRESS as `0x${string}`;
      
      console.log('Checking pending rewards...');
      console.log('Router pending:', pendingRewards?.toString());
      console.log('Adapter pending:', adapterPendingRewards?.toString());
      
      if (!adapterPendingRewards || adapterPendingRewards === BigInt(0)) {
        setTxStatus('');
        setIsClaiming(false);
        alert('No rewards to harvest from adapter yet. Please wait for rewards to accumulate.');
        return;
      }
      
      // Step 1: Harvest rewards from adapter
      setTxStatus('Step 1/2: Harvesting rewards from adapter...');
      console.log('Step 1: Harvesting rewards from adapter...');
      const harvestTx = await writeContractAsync({
        abi: StakingRouterBNBABI,
        address: routerAddress,
        functionName: 'harvest',
        args: [],
      });
      
      console.log('Harvest transaction submitted:', harvestTx);
      setTxStatus('Step 1/2: Harvest transaction submitted! Waiting for confirmation...');
      
      // Wait for harvest confirmation (3 seconds)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Refetch to get updated pendingRewards
      setTxStatus('Updating rewards data...');
      await refetchRewards();
      await refetchAdapterRewards();
      
      // Wait a bit to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 2: Claim the harvested rewards
      setTxStatus('Step 2/2: Claiming harvested rewards...');
      console.log('Step 2: Claiming harvested rewards...');
      const claimTx = await writeContractAsync({
        abi: StakingRouterBNBABI,
        address: routerAddress,
        functionName: 'claim',
        args: [],
      });
      
      console.log('Claim transaction submitted:', claimTx);
      setTxStatus('Step 2/2: Claim transaction submitted! Waiting for confirmation...');
      
      // Wait for claim confirmation and refresh all data
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setTxStatus('Refreshing all data...');
      await Promise.all([
        refetchRewards(),
        refetchAdapterRewards(),
        refetchShares()
      ]);
      
      setTxStatus('✅ Rewards claimed successfully!');
      setTimeout(() => {
        setTxStatus('');
        setIsClaiming(false);
      }, 3000);
      
    } catch (e: any) {
      console.error('Claim error:', e);
      const errorMsg = e?.shortMessage || e?.message || 'Failed to claim';
      
      // Check if it's a user rejection
      if (errorMsg.includes('User rejected') || errorMsg.includes('user rejected')) {
        alert('Transaction cancelled by user');
      } else {
        alert('Error claiming rewards: ' + errorMsg + '\n\nPlease try again or check if you have pending rewards to claim.');
      }
    }
  }, [isConnected, routerAddress, pendingRewards, adapterPendingRewards, writeContractAsync, refetchRewards, refetchAdapterRewards]);

  const tierValues = useCallback((factor: number) => {
    if (!apyData) return { apy: undefined, apr: undefined, daily: undefined } as {
      apy: number | undefined; apr: number | undefined; daily: number | undefined;
    };
    const apr = apyData.apr * factor;
    const apy = apyData.apy * factor;
    const daily = apr / 365;
    return { apy, apr, daily };
  }, [apyData]);

  return (
    <>
      {/* Loading Overlay */}
      {(isStaking || isUnstaking || isClaiming || isWithdrawing || isForceWithdrawing) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%)',
            padding: '40px 50px',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            maxWidth: '500px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid rgba(59, 130, 246, 0.3)',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <h3 style={{color: '#fff', marginBottom: '10px', fontSize: '24px'}}>
              {isStaking && '🚀 Staking...'}
              {isUnstaking && '⏳ Unstaking...'}
              {isClaiming && '💰 Claiming Rewards...'}
              {isWithdrawing && '💸 Withdrawing...'}
              {isForceWithdrawing && '⚡ Force Withdrawing...'}
            </h3>
            <p style={{color: '#94a3b8', fontSize: '16px', margin: 0}}>
              {txStatus || 'Please wait...'}
            </p>
          </div>
        </div>
      )}
      
      {/* Add spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
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
                    <h3>BNB <span>{userStakedBNB ? parseFloat(formatEther(userStakedBNB)).toFixed(4) : '0'}</span></h3>
                  </li>
                  <li>
                    <h4>Total Earned</h4>
                    <h3>BNB <span>{totalPendingRewards ? parseFloat(formatEther(totalPendingRewards)).toFixed(8) : '0'}</span></h3>
                  </li>
                  <li>
                    <h4>Active Staking</h4>
                    <h3>BNB <span>{userStakedBNB ? parseFloat(formatEther(userStakedBNB)).toFixed(4) : '0'}</span></h3>
                  </li>
                  <li>
                    <h4>Withdrawn Earning</h4>
                    <h3>BNB <span className="animate-number" data-value="0">0</span></h3>
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
                    <h4>Unclaimed Earning (Live)</h4>
                    <h3><b className="ticker">BNB</b> <span>{totalPendingRewards ? parseFloat(formatEther(totalPendingRewards)).toFixed(10) : '0'}</span></h3>
                    {adapterPendingRewards && adapterPendingRewards > BigInt(0) && (
                      <p style={{fontSize: '11px', color: '#4CAF50', marginTop: '2px'}}>
                        Growing at 10% APY (updates every 5s)
                      </p>
                    )}
                    <p style={{fontSize: '12px', color: '#888', marginTop: '5px', marginBottom: '10px'}}>
                      Click &quot;Claim Rewards&quot; to harvest and claim in one transaction
                    </p>
                    <button 
                      className="btn btn-blue" 
                      onClick={handleClaim} 
                      disabled={isClaiming || isStaking || isUnstaking || isWithdrawing || isForceWithdrawing}
                      style={{width: '100%', opacity: isClaiming ? 0.6 : 1}}
                    >
                      <i className="fa-regular fa-hand-pointer"></i> {isClaiming ? 'Claiming...' : 'Claim Rewards'}
                    </button>
                    <button 
                      className="btn btn-red" 
                      onClick={handleUnstake} 
                      disabled={isUnstaking || isStaking || isClaiming || isWithdrawing || isForceWithdrawing}
                      style={{marginTop: '10px', display: 'block', width: '100%', opacity: isUnstaking ? 0.6 : 1}}
                    >
                      <i className="fa-solid fa-arrow-down"></i> {isUnstaking ? 'Unstaking...' : 'Request Unstake'}
                    </button>
                    <button 
                      className="btn btn-green" 
                      onClick={handleWithdraw} 
                      disabled={isWithdrawing || isStaking || isClaiming || isUnstaking || isForceWithdrawing}
                      style={{marginTop: '10px', display: 'block', width: '100%', opacity: isWithdrawing ? 0.6 : 1}}
                    >
                      <i className="fa-solid fa-money-bill-wave"></i> {isWithdrawing ? 'Withdrawing...' : 'Withdraw Unstaked'}
                    </button>
                    <button 
                      className="btn btn-skyblue" 
                      onClick={handleForceWithdraw} 
                      disabled={isForceWithdrawing || isStaking || isClaiming || isUnstaking || isWithdrawing}
                      style={{marginTop: '10px', display: 'block', width: '100%', fontSize: '13px', opacity: isForceWithdrawing ? 0.6 : 1}}
                    >
                      <i className="fa-solid fa-bolt"></i> {isForceWithdrawing ? 'Force Withdrawing...' : 'Force Withdraw (Testing)'}
                    </button>
                    <p style={{fontSize: '10px', color: '#ff9800', marginTop: '5px', textAlign: 'center'}}>
                      ⚠️ Bypasses cooldown - Testing only
                    </p>
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
                    <div className={`tab ${activeTab === 'tab1' ? 'active' : ''}`} id="tab1">
                        <div className="staking-wrap">
                          <div className="staking-top">
                            <div className="s-title"><i>1</i><span>Comet Tier</span><b>Stake $BNB</b></div>
                            <div className="s-data">
                              <h4>You Staked</h4>
                              <h5>{userStakedBNB ? parseFloat(formatEther(userStakedBNB)).toFixed(4) : '0'} <b>BNB</b></h5>
                            </div>
                            <div className="s-data">
                              <h4>APY/APR</h4>
                              {(() => { const t = tierValues(F_COMET); return <h5>{fmtPct(t.apy, 0)} / {fmtPct(t.apr, 2)}</h5>; })()}
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
                              {(() => { const t = tierValues(F_COMET); return <h5>{fmtPct(t.daily, 2)}</h5>; })()}
                            </div>
                          </div>
                          <div className="staking-field">
                            <div className="staking-form">
                              <div className="token-ticker">
                                <img src="/images/bnb.png" alt="BNB" />&nbsp; BNB
                              </div>
                              <div className="input-box">
                                <input id="stake-input-1" type="text" placeholder="0.1" />
                                <span className="max">Max</span>
                              </div>
                            </div>
                            <div className="staking-titles">
                              <div id="balance">
                                Balance: {isConnected && balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Connect wallet'}
                              </div>
                              <div style={{color: '#ffa500'}}>⚠️ Minimum: 0.1 BNB</div>
                            </div>
                            <div className="staking-button half clearfix">
                              <div className="s-button">
                                <button className="btn btn-white normal full" onClick={handleApprove}>
                                  Approve
                                </button>
                              </div>
                              <div className="s-button">
                                <button 
                                  className="btn btn-skyblue normal full" 
                                  onClick={handleStake}
                                  disabled={isStaking || isClaiming || isUnstaking || isWithdrawing || isForceWithdrawing}
                                  style={{opacity: isStaking ? 0.6 : 1}}
                                >
                                  {isStaking ? 'Staking...' : 'Stake'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    {/* Meteor Tier */}
                    <div className={`tab ${activeTab === 'tab2' ? 'active' : ''}`} id="tab2">
                        <div className="staking-wrap">
                          {/* Meteor tier content - similar structure with different values */}
                          <div className="staking-top">
                            <div className="s-title"><i>2</i><span>Meteor Tier</span><b>Stake $BNB</b></div>
                            <div className="s-data">
                              <h4>You Staked</h4>
                              <h5>{userStakedBNB ? parseFloat(formatEther(userStakedBNB)).toFixed(4) : '0'} <b>BNB</b></h5>
                            </div>
                            <div className="s-data">
                              <h4>APY/APR</h4>
                              {(() => { const t = tierValues(F_METEOR); return <h5>{fmtPct(t.apy, 0)} / {fmtPct(t.apr, 2)}</h5>; })()}
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
                              {(() => { const t = tierValues(F_METEOR); return <h5>{fmtPct(t.daily, 2)}</h5>; })()}
                            </div>
                          </div>
                          <div className="staking-field">
                            <div className="staking-form">
                              <div className="token-ticker">
                                <img src="/images/bnb.png" alt="BNB" />&nbsp; BNB
                              </div>
                              <div className="input-box">
                                <input id="stake-input-2" type="text" placeholder="0.1" />
                                <span className="max">Max</span>
                              </div>
                            </div>
                            <div className="staking-titles">
                              <div id="balance">
                                Balance: {isConnected && balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Connect wallet'}
                              </div>
                              <div style={{color: '#ffa500'}}>⚠️ Minimum: 0.1 BNB</div>
                            </div>
                            <div className="staking-button half clearfix">
                              <div className="s-button">
                                <button className="btn btn-white normal full" onClick={handleApprove}>
                                  Approve
                                </button>
                              </div>
                              <div className="s-button">
                                <button 
                                  className="btn btn-skyblue normal full" 
                                  onClick={handleStake}
                                  disabled={isStaking || isClaiming || isUnstaking || isWithdrawing || isForceWithdrawing}
                                  style={{opacity: isStaking ? 0.6 : 1}}
                                >
                                  {isStaking ? 'Staking...' : 'Stake'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    {/* Supernova Tier */}
                    <div className={`tab ${activeTab === 'tab3' ? 'active' : ''}`} id="tab3">
                        <div className="staking-wrap">
                          {/* Supernova tier content */}
                          <div className="staking-top">
                            <div className="s-title"><i>3</i><span>Supernova Tier</span><b>Stake $BNB</b></div>
                            <div className="s-data">
                              <h4>You Staked</h4>
                              <h5>{userStakedBNB ? parseFloat(formatEther(userStakedBNB)).toFixed(4) : '0'} <b>BNB</b></h5>
                            </div>
                            <div className="s-data">
                              <h4>APY/APR</h4>
                              {(() => { const t = tierValues(F_SUPERNOVA); return <h5>{fmtPct(t.apy, 0)} / {fmtPct(t.apr, 2)}</h5>; })()}
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
                              {(() => { const t = tierValues(F_SUPERNOVA); return <h5>{fmtPct(t.daily, 2)}</h5>; })()}
                            </div>
                          </div>
                          <div className="staking-field">
                            <div className="staking-form">
                              <div className="token-ticker">
                                <img src="/images/bnb.png" alt="BNB" />&nbsp; BNB
                              </div>
                              <div className="input-box">
                                <input id="stake-input-3" type="text" placeholder="0.1" />
                                <span className="max">Max</span>
                              </div>
                            </div>
                            <div className="staking-titles">
                              <div id="balance">
                                Balance: {isConnected && balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Connect wallet'}
                              </div>
                              <div style={{color: '#ffa500'}}>⚠️ Minimum: 0.1 BNB</div>
                            </div>
                            <div className="staking-button half clearfix">
                              <div className="s-button">
                                <button className="btn btn-white normal full" onClick={handleApprove}>
                                  Approve
                                </button>
                              </div>
                              <div className="s-button">
                                <button 
                                  className="btn btn-skyblue normal full" 
                                  onClick={handleStake}
                                  disabled={isStaking || isClaiming || isUnstaking || isWithdrawing || isForceWithdrawing}
                                  style={{opacity: isStaking ? 0.6 : 1}}
                                >
                                  {isStaking ? 'Staking...' : 'Stake'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
                      <h3>{isConnected ? (totalStars + totalPendingStarsNum).toLocaleString() : '0'}</h3>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="stat-icon">
                      <img src="/images/stat-icon-2.png" alt="Stars by staking" />
                    </div>
                    <div className="stat-details">
                      <h4>Stars earned by staking</h4>
                      <h3>{isConnected ? stakingStars.toLocaleString() : '0'}</h3>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="stat-icon">
                      <img src="/images/stat-icon-3.png" alt="Stars by referrals" />
                    </div>
                    <div className="stat-details">
                      <h4>Stars earned by friend&apos;s staking</h4>
                      <h3>{isConnected ? referralStars.toLocaleString() : '0'}</h3>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <div className="stat-icon">
                      <img src="/images/stat-icon-4.png" alt="Referrals" />
                    </div>
                    <div className="stat-details">
                      <h4>Referrals</h4>
                      <h3>{isConnected ? referralCount.toLocaleString() : '0'}</h3>
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
