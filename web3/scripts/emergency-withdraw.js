const hre = require('hardhat');

async function main() {
  const routerAddress = '0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78';
  const amountToWithdraw = hre.ethers.parseEther('0.8'); // Withdraw 0.8 BNB
  
  console.log('🔧 Emergency Withdrawal from Router');
  console.log('Router:', routerAddress);
  console.log('Amount:', hre.ethers.formatEther(amountToWithdraw), 'BNB');

  const [deployer] = await hre.ethers.getSigners();
  console.log('Your wallet:', deployer.address);

  // Get router contract with updated ABI
  const Router = await hre.ethers.getContractFactory('StakingRouterBNB');
  const router = Router.attach(routerAddress);

  // Check owner
  const owner = await router.owner();
  if (owner.toLowerCase() !== deployer.address.toLowerCase()) {
    console.error('❌ You are not the owner!');
    process.exit(1);
  }

  // Check router balance
  const routerBalance = await hre.ethers.provider.getBalance(routerAddress);
  console.log('\nRouter balance:', hre.ethers.formatEther(routerBalance), 'BNB');
  console.log('Your balance:', hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), 'BNB');

  if (routerBalance < amountToWithdraw) {
    console.error('❌ Router has insufficient balance');
    process.exit(1);
  }

  console.log('\n⚠️  WARNING: This will withdraw BNB from the router!');
  console.log('This may prevent users from claiming rewards or withdrawing stakes.');
  console.log('\nAttempting emergency withdrawal...');

  try {
    // Try to call emergencyWithdrawBNB if it exists
    const tx = await router.emergencyWithdrawBNB(amountToWithdraw);
    console.log('Transaction sent:', tx.hash);
    console.log('Waiting for confirmation...');
    
    const receipt = await tx.wait();
    console.log('✅ Transaction confirmed in block:', receipt.blockNumber);
    
    // Show final balances
    const finalRouterBalance = await hre.ethers.provider.getBalance(routerAddress);
    const finalYourBalance = await hre.ethers.provider.getBalance(deployer.address);
    
    console.log('\n📊 Final Balances:');
    console.log('Router:', hre.ethers.formatEther(finalRouterBalance), 'BNB');
    console.log('Your wallet:', hre.ethers.formatEther(finalYourBalance), 'BNB');
    console.log('\n✅ Withdrawal successful!');
    
  } catch (error) {
    console.error('\n❌ Withdrawal failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('emergencyWithdrawBNB')) {
      console.log('\n💡 The deployed router contract does not have emergencyWithdrawBNB function.');
      console.log('You need to:');
      console.log('1. Deploy a new router with the emergency withdraw function');
      console.log('2. Migrate all user stakes to the new router');
      console.log('3. Or accept that this BNB is locked for user rewards/withdrawals');
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
