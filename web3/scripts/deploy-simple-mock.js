const hre = require('hardhat');

async function main() {
  const routerAddress = '0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78';
  
  console.log('Deploying SimpleMockAdapter...');
  console.log('Router:', routerAddress);

  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying with account:', deployer.address);
  console.log('Account balance:', hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), 'BNB');

  const Adapter = await hre.ethers.getContractFactory('SimpleMockAdapter');
  const adapter = await Adapter.deploy(routerAddress);
  await adapter.waitForDeployment();

  const adapterAddress = await adapter.getAddress();
  console.log('✅ SimpleMockAdapter deployed to:', adapterAddress);

  console.log('\n📝 Next steps:');
  console.log('1. Run: allowAdapter(address, true) on router');
  console.log(`   Address: ${adapterAddress}`);
  console.log('2. Run: setAdapter(address) on router');
  console.log(`   Address: ${adapterAddress}`);
  console.log('\n3. Update .env.local:');
  console.log(`   NEXT_PUBLIC_ADAPTER_ADDRESS=${adapterAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
