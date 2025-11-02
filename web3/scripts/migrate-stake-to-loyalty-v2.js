const hre = require('hardhat');

async function main() {
  const USER_ADDRESS = '0x45F3a935F36ebbe3be3da8C9c14ff95023403acd';
  const ROUTER_ADDRESS = '0xc97cd673e68419247ff4c6f3da0Ef73F1AD84030';
  const NEW_LOYALTY_ADDRESS = '0x0f37929e8E967083a88B30bFfF3B1CFF346b7Dc2';
  
  console.log('🔄 Migrating Existing Stake to New Loyalty Contract\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const [deployer] = await hre.ethers.getSigners();
  console.log('Executing as:', deployer.address, '\n');

  const router = await hre.ethers.getContractAt('StakingRouterBNB', ROUTER_ADDRESS);
  const loyalty = await hre.ethers.getContractAt('LoyaltyPoints', NEW_LOYALTY_ADDRESS);
  
  // Get user's current stake
  const userShares = await router.sharesOf(USER_ADDRESS);
  console.log('User:', USER_ADDRESS);
  console.log('Current Shares:', hre.ethers.formatEther(userShares), 'BNB\n');
  
  if (userShares === 0n) {
    console.log('⚠️  No active stake found');
    return;
  }
  
  // Record the stake in the new loyalty contract
  console.log('Recording stake in new loyalty contract...');
  const tx = await loyalty.adminRecordStake(
    USER_ADDRESS,
    userShares,
    hre.ethers.ZeroAddress // No referrer for migration
  );
  await tx.wait();
  
  console.log('✅ Stake migrated successfully!\n');
  
  // Check the new state
  console.log('Checking new loyalty stats...');
  const stats = await loyalty.getUserStats(USER_ADDRESS);
  console.log('Total Stars:', stats[0].toString());
  console.log('Staking Stars:', stats[1].toString());
  console.log('Referral Stars:', stats[2].toString());
  console.log('Referral Count:', stats[3].toString());
  
  const stakeCount = await loyalty.userStakeCount(USER_ADDRESS);
  console.log('\nStake Count:', stakeCount.toString());
  
  if (Number(stakeCount) > 0) {
    const stakeInfo = await loyalty.userStakes(USER_ADDRESS, 0);
    console.log('\nStake Info:');
    console.log('Amount:', hre.ethers.formatEther(stakeInfo.amount), 'BNB');
    console.log('Start Time:', new Date(Number(stakeInfo.startTime) * 1000).toLocaleString());
    console.log('Is Active:', stakeInfo.isActive);
    
    // Wait a few seconds and check pending stars
    console.log('\nWaiting 5 seconds to accumulate stars...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const pending = await loyalty.getTotalPendingStars(USER_ADDRESS);
    const pendingFormatted = Number(pending) / 1e18;
    console.log('Pending Stars:', pendingFormatted.toFixed(4));
    
    const expectedPerHour = (Number(hre.ethers.formatEther(userShares)) / 0.0001) / 24;
    console.log('Expected per hour:', expectedPerHour.toFixed(2));
    console.log('For 5 seconds:', (expectedPerHour / 720).toFixed(4), 'stars');
  }
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('🎉 Migration Complete!');
  console.log('\nNow your stake will accumulate stars in real-time!');
  console.log('Refresh your dashboard to see the stars update every 10 seconds.');
  console.log('═══════════════════════════════════════════════════════════════');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
