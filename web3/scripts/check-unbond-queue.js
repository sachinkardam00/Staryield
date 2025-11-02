const hre = require('hardhat');

async function main() {
  const ROUTER_ADDRESS = '0xe80b3e256098edD086b2A9f9d70e2422b2671EEE';
  const USER_ADDRESS = '0x45F3a935F36ebbe3be3da8C9c14ff95023403acd';
  
  console.log('🔍 Checking Router Contract & Unbond Queue\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const router = await hre.ethers.getContractAt('StakingRouterBNB', ROUTER_ADDRESS);
  
  // Check unbond queue length
  const queueLength = await router.queueLength();
  console.log('📊 Unbond Queue Length:', queueLength.toString());
  
  if (Number(queueLength) === 0) {
    console.log('\n⚠️  No unbond requests in queue!');
    console.log('You need to request unstake first before withdrawing.');
    return;
  }
  
  // Check each unbond request
  for (let i = 0; i < Number(queueLength); i++) {
    console.log(`\n--- Unbond Request #${i} ---`);
    const req = await router.unbondQueue(i);
    console.log('User:', req.user);
    console.log('Amount:', hre.ethers.formatEther(req.bnbAmount), 'BNB');
    console.log('Ready At:', new Date(Number(req.readyAt) * 1000).toLocaleString());
    console.log('Claimed:', req.claimed);
    console.log('Is User Match:', req.user.toLowerCase() === USER_ADDRESS.toLowerCase());
    
    // Check cooldown status
    const now = Math.floor(Date.now() / 1000);
    const readyAt = Number(req.readyAt);
    const isReady = now >= readyAt;
    console.log('Cooldown Complete:', isReady);
    console.log('Time remaining:', isReady ? '0 seconds' : `${readyAt - now} seconds`);
  }
  
  // Check router balance
  const routerBalance = await hre.ethers.provider.getBalance(ROUTER_ADDRESS);
  console.log('\n💰 Router Contract Balance:', hre.ethers.formatEther(routerBalance), 'BNB');
  
  // Check if forceWithdrawUnbonded exists
  console.log('\n🔧 Checking forceWithdrawUnbonded function...');
  try {
    const hasFunction = typeof router.forceWithdrawUnbonded === 'function';
    console.log('Function exists:', hasFunction);
    
    if (hasFunction) {
      console.log('✅ forceWithdrawUnbonded is available');
    }
  } catch (e) {
    console.log('❌ forceWithdrawUnbonded not found in contract');
  }
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('💡 Next Steps:');
  console.log('1. Make sure you have an unbond request (Request Unstake first)');
  console.log('2. Check if the request belongs to your address');
  console.log('3. Use the correct index (usually 0 for first request)');
  console.log('4. Make sure the request is not already claimed');
  console.log('═══════════════════════════════════════════════════════════════');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
