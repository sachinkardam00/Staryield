const { ethers } = require('hardhat');

async function main() {
  console.log('🚀 Deploying MockStakingAdapter for testing...\n');

  const [deployer] = await ethers.getSigners();
  console.log('Deploying with account:', deployer.address);
  console.log('Account balance:', ethers.formatEther(await ethers.provider.getBalance(deployer.address)), 'BNB\n');

  // Get router address from environment
  const routerAddress = process.env.NEXT_PUBLIC_ROUTER_ADDRESS;
  if (!routerAddress || routerAddress === '0x0000000000000000000000000000000000000000') {
    throw new Error('NEXT_PUBLIC_ROUTER_ADDRESS not set in .env');
  }
  console.log('Router address:', routerAddress);

  // Deploy MockStakingAdapter
  console.log('Deploying MockStakingAdapter...');
  const MockAdapter = await ethers.getContractFactory('MockStakingAdapter');
  const mockAdapter = await MockAdapter.deploy(routerAddress);
  await mockAdapter.waitForDeployment();
  const mockAdapterAddress = await mockAdapter.getAddress();
  console.log('✅ MockStakingAdapter deployed to:', mockAdapterAddress);

  // Instructions
  console.log('\n📋 Next Steps:');
  console.log('1. Update .env.local:');
  console.log(`   NEXT_PUBLIC_ADAPTER_ADDRESS=${mockAdapterAddress}`);
  console.log('\n2. Configure Router (as owner):');
  console.log(`   router.allowAdapter("${mockAdapterAddress}", true)`);
  console.log(`   router.setAdapter("${mockAdapterAddress}")`);
  console.log('\n3. Restart your dev server: npm run dev');
  console.log('\n✅ After this, staking should work for testing!');
  console.log('   Note: This mock adapter doesn\'t actually delegate to StakeHub.');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
