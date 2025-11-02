const hre = require('hardhat');

async function main() {
  const routerAddress = '0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78';
  
  console.log('Withdrawing BNB from Router...');
  console.log('Router:', routerAddress);

  const [deployer] = await hre.ethers.getSigners();
  console.log('Your wallet:', deployer.address);
  console.log('Your balance:', hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), 'BNB');

  // Check router balance
  const routerBalance = await hre.ethers.provider.getBalance(routerAddress);
  console.log('\nRouter balance:', hre.ethers.formatEther(routerBalance), 'BNB');

  if (routerBalance === BigInt(0)) {
    console.log('❌ Router has no BNB to withdraw');
    return;
  }

  // Get router contract
  const Router = await hre.ethers.getContractFactory('StakingRouterBNB');
  const router = Router.attach(routerAddress);

  // Check owner
  const owner = await router.owner();
  console.log('Router owner:', owner);
  
  if (owner.toLowerCase() !== deployer.address.toLowerCase()) {
    console.error('\n❌ You are not the router owner! Cannot withdraw.');
    console.error(`   Current owner: ${owner}`);
    console.error(`   Your address: ${deployer.address}`);
    process.exit(1);
  }

  console.log('\n✅ You are the owner. Proceeding with withdrawal...');

  // The router contract doesn't have a direct withdraw function
  // We need to use the emergency patterns or check if there's excess balance
  
  // Method: Send a transaction to transfer balance
  // Since router accepts BNB via receive(), we can try to send from router to owner
  // But this requires a withdrawal function which the contract may not have
  
  console.log('\n⚠️  Important: The StakingRouterBNB contract does not have a withdraw function.');
  console.log('The BNB in the router is meant for:');
  console.log('1. Paying out rewards to users who claim');
  console.log('2. Paying out principal to users who withdraw after unstaking');
  console.log('\nWithdrawing this BNB will prevent users from claiming rewards or withdrawing!');
  console.log('\nTo add a withdrawal function, you need to:');
  console.log('1. Add an onlyOwner function to withdraw excess BNB');
  console.log('2. Redeploy the contract with the new function');
  console.log('3. Or use a low-level call if you control the owner address');

  // Let's try to send a low-level transaction
  console.log('\n🔧 Attempting withdrawal via direct transaction...');
  
  const amountToWithdraw = routerBalance; // Withdraw all
  
  try {
    const tx = await deployer.sendTransaction({
      to: routerAddress,
      data: '0x', // Empty data
      value: 0
    });
    
    console.log('Transaction sent:', tx.hash);
    console.log('Waiting for confirmation...');
    
    await tx.wait();
    console.log('✅ Transaction confirmed');
    
  } catch (error) {
    console.error('\n❌ Direct withdrawal not possible.');
    console.error('Error:', error.message);
    
    console.log('\n💡 Solution: You need to add a withdrawal function to the router contract.');
    console.log('\nAdd this function to StakingRouterBNB.sol:');
    console.log(`
    /// @notice Emergency withdraw BNB (owner only)
    function emergencyWithdrawBNB(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "INSUFFICIENT_BALANCE");
        (bool ok, ) = payable(owner).call{value: amount}("");
        if (!ok) revert NativeTransferFailed();
    }
    `);
    console.log('\nThen redeploy and run this script again.');
  }

  // Show final balances
  const finalRouterBalance = await hre.ethers.provider.getBalance(routerAddress);
  const finalYourBalance = await hre.ethers.provider.getBalance(deployer.address);
  
  console.log('\n📊 Final Balances:');
  console.log('Router:', hre.ethers.formatEther(finalRouterBalance), 'BNB');
  console.log('Your wallet:', hre.ethers.formatEther(finalYourBalance), 'BNB');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
