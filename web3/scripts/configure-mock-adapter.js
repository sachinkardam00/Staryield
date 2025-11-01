const { ethers } = require('hardhat');

async function main() {
  console.log('🔧 Configuring Router to use MockStakingAdapter...\n');

  const [deployer] = await ethers.getSigners();
  console.log('Using account:', deployer.address);

  const routerAddress = process.env.NEXT_PUBLIC_ROUTER_ADDRESS;
  const mockAdapterAddress = '0x53b595246C29Edab594c91D99a503cB9be6758eb';

  console.log('Router:', routerAddress);
  console.log('Mock Adapter:', mockAdapterAddress);
  console.log('');

  // Router ABI (minimal)
  const routerABI = [
    'function allowAdapter(address a, bool allowed) external',
    'function setAdapter(address a) external',
    'function adapter() external view returns (address)',
    'function allowedAdapter(address) external view returns (bool)'
  ];

  const router = new ethers.Contract(routerAddress, routerABI, deployer);

  try {
    // Step 1: Allow the mock adapter
    console.log('Step 1: Allowing mock adapter...');
    const tx1 = await router.allowAdapter(mockAdapterAddress, true);
    console.log('Transaction hash:', tx1.hash);
    await tx1.wait();
    console.log('✅ Mock adapter allowed\n');

    // Step 2: Set the mock adapter as active
    console.log('Step 2: Setting mock adapter as active...');
    const tx2 = await router.setAdapter(mockAdapterAddress);
    console.log('Transaction hash:', tx2.hash);
    await tx2.wait();
    console.log('✅ Mock adapter set as active\n');

    // Verify
    const currentAdapter = await router.adapter();
    const isAllowed = await router.allowedAdapter(mockAdapterAddress);
    
    console.log('📋 Verification:');
    console.log('Current adapter:', currentAdapter);
    console.log('Is allowed:', isAllowed);
    
    if (currentAdapter.toLowerCase() === mockAdapterAddress.toLowerCase() && isAllowed) {
      console.log('\n🎉 SUCCESS! Router is now configured to use the mock adapter.');
      console.log('\n✅ You can now test staking with amounts >= 0.1 BNB');
      console.log('   Run: npm run dev');
    } else {
      console.log('\n⚠️ Configuration may not be complete. Please check manually.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('NotOwner')) {
      console.error('\n⚠️ Only the router owner can configure adapters.');
      console.error('   Current signer:', deployer.address);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
