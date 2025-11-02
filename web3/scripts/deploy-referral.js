const hre = require('hardhat');

async function main() {
  const ROUTER_ADDRESS = '0x6A17e9aa65f9121eCd1dB3b164B93227eEd3708C';
  
  console.log('🚀 Deploying ReferralSystem Contract\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying with account:', deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log('Account balance:', hre.ethers.formatEther(balance), 'BNB\n');

  // Deploy ReferralSystem
  console.log('Deploying ReferralSystem...');
  const ReferralSystem = await hre.ethers.getContractFactory('ReferralSystem');
  const referralSystem = await ReferralSystem.deploy(ROUTER_ADDRESS);
  await referralSystem.waitForDeployment();
  
  const referralAddress = await referralSystem.getAddress();
  console.log('✅ ReferralSystem deployed:', referralAddress);
  
  // Display configuration
  console.log('\n📋 Contract Configuration:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Router:', ROUTER_ADDRESS);
  console.log('Owner:', deployer.address);
  
  console.log('\n💎 Tier System:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Tier 0 - STARTER:  1-10 referrals   → 5% commission');
  console.log('Tier 1 - BRONZE:   11-25 referrals  → 7% commission');
  console.log('Tier 2 - SILVER:   26-50 referrals  → 10% commission');
  console.log('Tier 3 - GOLD:     51-100 referrals → 12% commission');
  console.log('Tier 4 - PLATINUM: 100+ referrals   → 15% commission');
  
  console.log('\n📝 Next Steps:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('1. Update .env.local:');
  console.log(`   NEXT_PUBLIC_REFERRAL_ADDRESS=${referralAddress}`);
  console.log('\n2. Test the referral system:');
  console.log('   npx hardhat run scripts/test-referral.js --network bscTestnet');
  console.log('\n3. Export ABI:');
  console.log('   npx hardhat run scripts/export-abi.js');
  
  console.log('\n═══════════════════════════════════════════════════════════════\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
