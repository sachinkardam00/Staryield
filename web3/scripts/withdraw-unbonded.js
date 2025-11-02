const hre = require('hardhat');

async function main() {
  const ROUTER = '0x6A17e9aa65f9121eCd1dB3b164B93227eEd3708C';
  
  console.log('💰 WITHDRAW UNBONDED BNB\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const [deployer] = await hre.ethers.getSigners();
  console.log('👛 Wallet:', deployer.address);
  
  const Router = await hre.ethers.getContractFactory('StakingRouterBNB');
  const router = Router.attach(ROUTER);

  // Check current balance
  const startBalance = await hre.ethers.provider.getBalance(deployer.address);
  console.log('💰 Current Balance:', hre.ethers.formatEther(startBalance), 'BNB\n');

  // Check unbond queue
  const queueLength = await router.queueLength();
  console.log('📋 Unbond Queue Length:', queueLength.toString());
  
  if (queueLength === BigInt(0)) {
    console.log('❌ No unbond requests found!');
    return;
  }

  console.log('\n📋 UNBOND REQUESTS:\n');
  
  let totalReadyToWithdraw = BigInt(0);
  const readyIndices = [];
  const now = Math.floor(Date.now() / 1000);

  for (let i = 0; i < Number(queueLength); i++) {
    const req = await router.unbondQueue(i);
    const isReady = Number(req.readyAt) <= now;
    const status = isReady ? '✅ READY' : '⏳ WAITING';
    
    console.log(`Index ${i}: ${hre.ethers.formatEther(req.bnbAmount)} BNB - ${status}`);
    console.log(`  Owner: ${req.user}`);
    console.log(`  Ready at: ${new Date(Number(req.readyAt) * 1000).toLocaleString()}`);
    
    if (isReady && req.user.toLowerCase() === deployer.address.toLowerCase()) {
      totalReadyToWithdraw += req.bnbAmount;
      readyIndices.push(i);
    }
    console.log();
  }

  if (readyIndices.length === 0) {
    console.log('⚠️  No unbond requests are ready to withdraw yet.');
    console.log('    Unbond requests have a 7-day waiting period.');
    console.log('    You can withdraw after the "Ready at" date.\n');
    return;
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('✅ Ready to withdraw:', hre.ethers.formatEther(totalReadyToWithdraw), 'BNB');
  console.log('📊 Number of requests:', readyIndices.length);
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Withdraw each ready request
  for (const index of readyIndices) {
    try {
      console.log(`💸 Withdrawing index ${index}...`);
      const tx = await router.withdraw(index);
      console.log('⏳ Transaction sent:', tx.hash);
      await tx.wait();
      console.log('✅ Withdrawal successful!\n');
    } catch (error) {
      console.log('❌ Withdrawal failed:', error.message.split('\n')[0], '\n');
    }
  }

  // Check final balance
  const endBalance = await hre.ethers.provider.getBalance(deployer.address);
  const gained = endBalance - startBalance;
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📊 FINAL RESULTS');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('💰 Starting Balance:', hre.ethers.formatEther(startBalance), 'BNB');
  console.log('💰 Ending Balance:', hre.ethers.formatEther(endBalance), 'BNB');
  console.log('💰 Net Change:', hre.ethers.formatEther(gained), 'BNB');
  
  if (gained > 0) {
    console.log('✅ Successfully withdrew funds to wallet!');
  }
  console.log('═══════════════════════════════════════════════════════════════\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
