const hre = require('hardhat');

async function main() {
  const USER_ADDRESS = '0x45F3a935F36ebbe3be3da8C9c14ff95023403acd';
  const LOYALTY_ADDRESS = '0x3DB1d7D660d8b8A86d9eBDA20078b55b920433b0';
  
  console.log('🔍 Deep Dive: Loyalty Contract State\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const loyalty = await hre.ethers.getContractAt('LoyaltyPoints', LOYALTY_ADDRESS);
  
  // Check staking router address
  const routerAddr = await loyalty.stakingRouter();
  console.log('Staking Router in Loyalty:', routerAddr);
  console.log('Expected Router:', '0xc97cd673e68419247ff4c6f3da0Ef73F1AD84030');
  console.log('Match:', routerAddr.toLowerCase() === '0xc97cd673e68419247ff4c6f3da0Ef73F1AD84030'.toLowerCase());
  
  // Get user stake count
  const stakeCount = await loyalty.userStakeCount(USER_ADDRESS);
  console.log('\n📊 User Stake Count:', stakeCount.toString());
  
  // Get each stake
  for (let i = 0; i < Number(stakeCount); i++) {
    console.log(`\n--- Stake #${i} ---`);
    const stake = await loyalty.userStakes(USER_ADDRESS, i);
    console.log('Amount:', hre.ethers.formatEther(stake.amount), 'BNB');
    console.log('Start Time:', new Date(Number(stake.startTime) * 1000).toLocaleString());
    console.log('Referrer:', stake.referrer);
    console.log('Is Active:', stake.isActive);
    
    // Calculate pending for this stake
    const now = Math.floor(Date.now() / 1000);
    const timeElapsed = now - Number(stake.startTime);
    const amount = Number(hre.ethers.formatEther(stake.amount));
    const starsPerSecond = amount / 0.0001 / 86400; // stars per second
    const pendingStars = starsPerSecond * timeElapsed;
    
    console.log('Time Elapsed:', timeElapsed, 'seconds (', (timeElapsed / 3600).toFixed(2), 'hours )');
    console.log('Calculated Pending:', pendingStars.toFixed(4), 'stars');
  }
  
  // Try calling getTotalPendingStars directly
  console.log('\n--- Contract Function Call ---');
  const totalPending = await loyalty.getTotalPendingStars(USER_ADDRESS);
  console.log('getTotalPendingStars():', hre.ethers.formatUnits(totalPending, 0));
  
  // Try calling getUserStats
  const stats = await loyalty.getUserStats(USER_ADDRESS);
  console.log('\ngetUserStats():');
  console.log('  [0] totalStars:', stats[0].toString());
  console.log('  [1] stakingStars:', stats[1].toString());
  console.log('  [2] referralStars:', stats[2].toString());
  console.log('  [3] referralCount:', stats[3].toString());
  console.log('  [4] lastUpdateTime:', stats[4].toString());
  
  console.log('\n═══════════════════════════════════════════════════════════════');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
