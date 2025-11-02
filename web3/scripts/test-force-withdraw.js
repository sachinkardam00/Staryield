const hre = require('hardhat');

async function main() {
  const ROUTER_ADDRESS = '0xe80b3e256098edD086b2A9f9d70e2422b2671EEE';
  const USER_ADDRESS = '0x45F3a935F36ebbe3be3da8C9c14ff95023403acd';
  
  console.log('🧪 Testing Force Withdraw Function\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const [deployer] = await hre.ethers.getSigners();
  console.log('Testing with account:', deployer.address);
  
  if (deployer.address.toLowerCase() !== USER_ADDRESS.toLowerCase()) {
    console.log('⚠️  WARNING: Deployer address does not match user address!');
    console.log('Expected:', USER_ADDRESS);
    console.log('Got:', deployer.address);
    console.log('\nMake sure your .env has the correct PRIVATE_KEY\n');
  }

  const router = await hre.ethers.getContractAt('StakingRouterBNB', ROUTER_ADDRESS);
  
  // Step 1: Check unbond queue
  console.log('Step 1: Checking unbond queue...');
  const queueLength = await router.queueLength();
  console.log('Queue Length:', queueLength.toString());
  
  if (Number(queueLength) === 0) {
    console.log('\n❌ No unbond requests in queue!');
    console.log('You need to request unstake first.');
    return;
  }
  
  // Step 2: Find unclaimed request
  console.log('\nStep 2: Finding unclaimed requests...');
  let foundIndex = -1;
  let foundAmount = 0n;
  
  for (let i = 0; i < Number(queueLength); i++) {
    const req = await router.unbondQueue(i);
    console.log(`\n  Index ${i}:`);
    console.log('    User:', req.user);
    console.log('    Amount:', hre.ethers.formatEther(req.bnbAmount), 'BNB');
    console.log('    Claimed:', req.claimed);
    
    if (req.user.toLowerCase() === deployer.address.toLowerCase() && !req.claimed) {
      foundIndex = i;
      foundAmount = req.bnbAmount;
      console.log('    ✅ THIS ONE IS UNCLAIMED AND YOURS!');
    }
  }
  
  if (foundIndex === -1) {
    console.log('\n❌ No unclaimed unbond requests found for your address!');
    return;
  }
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`✅ Found unclaimed request at index ${foundIndex}`);
  console.log(`Amount to withdraw: ${hre.ethers.formatEther(foundAmount)} BNB`);
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  // Step 3: Check balances before
  const balanceBefore = await hre.ethers.provider.getBalance(deployer.address);
  const routerBalanceBefore = await hre.ethers.provider.getBalance(ROUTER_ADDRESS);
  
  console.log('Step 3: Balances before withdrawal:');
  console.log('  Your balance:', hre.ethers.formatEther(balanceBefore), 'BNB');
  console.log('  Router balance:', hre.ethers.formatEther(routerBalanceBefore), 'BNB');
  
  // Step 4: Execute force withdraw
  console.log('\nStep 4: Executing force withdraw...');
  console.log('⚡ Calling forceWithdrawUnbonded(' + foundIndex + ')...\n');
  
  try {
    const tx = await router.forceWithdrawUnbonded(foundIndex);
    console.log('Transaction hash:', tx.hash);
    console.log('Waiting for confirmation...');
    
    const receipt = await tx.wait();
    console.log('✅ Transaction confirmed!');
    console.log('Gas used:', receipt.gasUsed.toString());
    console.log('Block number:', receipt.blockNumber);
    
    // Step 5: Check balances after
    console.log('\nStep 5: Balances after withdrawal:');
    const balanceAfter = await hre.ethers.provider.getBalance(deployer.address);
    const routerBalanceAfter = await hre.ethers.provider.getBalance(ROUTER_ADDRESS);
    
    console.log('  Your balance:', hre.ethers.formatEther(balanceAfter), 'BNB');
    console.log('  Router balance:', hre.ethers.formatEther(routerBalanceAfter), 'BNB');
    
    const balanceChange = balanceAfter - balanceBefore;
    const routerBalanceChange = routerBalanceBefore - routerBalanceAfter;
    
    console.log('\n📊 Changes:');
    console.log('  Your balance change:', hre.ethers.formatEther(balanceChange), 'BNB (minus gas)');
    console.log('  Router balance change:', hre.ethers.formatEther(routerBalanceChange), 'BNB');
    
    // Step 6: Verify the request is now claimed
    console.log('\nStep 6: Verifying request is now claimed...');
    const reqAfter = await router.unbondQueue(foundIndex);
    console.log('  Claimed status:', reqAfter.claimed);
    
    if (reqAfter.claimed) {
      console.log('\n═══════════════════════════════════════════════════════════════');
      console.log('🎉 SUCCESS! Force withdraw completed successfully!');
      console.log('═══════════════════════════════════════════════════════════════');
    } else {
      console.log('\n❌ ERROR: Request not marked as claimed!');
    }
    
  } catch (error) {
    console.error('\n❌ Force withdraw failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('Not owner')) {
      console.error('\n💡 The unbond request does not belong to your address');
    } else if (error.message.includes('Already claimed')) {
      console.error('\n💡 This request has already been withdrawn');
    } else if (error.message.includes('CooldownNotFinished')) {
      console.error('\n💡 Cooldown not finished (this should not happen with force withdraw!)');
    }
    
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
