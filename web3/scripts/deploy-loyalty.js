const hre = require('hardhat');

async function main() {
  const ROUTER_ADDRESS = '0x6A17e9aa65f9121eCd1dB3b164B93227eEd3708C';
  
  console.log('🌟 Deploying LoyaltyPoints Contract\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying with account:', deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log('Account balance:', hre.ethers.formatEther(balance), 'BNB\n');

  // Deploy LoyaltyPoints
  const LoyaltyPoints = await hre.ethers.getContractFactory('LoyaltyPoints');
  const loyaltyPoints = await LoyaltyPoints.deploy(ROUTER_ADDRESS);
  await loyaltyPoints.waitForDeployment();
  
  const loyaltyAddress = await loyaltyPoints.getAddress();
  
  console.log('\n✅ LoyaltyPoints deployed:', loyaltyAddress);
  console.log('Router:', ROUTER_ADDRESS);
  console.log('Owner:', deployer.address);
  
  // Get final balance
  const finalBalance = await hre.ethers.provider.getBalance(deployer.address);
  console.log('\nBalance after deployment:', hre.ethers.formatEther(finalBalance), 'BNB');
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('🌟 Stars System Configuration:');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('⭐ 1 star per 0.0001 BNB per 24 hours');
  console.log('📊 Example: 0.001 BNB staked = 10 stars per day');
  console.log('🔄 Auto-track staking stars');
  console.log('👥 Auto-track referral stars');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  console.log('Next steps:');
  console.log('1. Update .env.local:');
  console.log(`   NEXT_PUBLIC_LOYALTY_ADDRESS=${loyaltyAddress}`);
  console.log('2. Run: npx hardhat run scripts/export-abi.js');
  console.log('3. Integrate with StakingRouter (call recordStake on stake)');
  console.log('4. Update frontend to display stars\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
