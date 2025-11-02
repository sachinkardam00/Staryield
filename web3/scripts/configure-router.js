const hre = require('hardhat');

async function main() {
  const routerAddress = '0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78';
  const newAdapterAddress = '0xE62fcEDfE9f31d6B07B18f4cc62d2b6652E5E39C';
  
  console.log('Configuring Router to use new SimpleMockAdapter...');
  console.log('Router:', routerAddress);
  console.log('New Adapter:', newAdapterAddress);

  const [deployer] = await hre.ethers.getSigners();
  console.log('Using account:', deployer.address);

  // Get router contract
  const Router = await hre.ethers.getContractFactory('StakingRouterBNB');
  const router = Router.attach(routerAddress);

  // Check current owner
  const owner = await router.owner();
  console.log('Router owner:', owner);
  
  if (owner.toLowerCase() !== deployer.address.toLowerCase()) {
    console.error('❌ You are not the router owner! Cannot configure.');
    console.error(`   Current owner: ${owner}`);
    console.error(`   Your address: ${deployer.address}`);
    process.exit(1);
  }

  // 1. Allow new adapter
  console.log('\n1. Allowing new adapter...');
  const allowTx = await router.allowAdapter(newAdapterAddress, true);
  await allowTx.wait();
  console.log('✅ Adapter allowed');

  // 2. Set as active adapter
  console.log('\n2. Setting as active adapter...');
  const setTx = await router.setAdapter(newAdapterAddress);
  await setTx.wait();
  console.log('✅ Adapter set as active');

  // Verify
  const currentAdapter = await router.adapter();
  console.log('\n✅ Current active adapter:', currentAdapter);
  
  if (currentAdapter.toLowerCase() === newAdapterAddress.toLowerCase()) {
    console.log('✅ Configuration successful!');
    console.log('\n📝 Update your .env.local:');
    console.log(`NEXT_PUBLIC_ADAPTER_ADDRESS=${newAdapterAddress}`);
  } else {
    console.log('❌ Configuration failed - adapter not set correctly');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
