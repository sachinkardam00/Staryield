const hre = require('hardhat');

async function main() {
  // Contract addresses
  const OLD_ROUTER = '0x79C0f82a5a398b7119D45d833833833e'; // Replace with actual old router address if different
  const NEW_ROUTER = '0xe80b3e256098edD086b2A9f9d70e2422b2671EEE';
  const YOUR_ADDRESS = '0x45F3a935F36ebbe3be3da8C9c14ff95023403acd';
  
  console.log('🏦 Emergency Fund Withdrawal from All Routers\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const [deployer] = await hre.ethers.getSigners();
  console.log('Executing with account:', deployer.address);
  console.log('Target withdrawal address:', YOUR_ADDRESS);
  
  if (deployer.address.toLowerCase() !== YOUR_ADDRESS.toLowerCase()) {
    console.log('\n⚠️  WARNING: Deployer address does not match withdrawal address!');
    console.log('Make sure you are using the correct private key in .env');
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('STEP 1: Checking New Router (v3)');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const newRouter = await hre.ethers.getContractAt('StakingRouterBNB', NEW_ROUTER);
  
  // Check new router balance
  const newRouterBalance = await hre.ethers.provider.getBalance(NEW_ROUTER);
  console.log('New Router Balance:', hre.ethers.formatEther(newRouterBalance), 'BNB');
  
  // Check your balance before
  const balanceBefore = await hre.ethers.provider.getBalance(YOUR_ADDRESS);
  console.log('Your Balance Before:', hre.ethers.formatEther(balanceBefore), 'BNB\n');

  let totalWithdrawn = 0n;

  if (newRouterBalance > 0n) {
    console.log('💰 Withdrawing from New Router...');
    
    // Check if you have any unbond requests
    const queueLength = await newRouter.queueLength();
    console.log('Unbond Queue Length:', queueLength.toString());
    
    if (Number(queueLength) > 0) {
      console.log('\nProcessing unbond requests...');
      
      for (let i = 0; i < Number(queueLength); i++) {
        const req = await newRouter.unbondQueue(i);
        console.log(`\n  Index ${i}:`);
        console.log('    User:', req.user);
        console.log('    Amount:', hre.ethers.formatEther(req.bnbAmount), 'BNB');
        console.log('    Claimed:', req.claimed);
        
        if (req.user.toLowerCase() === YOUR_ADDRESS.toLowerCase() && !req.claimed) {
          console.log('    ✅ This is yours and unclaimed!');
          console.log('    🚀 Force withdrawing...');
          
          try {
            const tx = await newRouter.forceWithdrawUnbonded(i);
            console.log('    Transaction hash:', tx.hash);
            await tx.wait();
            console.log('    ✅ Force withdrawal successful!');
            totalWithdrawn += req.bnbAmount;
          } catch (error) {
            console.error('    ❌ Force withdrawal failed:', error.message);
          }
        }
      }
    }
    
    // Check if you're the owner and can do emergency withdrawal
    try {
      const owner = await newRouter.owner();
      console.log('\nNew Router Owner:', owner);
      
      if (owner.toLowerCase() === deployer.address.toLowerCase()) {
        console.log('✅ You are the owner! Checking for emergency withdrawal function...');
        
        // Try to call emergency withdraw if it exists
        try {
          const remainingBalance = await hre.ethers.provider.getBalance(NEW_ROUTER);
          if (remainingBalance > 0n) {
            console.log('\n⚠️  Remaining balance in router:', hre.ethers.formatEther(remainingBalance), 'BNB');
            console.log('You may need to implement an owner withdrawal function in the contract.');
          }
        } catch (e) {
          console.log('No emergency withdrawal function found.');
        }
      } else {
        console.log('⚠️  You are not the owner. Cannot perform owner functions.');
      }
    } catch (error) {
      console.log('Could not check ownership:', error.message);
    }
  } else {
    console.log('✅ New Router is empty - nothing to withdraw');
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('STEP 2: Checking Your Active Stakes');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Check your current shares
  const shares = await newRouter.sharesOf(YOUR_ADDRESS);
  console.log('Your Current Shares:', shares.toString());
  
  if (shares > 0n) {
    const totalShares = await newRouter.totalShares();
    const totalPrincipal = await newRouter.totalPrincipal();
    const yourBNB = (shares * totalPrincipal) / totalShares;
    
    console.log('Your BNB Value:', hre.ethers.formatEther(yourBNB), 'BNB');
    console.log('\n🚨 You still have active stakes!');
    console.log('Options:');
    console.log('1. Request unstake via the UI');
    console.log('2. Wait for cooldown period');
    console.log('3. Use force withdraw after unstaking');
  } else {
    console.log('✅ No active stakes - all funds should be withdrawn');
  }

  // Final balance check
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('FINAL SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const balanceAfter = await hre.ethers.provider.getBalance(YOUR_ADDRESS);
  const balanceChange = balanceAfter - balanceBefore;
  
  console.log('Your Balance Before:', hre.ethers.formatEther(balanceBefore), 'BNB');
  console.log('Your Balance After:', hre.ethers.formatEther(balanceAfter), 'BNB');
  console.log('Balance Change:', hre.ethers.formatEther(balanceChange), 'BNB');
  console.log('\nTotal Withdrawn:', hre.ethers.formatEther(totalWithdrawn), 'BNB');
  
  const newRouterFinalBalance = await hre.ethers.provider.getBalance(NEW_ROUTER);
  console.log('\nNew Router Final Balance:', hre.ethers.formatEther(newRouterFinalBalance), 'BNB');
  
  if (newRouterFinalBalance > 0n && shares === 0n) {
    console.log('\n⚠️  WARNING: Router still has funds but you have no shares!');
    console.log('This means other users have funds in the router.');
    console.log('You can only withdraw YOUR funds, not other users\' funds.');
  }
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  if (totalWithdrawn > 0n) {
    console.log('✅ SUCCESS! Funds withdrawn to your address.');
  } else if (shares > 0n) {
    console.log('⚠️  You still have active stakes. Unstake first to withdraw.');
  } else {
    console.log('✅ All your funds are already withdrawn.');
  }
  console.log('═══════════════════════════════════════════════════════════════');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
