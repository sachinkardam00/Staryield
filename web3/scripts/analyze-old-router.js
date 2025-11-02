const hre = require('hardhat');

async function main() {
  const OLD_ROUTER = '0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78';
  
  console.log('🔍 Analyzing Old Router Recovery Options');
  console.log('Old Router:', OLD_ROUTER);

  const [deployer] = await hre.ethers.getSigners();
  console.log('Your wallet:', deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(OLD_ROUTER);
  console.log('\n💰 Locked Balance:', hre.ethers.formatEther(balance), 'BNB');

  // Get contract
  const Router = await hre.ethers.getContractFactory('StakingRouterBNB');
  const router = Router.attach(OLD_ROUTER);

  // Check ownership
  const owner = await router.owner();
  console.log('Owner:', owner);
  console.log('You are owner:', owner.toLowerCase() === deployer.address.toLowerCase());

  // Check contract state
  const totalShares = await router.totalShares();
  const totalPrincipal = await router.totalPrincipal();
  const adapter = await router.adapter();
  const queueLength = await router.queueLength();

  console.log('\n📊 Contract State:');
  console.log('Total Shares:', totalShares.toString());
  console.log('Total Principal:', hre.ethers.formatEther(totalPrincipal), 'BNB');
  console.log('Active Adapter:', adapter);
  console.log('Unbond Queue Length:', queueLength.toString());

  console.log('\n🎯 Recovery Options:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (totalShares === BigInt(0)) {
    console.log('✅ Option 1: No users have stakes');
    console.log('   The 0.8 BNB is likely from:');
    console.log('   a) Failed transactions that sent BNB to router');
    console.log('   b) Rewards that were never claimed');
    console.log('   c) Test stakes that were not properly withdrawn');
    console.log('\n   Unfortunately, since the contract has no emergencyWithdraw:');
    console.log('   ❌ The 0.8 BNB is PERMANENTLY LOCKED');
  } else {
    console.log('⚠️  Option 1: Users have active stakes');
    console.log(`   Total staked: ${hre.ethers.formatEther(totalPrincipal)} BNB`);
    console.log('   The 0.8 BNB may include user principal and cannot be withdrawn');
  }

  console.log('\n❌ Option 2: Add emergencyWithdraw function');
  console.log('   Impossible - smart contracts are immutable');
  console.log('   Cannot modify already deployed contract');

  console.log('\n❌ Option 3: Use selfdestruct');
  console.log('   The contract does not have a selfdestruct function');
  console.log('   Cannot force-send the BNB out');

  console.log('\n❌ Option 4: Upgrade to new implementation');
  console.log('   The contract is not upgradeable (no proxy pattern)');
  console.log('   Cannot change the implementation');

  console.log('\n💡 SOLUTION: Accept the Loss');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('The 0.8 BNB in the old router is permanently locked.');
  console.log('This is a lesson learned:');
  console.log('• Always include emergency recovery functions in contracts');
  console.log('• Test emergency scenarios before deploying to mainnet');
  console.log('• Consider using upgradeable proxy patterns for critical contracts');
  
  console.log('\n✅ Good News:');
  console.log('• New router deployed with emergencyWithdrawBNB()');
  console.log('• Future BNB can be recovered if needed');
  console.log('• 0.8 BNB is relatively small loss on testnet');

  console.log('\n📝 Next Steps:');
  console.log('1. Accept that 0.8 BNB is lost');
  console.log('2. Use the new router: 0x321eCab2d08029De195E11ae43a4a7Efe9674274');
  console.log('3. Get more testnet BNB from faucet if needed');
  console.log('4. Before mainnet deployment, thoroughly test emergency functions');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
