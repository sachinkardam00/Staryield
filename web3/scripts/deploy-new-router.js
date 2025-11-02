const hre = require('hardhat');

async function main() {
  const UNBONDING_SECONDS = 7 * 24 * 60 * 60; // 7 days
  
  console.log('🚀 Deploying NEW Router with Emergency Withdraw Function');

  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying with account:', deployer.address);
  console.log('Account balance:', hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), 'BNB');

  // Deploy new router
  console.log('\nDeploying StakingRouterBNB...');
  const Router = await hre.ethers.getContractFactory('StakingRouterBNB');
  const router = await Router.deploy(deployer.address, UNBONDING_SECONDS);
  await router.waitForDeployment();

  const routerAddress = await router.getAddress();
  console.log('✅ New Router deployed:', routerAddress);

  // Get existing adapter
  const adapterAddress = '0xE62fcEDfE9f31d6B07B18f4cc62d2b6652E5E39C';
  console.log('\nUsing existing adapter:', adapterAddress);

  // Configure router
  console.log('\nConfiguring router...');
  await (await router.allowAdapter(adapterAddress, true)).wait();
  console.log('✅ Adapter allowed');

  await (await router.setAdapter(adapterAddress)).wait();
  console.log('✅ Adapter set as active');

  // Update adapter to point to new router
  console.log('\nUpdating adapter router address...');
  const Adapter = await hre.ethers.getContractFactory('SimpleMockAdapter');
  const adapter = Adapter.attach(adapterAddress);
  
  try {
    await (await adapter.setRouter(routerAddress)).wait();
    console.log('✅ Adapter updated to new router');
  } catch (error) {
    console.log('⚠️  Could not update adapter - you may not be the owner');
    console.log('   Manually update adapter if needed');
  }

  console.log('\n📋 Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('OLD Router: 0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78 (0.8 BNB locked)');
  console.log('NEW Router:', routerAddress);
  console.log('Adapter:    ', adapterAddress);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  console.log('\n📝 Update .env.local:');
  console.log(`NEXT_PUBLIC_ROUTER_ADDRESS=${routerAddress}`);
  console.log(`NEXT_PUBLIC_ADAPTER_ADDRESS=${adapterAddress}`);
  
  console.log('\n⚠️  Important Notes:');
  console.log('1. Old router has 0.8 BNB that is now inaccessible');
  console.log('2. Users with stakes in old router need to migrate');
  console.log('3. Update frontend .env.local with new router address');
  console.log('4. New router has emergencyWithdrawBNB() function');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
