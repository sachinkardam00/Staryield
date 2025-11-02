const hre = require('hardhat');

async function main() {
  const NEW_ROUTER = '0x6A17e9aa65f9121eCd1dB3b164B93227eEd3708C';
  const ADAPTER = '0xE62fcEDfE9f31d6B07B18f4cc62d2b6652E5E39C';
  
  console.log('🧪 COMPREHENSIVE FUNCTIONALITY TEST\n');
  console.log('Testing: A) Claim Rewards | B) Unstake | C) New Stake\n');

  const [deployer] = await hre.ethers.getSigners();
  console.log('Wallet:', deployer.address);
  const startBalance = await hre.ethers.provider.getBalance(deployer.address);
  console.log('Balance:', hre.ethers.formatEther(startBalance), 'BNB\n');

  const Router = await hre.ethers.getContractFactory('StakingRouterBNB');
  const router = Router.attach(NEW_ROUTER);
  
  const Adapter = await hre.ethers.getContractFactory('SimpleMockAdapter');
  const adapter = Adapter.attach(ADAPTER);

  // ===== TEST A: CLAIM REWARDS =====
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST A: CLAIM REWARDS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const adapterPendingRewards = await adapter.calculatePendingRewards();
  const routerPendingRewards = await router.pendingRewards(deployer.address);
  
  console.log('Adapter rewards:', hre.ethers.formatEther(adapterPendingRewards), 'BNB');
  console.log('Router rewards:', hre.ethers.formatEther(routerPendingRewards), 'BNB');
  console.log('Total rewards:', hre.ethers.formatEther(adapterPendingRewards + routerPendingRewards), 'BNB');
  
  if (adapterPendingRewards > BigInt(0)) {
    try {
      console.log('\n1️⃣ Harvesting rewards from adapter...');
      const harvestTx = await router.harvest();
      await harvestTx.wait();
      console.log('✅ Harvest successful:', harvestTx.hash);
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log('\n2️⃣ Claiming harvested rewards...');
      const claimTx = await router.claim();
      await claimTx.wait();
      console.log('✅ Claim successful:', claimTx.hash);
      
      const newBalance = await hre.ethers.provider.getBalance(deployer.address);
      const gained = newBalance - startBalance;
      console.log('\n💰 Balance change:', hre.ethers.formatEther(gained), 'BNB');
      console.log('✅ TEST A: PASSED - Rewards claimed successfully!\n');
      
    } catch (error) {
      console.log('❌ TEST A: FAILED -', error.message.split('\n')[0], '\n');
    }
  } else {
    console.log('⏭️  TEST A: SKIPPED - No rewards to claim yet\n');
  }

  // ===== TEST B: UNSTAKE =====
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST B: UNSTAKE (Request Unbond)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const shares = await router.sharesOf(deployer.address);
  console.log('Your shares:', shares.toString());
  
  if (shares > BigInt(0)) {
    try {
      // Unstake half to test
      const unstakeShares = shares / BigInt(2);
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      
      console.log('\nUnstaking', unstakeShares.toString(), 'shares...');
      const unstakeTx = await router.requestUnstake(unstakeShares, deadline);
      await unstakeTx.wait();
      console.log('✅ Unstake requested:', unstakeTx.hash);
      
      const queueLength = await router.queueLength();
      const newIndex = Number(queueLength) - 1;
      const req = await router.unbondQueue(newIndex);
      
      console.log('\n📋 Unbond Request Created:');
      console.log('  Index:', newIndex);
      console.log('  Amount:', hre.ethers.formatEther(req.bnbAmount), 'BNB');
      console.log('  Ready at:', new Date(Number(req.readyAt) * 1000).toLocaleString());
      console.log('✅ TEST B: PASSED - Unstake request created!\n');
      
    } catch (error) {
      console.log('❌ TEST B: FAILED -', error.message.split('\n')[0], '\n');
    }
  } else {
    console.log('⏭️  TEST B: SKIPPED - No shares to unstake\n');
  }

  // ===== TEST C: NEW STAKE =====
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST C: STAKE NEW BNB');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const stakeAmount = '0.005'; // Stake 0.005 BNB
  console.log('Staking:', stakeAmount, 'BNB...');
  
  try {
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const stakeTx = await router.depositBNB(deadline, {
      value: hre.ethers.parseEther(stakeAmount)
    });
    await stakeTx.wait();
    console.log('✅ Stake successful:', stakeTx.hash);
    
    const newShares = await router.sharesOf(deployer.address);
    const totalPrincipal = await router.totalPrincipal();
    
    console.log('\n📊 After Staking:');
    console.log('  Your shares:', newShares.toString());
    console.log('  Total principal:', hre.ethers.formatEther(totalPrincipal), 'BNB');
    console.log('✅ TEST C: PASSED - New stake successful!\n');
    
  } catch (error) {
    console.log('❌ TEST C: FAILED -', error.message.split('\n')[0], '\n');
  }

  // ===== FINAL SUMMARY =====
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 FINAL STATUS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const finalShares = await router.sharesOf(deployer.address);
  const finalTotalShares = await router.totalShares();
  const finalTotalPrincipal = await router.totalPrincipal();
  const finalYourBNB = finalShares > BigInt(0) ? 
    (finalShares * finalTotalPrincipal) / finalTotalShares : BigInt(0);
  
  console.log('Your staked BNB:', hre.ethers.formatEther(finalYourBNB), 'BNB');
  console.log('Your shares:', finalShares.toString());
  
  const finalBalance = await hre.ethers.provider.getBalance(deployer.address);
  console.log('Your wallet:', hre.ethers.formatEther(finalBalance), 'BNB');
  
  const queueLength = await router.queueLength();
  console.log('Unbond queue length:', queueLength.toString());
  
  console.log('\n✅ ALL TESTS COMPLETED!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
