const hre = require('hardhat');

async function main() {
  const NEW_ROUTER = '0x321eCab2d08029De195E11ae43a4a7Efe9674274';
  const STAKE_AMOUNT = '0.01'; // 0.01 BNB test
  
  console.log('🧪 Testing Staking Function\n');

  const [deployer] = await hre.ethers.getSigners();
  console.log('Your wallet:', deployer.address);
  const startBalance = await hre.ethers.provider.getBalance(deployer.address);
  console.log('Starting balance:', hre.ethers.formatEther(startBalance), 'BNB\n');

  const Router = await hre.ethers.getContractFactory('StakingRouterBNB');
  const router = Router.attach(NEW_ROUTER);

  // Test stake
  console.log(`📥 Staking ${STAKE_AMOUNT} BNB...`);
  try {
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour
    const tx = await router.depositBNB(deadline, {
      value: hre.ethers.parseEther(STAKE_AMOUNT)
    });
    
    console.log('Transaction:', tx.hash);
    console.log('Waiting for confirmation...');
    
    const receipt = await tx.wait();
    console.log('✅ Staked successfully in block:', receipt.blockNumber);
    
    // Check new state
    const shares = await router.sharesOf(deployer.address);
    const totalPrincipal = await router.totalPrincipal();
    
    console.log('\n📊 After Staking:');
    console.log('  Your shares:', shares.toString());
    console.log('  Total principal:', hre.ethers.formatEther(totalPrincipal), 'BNB');
    
    const endBalance = await hre.ethers.provider.getBalance(deployer.address);
    console.log('  Your balance:', hre.ethers.formatEther(endBalance), 'BNB');
    
    console.log('\n✅ Staking works perfectly!');
    console.log('\n📝 Next steps to test:');
    console.log('1. Wait 1-2 minutes');
    console.log('2. Check if rewards accumulate (calculatePendingRewards on adapter)');
    console.log('3. Try claiming rewards');
    console.log('4. Try unstaking and withdrawing');
    
  } catch (error) {
    console.error('❌ Staking failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('PAUSED')) {
      console.log('\n💡 Router is paused. Run: router.unpause()');
    } else if (error.message.includes('AdapterNotAllowed')) {
      console.log('\n💡 Adapter not configured. Run:');
      console.log('   router.allowAdapter(ADAPTER, true)');
      console.log('   router.setAdapter(ADAPTER)');
    } else if (error.message.includes('DeadlineExpired')) {
      console.log('\n💡 Deadline expired. Increase deadline parameter.');
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
