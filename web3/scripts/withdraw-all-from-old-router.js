const hre = require('hardhat');

async function main() {
  const OLD_ROUTER = '0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78';
  
  console.log('💰 Withdrawing ALL Available BNB from Old Router');
  console.log('Old Router:', OLD_ROUTER);

  const [deployer] = await hre.ethers.getSigners();
  console.log('Your wallet:', deployer.address);
  
  const startBalance = await hre.ethers.provider.getBalance(deployer.address);
  console.log('Starting balance:', hre.ethers.formatEther(startBalance), 'BNB\n');

  const Router = await hre.ethers.getContractFactory('StakingRouterBNB');
  const router = Router.attach(OLD_ROUTER);

  // Get queue info
  const queueLength = await router.queueLength();
  const now = Math.floor(Date.now() / 1000);
  
  console.log('🔍 Checking', queueLength.toString(), 'unbond requests...\n');

  let totalWithdrawn = BigInt(0);
  let successCount = 0;

  // Withdraw from all ready requests
  for (let i = 0; i < queueLength; i++) {
    const req = await router.unbondQueue(i);
    
    // Check if this is your request, not claimed, and ready
    if (
      req.user.toLowerCase() === deployer.address.toLowerCase() &&
      !req.claimed &&
      Number(req.readyAt) <= now
    ) {
      try {
        console.log(`📤 Withdrawing request #${i}: ${hre.ethers.formatEther(req.bnbAmount)} BNB...`);
        
        const tx = await router.withdrawUnbonded(i);
        console.log('   Transaction:', tx.hash);
        
        const receipt = await tx.wait();
        console.log('   ✅ Confirmed in block:', receipt.blockNumber);
        
        totalWithdrawn += req.bnbAmount;
        successCount++;
        
        // Wait a bit between transactions
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.log('   ❌ Failed:', error.message.split('\n')[0]);
      }
    }
  }

  console.log('\n' + '━'.repeat(50));
  console.log('📊 Withdrawal Summary:');
  console.log('  Successful withdrawals:', successCount);
  console.log('  Total withdrawn:', hre.ethers.formatEther(totalWithdrawn), 'BNB');
  
  const endBalance = await hre.ethers.provider.getBalance(deployer.address);
  console.log('\n💰 Final Balance:');
  console.log('  Before:', hre.ethers.formatEther(startBalance), 'BNB');
  console.log('  After:', hre.ethers.formatEther(endBalance), 'BNB');
  console.log('  Net gain:', hre.ethers.formatEther(endBalance - startBalance), 'BNB');

  // Check remaining stake
  const yourShares = await router.sharesOf(deployer.address);
  if (yourShares > BigInt(0)) {
    const totalShares = await router.totalShares();
    const totalPrincipal = await router.totalPrincipal();
    const yourBNB = (yourShares * totalPrincipal) / totalShares;
    
    console.log('\n⚠️  Still staked in old router:', hre.ethers.formatEther(yourBNB), 'BNB');
    console.log('   To recover this:');
    console.log('   1. Call requestUnstake() with shares:', yourShares.toString());
    console.log('   2. Wait 7 days');
    console.log('   3. Call withdrawUnbonded()');
  } else {
    console.log('\n✅ No remaining stakes in old router!');
  }

  const routerBalance = await hre.ethers.provider.getBalance(OLD_ROUTER);
  console.log('\n🏦 Old Router Final Balance:', hre.ethers.formatEther(routerBalance), 'BNB');
  
  if (routerBalance > BigInt(0)) {
    console.log('   ⚠️  Some BNB remains locked (excess/rewards)');
    console.log('   This cannot be recovered due to contract limitations');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
