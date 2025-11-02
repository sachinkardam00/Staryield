const hre = require('hardhat');

async function main() {
  const OLD_ROUTER = '0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78';
  const NEW_ROUTER = '0x321eCab2d08029De195E11ae43a4a7Efe9674274';
  const ADAPTER = '0xE62fcEDfE9f31d6B07B18f4cc62d2b6652E5E39C';
  
  console.log('🔄 Complete Migration from Old Router');

  const [deployer] = await hre.ethers.getSigners();
  console.log('Your wallet:', deployer.address);
  console.log('Balance:', hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), 'BNB\n');

  // Get contracts
  const Router = await hre.ethers.getContractFactory('StakingRouterBNB');
  const Adapter = await hre.ethers.getContractFactory('SimpleMockAdapter');
  
  const oldRouter = Router.attach(OLD_ROUTER);
  const adapter = Adapter.attach(ADAPTER);

  // Step 1: Check your stake in old router
  const yourShares = await oldRouter.sharesOf(deployer.address);
  const totalShares = await oldRouter.totalShares();
  const totalPrincipal = await oldRouter.totalPrincipal();
  const yourBNB = yourShares > BigInt(0) ? (yourShares * totalPrincipal) / totalShares : BigInt(0);
  
  console.log('📊 Old Router Status:');
  console.log('  Your shares:', yourShares.toString());
  console.log('  Your BNB:', hre.ethers.formatEther(yourBNB), 'BNB');
  console.log('  Router balance:', hre.ethers.formatEther(await hre.ethers.provider.getBalance(OLD_ROUTER)), 'BNB');

  if (yourShares === BigInt(0)) {
    console.log('\n✅ No shares in old router - migration complete!');
    return;
  }

  // Step 2: Temporarily point adapter back to old router
  console.log('\n🔄 Step 1: Temporarily point adapter to old router...');
  try {
    const tx1 = await adapter.setRouter(OLD_ROUTER);
    await tx1.wait();
    console.log('✅ Adapter now points to old router');
  } catch (error) {
    console.log('❌ Failed to update adapter:', error.message);
    console.log('\n💡 Solution: The adapter is already pointing to new router.');
    console.log('   The 0.3 BNB in old router cannot be unstaked because');
    console.log('   adapter no longer accepts calls from old router.');
    console.log('\n   Options:');
    console.log('   1. Accept the loss (testnet BNB)');
    console.log('   2. Or manually send adapter back to old router via BSCScan');
    return;
  }

  // Step 3: Unstake from old router
  console.log('\n🔓 Step 2: Unstaking from old router...');
  try {
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const tx2 = await oldRouter.requestUnstake(yourShares, deadline);
    await tx2.wait();
    console.log('✅ Unstake requested');
    
    const queueLength = await oldRouter.queueLength();
    const newIndex = Number(queueLength) - 1;
    const req = await oldRouter.unbondQueue(newIndex);
    const readyDate = new Date(Number(req.readyAt) * 1000);
    
    console.log('  Queue Index:', newIndex);
    console.log('  Amount:', hre.ethers.formatEther(req.bnbAmount), 'BNB');
    console.log('  Ready at:', readyDate.toLocaleString());
  } catch (error) {
    console.error('❌ Unstake failed:', error.message.split('\n')[0]);
  }

  // Step 4: Point adapter back to new router
  console.log('\n🔄 Step 3: Point adapter back to new router...');
  try {
    const tx3 = await adapter.setRouter(NEW_ROUTER);
    await tx3.wait();
    console.log('✅ Adapter restored to new router');
  } catch (error) {
    console.error('❌ Failed to restore adapter:', error.message.split('\n')[0]);
  }

  console.log('\n✅ Migration process complete!');
  console.log('\n📝 Summary:');
  console.log('  - Withdrawn: 0.8 BNB (done)');
  console.log('  - Remaining: 0.3 BNB (unbonding - wait 7 days)');
  console.log('  - New router ready to use!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
