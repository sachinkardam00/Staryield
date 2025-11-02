const hre = require('hardhat');

async function main() {
  // Update this after deployment
  const REFERRAL_ADDRESS = '0xF07320dAE7c42C4Ab6b066C9F55B775580B08B2f';
  
  console.log('🧪 Testing ReferralSystem Contract\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const signers = await hre.ethers.getSigners();
  const deployer = signers[0];
  
  const ReferralSystem = await hre.ethers.getContractFactory('ReferralSystem');
  const referral = ReferralSystem.attach(REFERRAL_ADDRESS);
  
  console.log('👛 Test Account:');
  console.log('Deployer:', deployer.address);
  console.log('Referral Contract:', REFERRAL_ADDRESS);
  
  // Get contract info
  const stakingRouter = await referral.stakingRouter();
  console.log('Staking Router:', stakingRouter);
  console.log();

  // Test 1: Get tier thresholds
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 1: Tier Configuration');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    const tierStarter = await referral.TIER_STARTER();
    const tierBronze = await referral.TIER_BRONZE();
    const tierSilver = await referral.TIER_SILVER();
    const tierGold = await referral.TIER_GOLD();
    const tierPlatinum = await referral.TIER_PLATINUM();
    
    const commStarter = await referral.COMMISSION_STARTER();
    const commBronze = await referral.COMMISSION_BRONZE();
    const commSilver = await referral.COMMISSION_SILVER();
    const commGold = await referral.COMMISSION_GOLD();
    const commPlatinum = await referral.COMMISSION_PLATINUM();
    
    console.log('\n✅ Tier Thresholds:');
    console.log(`  Starter:  ${tierStarter} refs → ${Number(commStarter)/100}% commission`);
    console.log(`  Bronze:   ${tierBronze} refs → ${Number(commBronze)/100}% commission`);
    console.log(`  Silver:   ${tierSilver} refs → ${Number(commSilver)/100}% commission`);
    console.log(`  Gold:     ${tierGold} refs → ${Number(commGold)/100}% commission`);
    console.log(`  Platinum: ${tierPlatinum}+ refs → ${Number(commPlatinum)/100}% commission`);
  } catch (error) {
    console.log('❌ Failed:', error.message);
  }
  console.log();
  console.log();

  // Test 2: Check User Stats
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 2: Get User Stats');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    const user = await referral.users(deployer.address);
    const tierName = await referral.getTierName(deployer.address);
    const commissionRate = await referral.getCommissionRate(deployer.address);
    
    console.log('\n✅ Deployer Stats:');
    console.log('  Registered:', user.isRegistered);
    console.log('  Referrer:', user.referrer);
    console.log('  Referral Count:', user.referralCount.toString());
    console.log('  Total Commission:', hre.ethers.formatEther(user.totalCommission), 'BNB');
    console.log('  Claimable:', hre.ethers.formatEther(user.claimableCommission), 'BNB');
    console.log('  Tier:', user.tier, `(${tierName})`);
    console.log('  Commission Rate:', Number(commissionRate)/100, '%');
    console.log('  XP Points:', user.xp.toString());
  } catch (error) {
    console.log('❌ Failed:', error.message);
  }
  
  console.log();
  
  // Test 3: Check Contract Owner  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 3: Contract Ownership');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    const owner = await referral.owner();
    console.log('\n✅ Contract Owner:', owner);
    console.log('Deployer is Owner:', owner.toLowerCase() === deployer.address.toLowerCase());
  } catch (error) {
    console.log('❌ Failed:', error.message);
  }
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('✅ ALL TESTS COMPLETED!');
  console.log('═══════════════════════════════════════════════════════════════\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
