const hre = require('hardhat');

async function main() {
  const ROUTER = '0x6A17e9aa65f9121eCd1dB3b164B93227eEd3708C';
  const ADAPTER = '0xE62fcEDfE9f31d6B07B18f4cc62d2b6652E5E39C';
  
  console.log('🚨 EMERGENCY WITHDRAWAL - BYPASS UNBONDING PERIOD\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const [deployer] = await hre.ethers.getSigners();
  console.log('👛 Wallet:', deployer.address);
  
  const Router = await hre.ethers.getContractFactory('StakingRouterBNB');
  const router = Router.attach(ROUTER);
  
  const Adapter = await hre.ethers.getContractFactory('SimpleMockAdapter');
  const adapter = Adapter.attach(ADAPTER);

  // Check current state
  const startBalance = await hre.ethers.provider.getBalance(deployer.address);
  console.log('💰 Current Wallet Balance:', hre.ethers.formatEther(startBalance), 'BNB');
  
  const shares = await router.sharesOf(deployer.address);
  const totalShares = await router.totalShares();
  const totalPrincipal = await router.totalPrincipal();
  
  let stakedBNB = BigInt(0);
  if (shares > BigInt(0) && totalShares > BigInt(0)) {
    stakedBNB = (shares * totalPrincipal) / totalShares;
  }
  
  console.log('🏦 Currently Staked:', hre.ethers.formatEther(stakedBNB), 'BNB');
  console.log('📈 Your Shares:', shares.toString());
  
  const adapterBalance = await hre.ethers.provider.getBalance(ADAPTER);
  console.log('💰 Adapter Balance:', hre.ethers.formatEther(adapterBalance), 'BNB');
  
  const routerBalance = await hre.ethers.provider.getBalance(ROUTER);
  console.log('💰 Router Balance:', hre.ethers.formatEther(routerBalance), 'BNB\n');

  // Step 1: Unstake remaining staked BNB
  if (shares > BigInt(0)) {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('STEP 1: UNSTAKE REMAINING', hre.ethers.formatEther(stakedBNB), 'BNB');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    try {
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      const unstakeTx = await router.requestUnstake(shares, deadline);
      console.log('⏳ Transaction sent:', unstakeTx.hash);
      await unstakeTx.wait();
      console.log('✅ Unstake request created!\n');
    } catch (error) {
      console.log('❌ Unstake failed:', error.message.split('\n')[0], '\n');
    }
  } else {
    console.log('ℹ️  No shares currently staked, skipping unstake.\n');
  }

  // Step 2: Emergency withdraw from router
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('STEP 2: EMERGENCY WITHDRAW FROM ROUTER');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  if (routerBalance > BigInt(0)) {
    try {
      console.log('💸 Withdrawing', hre.ethers.formatEther(routerBalance), 'BNB from router...');
      const tx = await router.emergencyWithdrawBNB(routerBalance);
      console.log('⏳ Transaction sent:', tx.hash);
      await tx.wait();
      console.log('✅ Emergency withdrawal from router successful!\n');
    } catch (error) {
      console.log('❌ Router withdrawal failed:', error.message.split('\n')[0], '\n');
    }
  } else {
    console.log('ℹ️  Router has 0 balance, skipping.\n');
  }

  // Step 3: Emergency withdraw from adapter
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('STEP 3: EMERGENCY WITHDRAW FROM ADAPTER');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  if (adapterBalance > BigInt(0)) {
    try {
      console.log('💸 Withdrawing', hre.ethers.formatEther(adapterBalance), 'BNB from adapter...');
      const tx = await adapter.emergencyWithdraw();
      console.log('⏳ Transaction sent:', tx.hash);
      await tx.wait();
      console.log('✅ Emergency withdrawal from adapter successful!\n');
    } catch (error) {
      console.log('❌ Adapter withdrawal failed:', error.message.split('\n')[0], '\n');
    }
  } else {
    console.log('ℹ️  Adapter has 0 balance, skipping.\n');
  }

  // Final balance
  const endBalance = await hre.ethers.provider.getBalance(deployer.address);
  const gained = endBalance - startBalance;
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📊 FINAL RESULTS');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('💰 Starting Balance:', hre.ethers.formatEther(startBalance), 'BNB');
  console.log('💰 Ending Balance:', hre.ethers.formatEther(endBalance), 'BNB');
  console.log('💰 Net Change:', hre.ethers.formatEther(gained), 'BNB');
  
  if (gained > 0) {
    console.log('✅ Successfully withdrew', hre.ethers.formatEther(gained), 'BNB to wallet!');
  } else {
    console.log('⚠️  Net negative due to gas costs');
  }
  
  console.log('\n⚠️  NOTE: Unbonded funds in queue still require 7-day waiting period.');
  console.log('    Those can be withdrawn after September 11, 2025.');
  console.log('═══════════════════════════════════════════════════════════════\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
