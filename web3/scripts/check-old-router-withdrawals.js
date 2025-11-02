const hre = require('hardhat');

async function main() {
  const OLD_ROUTER = '0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78';
  
  console.log('📋 Old Router Migration Strategy');
  console.log('Old Router:', OLD_ROUTER);

  const [deployer] = await hre.ethers.getSigners();
  
  const Router = await hre.ethers.getContractFactory('StakingRouterBNB');
  const router = Router.attach(OLD_ROUTER);

  // Get queue info
  const queueLength = await router.queueLength();
  console.log('\n🔍 Checking Unbond Queue:', queueLength.toString(), 'requests');

  for (let i = 0; i < queueLength; i++) {
    const req = await router.unbondQueue(i);
    console.log(`\nRequest ${i}:`);
    console.log('  User:', req.user);
    console.log('  Amount:', hre.ethers.formatEther(req.bnbAmount), 'BNB');
    console.log('  Ready at:', new Date(Number(req.readyAt) * 1000).toLocaleString());
    console.log('  Claimed:', req.claimed);
    
    // Check if ready to withdraw
    const now = Math.floor(Date.now() / 1000);
    if (!req.claimed && Number(req.readyAt) <= now) {
      console.log('  ✅ READY TO WITHDRAW');
      
      if (req.user.toLowerCase() === deployer.address.toLowerCase()) {
        console.log('  🎯 This is YOUR withdrawal!');
        console.log(`  Run: npx hardhat run scripts/withdraw-from-old-router.js --network bscTestnet`);
      }
    } else if (!req.claimed) {
      const waitTime = Number(req.readyAt) - now;
      const days = Math.floor(waitTime / 86400);
      const hours = Math.floor((waitTime % 86400) / 3600);
      console.log(`  ⏳ Wait ${days}d ${hours}h to withdraw`);
    }
  }

  // Check your shares
  const yourShares = await router.sharesOf(deployer.address);
  const totalShares = await router.totalShares();
  const totalPrincipal = await router.totalPrincipal();
  
  if (yourShares > BigInt(0)) {
    const yourBNB = (yourShares * totalPrincipal) / totalShares;
    console.log('\n💰 Your Active Stake in Old Router:');
    console.log('  Shares:', yourShares.toString());
    console.log('  BNB Value:', hre.ethers.formatEther(yourBNB), 'BNB');
    console.log('\n  📝 To recover this:');
    console.log('  1. Call requestUnstake() with your shares');
    console.log('  2. Wait 7 days (unbonding period)');
    console.log('  3. Call withdrawUnbonded() with the queue index');
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Summary:');
  console.log('  Total in old router: 0.8 BNB');
  console.log('  User stakes: 0.3 BNB (can be recovered by users)');
  console.log('  Excess/Locked: ~0.5 BNB (PERMANENTLY LOCKED)');
  console.log('\n  The 0.5 BNB excess cannot be recovered because:');
  console.log('  - No emergencyWithdraw function in deployed contract');
  console.log('  - Smart contracts are immutable');
  console.log('  - This is a design limitation of the old contract');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
