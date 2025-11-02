const hre = require('hardhat');

async function main() {
  const ROUTER = '0x321eCab2d08029De195E11ae43a4a7Efe9674274';
  const ADAPTER = '0xE62fcEDfE9f31d6B07B18f4cc62d2b6652E5E39C';
  const TX_HASH = '0x6689fe0f2c99ba34441ef9d19d1f5f493fc1a0d4fe85d4b88cd7cbe725c449f2';
  
  console.log('🔍 DIAGNOSING MISSING BNB\n');

  // Get transaction receipt
  const receipt = await hre.ethers.provider.getTransactionReceipt(TX_HASH);
  const tx = await hre.ethers.provider.getTransaction(TX_HASH);
  
  console.log('📋 Transaction Details:');
  console.log('  From:', tx.from);
  console.log('  To (Router):', tx.to);
  console.log('  Value sent:', hre.ethers.formatEther(tx.value), 'BNB');
  console.log('  Status:', receipt.status === 1 ? '✅ Success' : '❌ Failed');
  console.log('  Gas used:', receipt.gasUsed.toString());
  
  // Check logs/events
  console.log('\n📝 Events emitted:', receipt.logs.length);
  
  // Parse events
  const Router = await hre.ethers.getContractFactory('StakingRouterBNB');
  const router = Router.attach(ROUTER);
  
  for (const log of receipt.logs) {
    try {
      const parsed = router.interface.parseLog({
        topics: log.topics,
        data: log.data
      });
      if (parsed) {
        console.log(`  Event: ${parsed.name}`);
        console.log('  Args:', parsed.args);
      }
    } catch (e) {
      // Not a router event, try adapter
      try {
        const Adapter = await hre.ethers.getContractFactory('SimpleMockAdapter');
        const adapter = Adapter.attach(ADAPTER);
        const parsed = adapter.interface.parseLog({
          topics: log.topics,
          data: log.data
        });
        if (parsed) {
          console.log(`  Event: ${parsed.name}`);
          console.log('  Args:', parsed.args);
        }
      } catch (e2) {
        // Unknown event
      }
    }
  }
  
  // Check current balances
  console.log('\n💰 Current Balances:');
  const routerBal = await hre.ethers.provider.getBalance(ROUTER);
  const adapterBal = await hre.ethers.provider.getBalance(ADAPTER);
  console.log('  Router:', hre.ethers.formatEther(routerBal), 'BNB');
  console.log('  Adapter:', hre.ethers.formatEther(adapterBal), 'BNB');
  
  // Check contract state
  const Adapter = await hre.ethers.getContractFactory('SimpleMockAdapter');
  const adapter = Adapter.attach(ADAPTER);
  const totalStaked = await adapter.totalStaked();
  
  console.log('\n📊 Contract State:');
  console.log('  Adapter.totalStaked:', hre.ethers.formatEther(totalStaked), 'BNB');
  console.log('  Adapter.balance:', hre.ethers.formatEther(adapterBal), 'BNB');
  console.log('  ⚠️  MISMATCH:', totalStaked > adapterBal ? 'YES - BNB MISSING!' : 'NO');
  
  if (totalStaked > adapterBal) {
    const missing = totalStaked - adapterBal;
    console.log('\n❌ CRITICAL: Missing', hre.ethers.formatEther(missing), 'BNB!');
    console.log('  The adapter THINKS it has', hre.ethers.formatEther(totalStaked), 'BNB staked');
    console.log('  But it ACTUALLY has', hre.ethers.formatEther(adapterBal), 'BNB');
    console.log('\n💡 Possible causes:');
    console.log('  1. stake() function not receiving BNB properly');
    console.log('  2. BNB being forwarded elsewhere by mistake');
    console.log('  3. Another transaction consumed the balance');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
