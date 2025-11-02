const hre = require('hardhat');

async function main() {
  const NEW_ROUTER = '0x321eCab2d08029De195E11ae43a4a7Efe9674274';
  const ADAPTER = '0xE62fcEDfE9f31d6B07B18f4cc62d2b6652E5E39C';
  
  console.log('🔍 Verifying Contract Setup\n');

  const [deployer] = await hre.ethers.getSigners();
  console.log('Your wallet:', deployer.address);
  console.log('Balance:', hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), 'BNB\n');

  // Check Router
  console.log('📋 NEW ROUTER:', NEW_ROUTER);
  const Router = await hre.ethers.getContractFactory('StakingRouterBNB');
  const router = Router.attach(NEW_ROUTER);
  
  try {
    const owner = await router.owner();
    const adapter = await router.adapter();
    const paused = await router.paused();
    const totalShares = await router.totalShares();
    const totalPrincipal = await router.totalPrincipal();
    const routerBalance = await hre.ethers.provider.getBalance(NEW_ROUTER);
    
    console.log('  Owner:', owner);
    console.log('  Active Adapter:', adapter);
    console.log('  Paused:', paused);
    console.log('  Total Shares:', totalShares.toString());
    console.log('  Total Principal:', hre.ethers.formatEther(totalPrincipal), 'BNB');
    console.log('  Balance:', hre.ethers.formatEther(routerBalance), 'BNB');
    
    if (paused) {
      console.log('  ❌ ROUTER IS PAUSED - needs unpause()');
    }
    
    if (adapter.toLowerCase() !== ADAPTER.toLowerCase()) {
      console.log('  ❌ WRONG ADAPTER - expected', ADAPTER);
    }
  } catch (error) {
    console.log('  ❌ ERROR:', error.message);
  }

  // Check Adapter
  console.log('\n📋 ADAPTER:', ADAPTER);
  const Adapter = await hre.ethers.getContractFactory('SimpleMockAdapter');
  const adapterContract = Adapter.attach(ADAPTER);
  
  try {
    const adapterOwner = await adapterContract.owner();
    const adapterRouter = await adapterContract.router();
    const totalStaked = await adapterContract.totalStaked();
    const adapterBalance = await hre.ethers.provider.getBalance(ADAPTER);
    const lastHarvest = await adapterContract.lastHarvestTime();
    
    console.log('  Owner:', adapterOwner);
    console.log('  Router:', adapterRouter);
    console.log('  Total Staked:', hre.ethers.formatEther(totalStaked), 'BNB');
    console.log('  Balance:', hre.ethers.formatEther(adapterBalance), 'BNB');
    console.log('  Last Harvest:', new Date(Number(lastHarvest) * 1000).toLocaleString());
    
    if (adapterRouter.toLowerCase() !== NEW_ROUTER.toLowerCase()) {
      console.log('  ❌ WRONG ROUTER - adapter points to:', adapterRouter);
      console.log('  ❌ Should point to:', NEW_ROUTER);
    }
  } catch (error) {
    console.log('  ❌ ERROR:', error.message);
  }

  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎯 DIAGNOSIS:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const adapterRouter = await adapterContract.router();
  const routerAdapter = await router.adapter();
  const routerPaused = await router.paused();
  
  if (routerPaused) {
    console.log('❌ Issue: Router is PAUSED');
    console.log('   Fix: Run unpause() on router');
  }
  
  if (adapterRouter.toLowerCase() !== NEW_ROUTER.toLowerCase()) {
    console.log('❌ Issue: Adapter points to wrong router');
    console.log('   Current:', adapterRouter);
    console.log('   Should be:', NEW_ROUTER);
    console.log('   Fix: adapter.setRouter(NEW_ROUTER)');
  }
  
  if (routerAdapter.toLowerCase() !== ADAPTER.toLowerCase()) {
    console.log('❌ Issue: Router points to wrong adapter');
    console.log('   Current:', routerAdapter);
    console.log('   Should be:', ADAPTER);
    console.log('   Fix: router.setAdapter(ADAPTER)');
  }
  
  const adapterBalance = await hre.ethers.provider.getBalance(ADAPTER);
  if (adapterBalance === BigInt(0)) {
    console.log('⚠️  Warning: Adapter has 0 BNB');
    console.log('   Stakes will work but rewards will fail');
    console.log('   Fix: Fund adapter with BNB for rewards');
  }
  
  if (!routerPaused && 
      adapterRouter.toLowerCase() === NEW_ROUTER.toLowerCase() &&
      routerAdapter.toLowerCase() === ADAPTER.toLowerCase()) {
    console.log('✅ All connections are correct!');
    console.log('✅ Ready to use!');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
