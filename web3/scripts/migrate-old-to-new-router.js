const hre = require('hardhat');

async function main() {
  const USER_ADDRESS = '0x45F3a935F36ebbe3be3da8C9c14ff95023403acd';
  const OLD_ROUTER = '0xc97cd673e68419247ff4c6f3da0Ef73F1AD84030';
  const NEW_ROUTER = '0xe80b3e256098edD086b2A9f9d70e2422b2671EEE';
  const NEW_LOYALTY = '0x0f37929e8E967083a88B30bFfF3B1CFF346b7Dc2';
  
  console.log('🔄 Migrating Stake from Old Router to New Router\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const [deployer] = await hre.ethers.getSigners();
  console.log('Executing as:', deployer.address);
  console.log('User:', USER_ADDRESS, '\n');

  const oldRouter = await hre.ethers.getContractAt('StakingRouterBNB', OLD_ROUTER);
  const newRouter = await hre.ethers.getContractAt('StakingRouterBNB', NEW_ROUTER);
  const newLoyalty = await hre.ethers.getContractAt('LoyaltyPoints', NEW_LOYALTY);
  
  // Check old router stake
  const oldShares = await oldRouter.sharesOf(USER_ADDRESS);
  console.log('📊 Old Router Stake:', hre.ethers.formatEther(oldShares), 'BNB');
  
  if (oldShares === 0n) {
    console.log('⚠️  No stake in old router');
    return;
  }
  
  // Record the stake amount in new loyalty contract
  console.log('\n📝 Recording stake in new loyalty contract...');
  let tx = await newLoyalty.adminRecordStake(
    USER_ADDRESS,
    oldShares,
    hre.ethers.ZeroAddress
  );
  await tx.wait();
  console.log('✅ Stake recorded in loyalty contract');
  
  // Check new loyalty stats
  const stats = await newLoyalty.getUserStats(USER_ADDRESS);
  console.log('\n📊 Loyalty Stats:');
  console.log('Total Stars:', stats[0].toString());
  console.log('Staking Stars:', stats[1].toString());
  console.log('Referral Stars:', stats[2].toString());
  
  const stakeCount = await newLoyalty.userStakeCount(USER_ADDRESS);
  console.log('Stake Count:', stakeCount.toString());
  
  // Wait and check pending stars
  console.log('\n⏳ Waiting 5 seconds for stars to accumulate...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const pending = await newLoyalty.getTotalPendingStars(USER_ADDRESS);
  const pendingFormatted = Number(pending) / 1e18;
  console.log('Pending Stars:', pendingFormatted.toFixed(4));
  
  const expectedPerHour = (Number(hre.ethers.formatEther(oldShares)) / 0.0001) / 24;
  console.log('Expected per hour:', expectedPerHour.toFixed(2));
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('🎉 Migration Complete!\n');
  console.log('⚠️  IMPORTANT NOTES:');
  console.log('1. Your stake is still in the OLD router for actual BNB');
  console.log('2. The NEW loyalty contract now tracks stars for this stake');
  console.log('3. To fully migrate:');
  console.log('   a) Request unstake from old router');
  console.log('   b) Wait cooldown (or use force withdraw in new router)');
  console.log('   c) Re-stake in new router');
  console.log('\n💡 For testing, you can:');
  console.log('   - Use "Request Unstake" on dashboard');
  console.log('   - Use "Force Withdraw" to skip cooldown');
  console.log('   - Re-stake to get into new router');
  console.log('═══════════════════════════════════════════════════════════════');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
