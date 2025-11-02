const hre = require('hardhat');

async function main() {
  const ROUTER_ADDRESS = '0xc97cd673e68419247ff4c6f3da0Ef73F1AD84030';
  const REFERRAL_ADDRESS = '0xF07320dAE7c42C4Ab6b066C9F55B775580B08B2f';
  const LOYALTY_ADDRESS = '0x3DB1d7D660d8b8A86d9eBDA20078b55b920433b0';
  
  console.log('🔗 Setting Up Cross-Contract Communication\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const [deployer] = await hre.ethers.getSigners();
  console.log('Account:', deployer.address, '\n');

  // Test referral registration
  console.log('Testing Referral System...\n');
  
  const referral = await hre.ethers.getContractAt('ReferralSystem', REFERRAL_ADDRESS);
  const loyalty = await hre.ethers.getContractAt('LoyaltyPoints', LOYALTY_ADDRESS);
  
  // Check if deployer is registered
  const userData = await referral.users(deployer.address);
  console.log('Deployer registration status:', userData.isRegistered);
  console.log('Deployer referral count:', userData.referralCount.toString());
  console.log('Deployer tier:', userData.tier.toString());
  
  // Check loyalty stats
  const loyaltyStats = await loyalty.getUserStats(deployer.address);
  console.log('\nLoyalty Stats:');
  console.log('Total Stars:', loyaltyStats[0].toString());
  console.log('Staking Stars:', loyaltyStats[1].toString());
  console.log('Referral Stars:', loyaltyStats[2].toString());
  console.log('Referral Count (loyalty):', loyaltyStats[3].toString());
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('✅ System Status Check Complete!');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('\n📝 How Referrals Work:');
  console.log('1. User visits: https://yoursite.com?ref=0xREFERRER_ADDRESS');
  console.log('2. Frontend stores referrer in localStorage');
  console.log('3. When user connects wallet, auto-registers referral');
  console.log('4. When user stakes, both systems record it:');
  console.log('   - LoyaltyPoints: Tracks stars for both user and referrer');
  console.log('   - ReferralSystem: Tracks commission for referrer');
  console.log('\n🎯 For rewards to work:');
  console.log('- User must visit with ?ref= parameter first');
  console.log('- User must be registered in ReferralSystem');
  console.log('- When rewards are distributed, router must call:');
  console.log('  referralSystem.recordCommission(user, rewardAmount)');
  console.log('\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
