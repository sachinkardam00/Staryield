const hre = require('hardhat');

async function main() {
  const UNBONDING_PERIOD = 14 * 24 * 60 * 60; // 14 days
  const ADAPTER_ADDRESS = '0xE62fcEDfE9f31d6B07B18f4cc62d2b6652E5E39C';
  const LOYALTY_ADDRESS = '0x3DB1d7D660d8b8A86d9eBDA20078b55b920433b0';
  
  console.log('🔄 Deploying Updated StakingRouter with Loyalty Integration\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying with account:', deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log('Account balance:', hre.ethers.formatEther(balance), 'BNB\n');

  // Deploy new StakingRouterBNB
  const StakingRouterBNB = await hre.ethers.getContractFactory('StakingRouterBNB');
  const router = await StakingRouterBNB.deploy(deployer.address, UNBONDING_PERIOD);
  await router.waitForDeployment();
  
  const routerAddress = await router.getAddress();
  
  console.log('\n✅ StakingRouterBNB deployed:', routerAddress);
  console.log('Owner:', deployer.address);
  console.log('Unbonding period:', UNBONDING_PERIOD / 86400, 'days');
  
  // Configure router
  console.log('\n⚙️  Configuring router...');
  
  // Allow adapter
  const tx1 = await router.allowAdapter(ADAPTER_ADDRESS, true);
  await tx1.wait();
  console.log('✅ Adapter allowed:', ADAPTER_ADDRESS);
  
  // Set adapter
  const tx2 = await router.setAdapter(ADAPTER_ADDRESS);
  await tx2.wait();
  console.log('✅ Adapter set');
  
  // Set loyalty points
  const tx3 = await router.setLoyaltyPoints(LOYALTY_ADDRESS);
  await tx3.wait();
  console.log('✅ Loyalty Points set:', LOYALTY_ADDRESS);
  
  // Get final balance
  const finalBalance = await hre.ethers.provider.getBalance(deployer.address);
  console.log('\nBalance after deployment:', hre.ethers.formatEther(finalBalance), 'BNB');
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('🌟 Loyalty Integration Active!');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('When users stake:');
  console.log('1. Stake is recorded in LoyaltyPoints contract');
  console.log('2. Stars automatically accumulate (1 star per 0.0001 BNB per 24h)');
  console.log('3. Referrers earn matching stars');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  console.log('⚠️  IMPORTANT - Update .env.local:');
  console.log(`NEXT_PUBLIC_ROUTER_ADDRESS=${routerAddress}`);
  console.log('\n📝 Next steps:');
  console.log('1. Update adapter to use new router:');
  console.log(`   adapter.setRouter("${routerAddress}")`);
  console.log('2. Update loyalty contract router (if needed)');
  console.log('3. Update frontend .env.local');
  console.log('4. Test staking flow\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
