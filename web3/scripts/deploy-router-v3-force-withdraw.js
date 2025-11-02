const hre = require('hardhat');

async function main() {
  const ADAPTER_ADDRESS = '0xE62fcEDfE9f31d6B07B18f4cc62d2b6652E5E39C';
  const LOYALTY_ADDRESS = '0x0f37929e8E967083a88B30bFfF3B1CFF346b7Dc2';
  const REFERRAL_ADDRESS = '0xF07320dAE7c42C4Ab6b066C9F55B775580B08B2f';
  const OLD_ROUTER = '0xc97cd673e68419247ff4c6f3da0Ef73F1AD84030';
  
  console.log('🚀 Deploying StakingRouter v3 (with Force Withdraw for Testing)\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  
  console.log('Deploying from:', deployer.address);
  console.log('Balance:', hre.ethers.formatEther(balance), 'BNB\n');
  console.log('Old Router:', OLD_ROUTER, '(will be replaced)');
  console.log('Adapter:', ADAPTER_ADDRESS);
  console.log('Loyalty:', LOYALTY_ADDRESS);
  console.log('Referral:', REFERRAL_ADDRESS, '\n');

  // Deploy new router with 14 day unbonding period
  console.log('Deploying StakingRouterBNB v3...');
  const Router = await hre.ethers.getContractFactory('StakingRouterBNB');
  const unbondingPeriod = 14 * 24 * 60 * 60; // 14 days
  const router = await Router.deploy(deployer.address, unbondingPeriod);
  await router.waitForDeployment();
  const routerAddress = await router.getAddress();

  console.log('✅ Router v3 deployed to:', routerAddress);
  
  // Configure router
  console.log('\n📝 Configuring Router...');
  
  // 1. Allow and set adapter
  let tx = await router.allowAdapter(ADAPTER_ADDRESS, true);
  await tx.wait();
  console.log('✅ Adapter allowed');
  
  tx = await router.setAdapter(ADAPTER_ADDRESS);
  await tx.wait();
  console.log('✅ Adapter set');
  
  // 2. Set loyalty points
  tx = await router.setLoyaltyPoints(LOYALTY_ADDRESS);
  await tx.wait();
  console.log('✅ Loyalty points set');
  
  // Configure adapter to use new router
  console.log('\n📝 Configuring Adapter...');
  const adapter = await hre.ethers.getContractAt('StakingAdapterBNB', ADAPTER_ADDRESS);
  tx = await adapter.setRouter(routerAddress);
  await tx.wait();
  console.log('✅ Adapter configured with new router');
  
  // Configure loyalty to use new router
  console.log('\n📝 Configuring Loyalty Contract...');
  const loyalty = await hre.ethers.getContractAt('LoyaltyPoints', LOYALTY_ADDRESS);
  tx = await loyalty.setStakingRouter(routerAddress);
  await tx.wait();
  console.log('✅ Loyalty configured with new router');

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('🎉 DEPLOYMENT COMPLETE!\n');
  console.log('📝 Update your .env.local:');
  console.log(`NEXT_PUBLIC_ROUTER_ADDRESS=${routerAddress}\n`);
  console.log('✨ New Features in v3:');
  console.log('- forceWithdrawUnbonded() - Instant withdrawal for testing');
  console.log('- Bypasses 14-day cooldown period');
  console.log('- ⚠️  FOR TESTING ONLY - Remove in production\n');
  console.log('🔄 Next Steps:');
  console.log('1. Update .env.local with new router address');
  console.log('2. Export ABIs: npx hardhat run scripts/export-abi.js');
  console.log('3. Restart dev server');
  console.log('4. You can now unstake and withdraw instantly!');
  console.log('\n⚠️  NOTE: Your existing stake is in the old router.');
  console.log('You can either:');
  console.log('a) Migrate stake manually (use admin functions)');
  console.log('b) Unstake from old router and re-stake in new router');
  console.log('═══════════════════════════════════════════════════════════════');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
