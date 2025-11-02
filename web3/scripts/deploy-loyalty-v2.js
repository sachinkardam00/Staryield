const hre = require('hardhat');

async function main() {
  const ROUTER_ADDRESS = '0xc97cd673e68419247ff4c6f3da0Ef73F1AD84030';
  const OLD_LOYALTY_ADDRESS = '0x3DB1d7D660d8b8A86d9eBDA20078b55b920433b0';
  
  console.log('🚀 Deploying Updated LoyaltyPoints Contract (v2 - Real-time Stars)\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  
  console.log('Deploying from:', deployer.address);
  console.log('Balance:', hre.ethers.formatEther(balance), 'BNB\n');
  console.log('Router Address:', ROUTER_ADDRESS);
  console.log('Old Loyalty Address:', OLD_LOYALTY_ADDRESS, '(will be replaced)\n');

  // Deploy new LoyaltyPoints
  console.log('Deploying LoyaltyPoints v2...');
  const LoyaltyPoints = await hre.ethers.getContractFactory('LoyaltyPoints');
  const loyalty = await LoyaltyPoints.deploy(ROUTER_ADDRESS);
  await loyalty.waitForDeployment();
  const loyaltyAddress = await loyalty.getAddress();

  console.log('✅ LoyaltyPoints v2 deployed to:', loyaltyAddress);
  
  // Configure router to use new loyalty contract
  console.log('\nConfiguring StakingRouter...');
  const router = await hre.ethers.getContractAt('StakingRouterBNB', ROUTER_ADDRESS);
  const tx = await router.setLoyaltyPoints(loyaltyAddress);
  await tx.wait();
  console.log('✅ Router configured with new loyalty contract');

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('🎉 DEPLOYMENT COMPLETE!\n');
  console.log('📝 Update your .env.local:');
  console.log(`NEXT_PUBLIC_LOYALTY_ADDRESS=${loyaltyAddress}\n`);
  console.log('✨ Changes in v2:');
  console.log('- Stars now show in REAL-TIME (not waiting 24 hours)');
  console.log('- Fractional stars displayed with decimals');
  console.log('- Formula: (amount / 0.0001 BNB) × (time / 24 hours) = stars');
  console.log('- Example: 0.1 BNB for 1 hour = 41.67 stars');
  console.log('\n⚠️  NOTE: Old stakes from previous contract are not migrated.');
  console.log('Users need to unstake and re-stake for stars to accumulate.\n');
  console.log('═══════════════════════════════════════════════════════════════');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
