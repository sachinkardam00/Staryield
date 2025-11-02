const hre = require('hardhat');

async function main() {
  const OLD_ROUTER = '0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78';
  
  console.log('🔓 Unstaking Remaining BNB from Old Router');
  console.log('Old Router:', OLD_ROUTER);

  const [deployer] = await hre.ethers.getSigners();
  
  const Router = await hre.ethers.getContractFactory('StakingRouterBNB');
  const router = Router.attach(OLD_ROUTER);

  // Check your shares
  const yourShares = await router.sharesOf(deployer.address);
  if (yourShares === BigInt(0)) {
    console.log('✅ No shares to unstake!');
    return;
  }

  const totalShares = await router.totalShares();
  const totalPrincipal = await router.totalPrincipal();
  const yourBNB = (yourShares * totalPrincipal) / totalShares;
  
  console.log('\n💰 Your Current Stake:');
  console.log('  Shares:', yourShares.toString());
  console.log('  BNB Value:', hre.ethers.formatEther(yourBNB), 'BNB');

  console.log('\n📤 Requesting unstake...');
  
  try {
    // Set deadline to 1 hour from now
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    
    const tx = await router.requestUnstake(yourShares, deadline);
    console.log('Transaction:', tx.hash);
    console.log('Waiting for confirmation...');
    
    const receipt = await tx.wait();
    console.log('✅ Unstake requested in block:', receipt.blockNumber);
    
    // Get the new queue index
    const queueLength = await router.queueLength();
    const newIndex = Number(queueLength) - 1;
    
    const req = await router.unbondQueue(newIndex);
    const readyDate = new Date(Number(req.readyAt) * 1000);
    
    console.log('\n📋 Unbond Request Created:');
    console.log('  Queue Index:', newIndex);
    console.log('  Amount:', hre.ethers.formatEther(req.bnbAmount), 'BNB');
    console.log('  Ready at:', readyDate.toLocaleString());
    console.log('  Days to wait:', Math.ceil((Number(req.readyAt) - Date.now() / 1000) / 86400));
    
    console.log('\n✅ Unstake successful!');
    console.log(`\nIn 7 days, run:`);
    console.log(`npx hardhat run scripts/withdraw-from-old-router.js --network bscTestnet`);
    console.log(`(Use queue index: ${newIndex})`);
    
  } catch (error) {
    console.error('❌ Unstake failed:', error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
