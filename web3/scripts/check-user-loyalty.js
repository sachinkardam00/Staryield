const hre = require('hardhat');

async function main() {
  const USER_ADDRESS = '0x45F3a935F36ebbe3be3da8C9c14ff95023403acd';
  const LOYALTY_ADDRESS = '0x3DB1d7D660d8b8A86d9eBDA20078b55b920433b0';
  const ROUTER_ADDRESS = '0xc97cd673e68419247ff4c6f3da0Ef73F1AD84030';
  
  console.log('🔍 Checking Loyalty Stats for:', USER_ADDRESS, '\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const loyalty = await hre.ethers.getContractAt('LoyaltyPoints', LOYALTY_ADDRESS);
  const router = await hre.ethers.getContractAt('StakingRouterBNB', ROUTER_ADDRESS);
  
  // Get user stats
  const stats = await loyalty.getUserStats(USER_ADDRESS);
  console.log('📊 Loyalty Stats:');
  console.log('Total Stars (claimed):', hre.ethers.formatUnits(stats[0], 0));
  console.log('Staking Stars:', hre.ethers.formatUnits(stats[1], 0));
  console.log('Referral Stars:', hre.ethers.formatUnits(stats[2], 0));
  console.log('Referral Count:', stats[3].toString());
  console.log('Last Update Time:', new Date(Number(stats[4]) * 1000).toLocaleString());
  
  // Get pending stars
  const pending = await loyalty.getTotalPendingStars(USER_ADDRESS);
  console.log('\n⏳ Pending Stars (unclaimed):', hre.ethers.formatUnits(pending, 0));
  
  // Get user's current stake amount
  const userShares = await router.sharesOf(USER_ADDRESS);
  console.log('\n💰 Current Stake:');
  console.log('Shares:', hre.ethers.formatEther(userShares), 'BNB');
  
  // Get stake info from loyalty contract
  const stakeInfo = await loyalty.userStakes(USER_ADDRESS, 0);
  console.log('\n📝 Stake Info (Stake ID 0):');
  console.log('Amount:', hre.ethers.formatEther(stakeInfo.amount), 'BNB');
  console.log('Start Time:', new Date(Number(stakeInfo.startTime) * 1000).toLocaleString());
  console.log('Referrer:', stakeInfo.referrer);
  console.log('Is Active:', stakeInfo.isActive);
  
  // Calculate expected stars
  const now = Math.floor(Date.now() / 1000);
  const timeElapsed = now - Number(stakeInfo.startTime);
  const hoursElapsed = timeElapsed / 3600;
  const amount = Number(hre.ethers.formatEther(stakeInfo.amount));
  const expectedStars = (amount / 0.0001) * (hoursElapsed / 24);
  
  console.log('\n🧮 Expected Stars Calculation:');
  console.log('Time Elapsed:', hoursElapsed.toFixed(2), 'hours');
  console.log('Amount Staked:', amount, 'BNB');
  console.log('Expected Stars:', expectedStars.toFixed(2));
  console.log('Formula: (', amount, '/ 0.0001) × (', hoursElapsed.toFixed(2), '/ 24) =', expectedStars.toFixed(2));
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  
  if (Number(pending) === 0 && Number(stats[0]) === 0) {
    console.log('\n⚠️  WARNING: No stars showing!');
    console.log('\nPossible causes:');
    console.log('1. Stake was made with OLD router (before loyalty integration)');
    console.log('2. Not enough time has passed (need at least a few seconds)');
    console.log('3. Stake was not recorded in LoyaltyPoints contract');
    console.log('\n💡 Solution:');
    console.log('If you staked with the old router, you need to:');
    console.log('- Unstake your BNB from the old stake');
    console.log('- Re-stake with the current router');
    console.log('- Stars will start accumulating from the new stake time');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
