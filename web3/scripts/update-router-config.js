const hre = require('hardhat');

async function main() {
  const NEW_ROUTER = '0xc97cd673e68419247ff4c6f3da0Ef73F1AD84030';
  const ADAPTER_ADDRESS = '0xE62fcEDfE9f31d6B07B18f4cc62d2b6652E5E39C';
  const LOYALTY_ADDRESS = '0x3DB1d7D660d8b8A86d9eBDA20078b55b920433b0';
  
  console.log('🔧 Updating Adapter and Loyalty Contract\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const [deployer] = await hre.ethers.getSigners();
  console.log('Account:', deployer.address);
  
  // Update adapter router
  console.log('\n1️⃣  Updating Adapter...');
  const adapter = await hre.ethers.getContractAt('SimpleMockAdapter', ADAPTER_ADDRESS);
  const tx1 = await adapter.setRouter(NEW_ROUTER);
  await tx1.wait();
  console.log('✅ Adapter router updated to:', NEW_ROUTER);
  
  // Update loyalty contract router
  console.log('\n2️⃣  Updating Loyalty Contract...');
  const loyalty = await hre.ethers.getContractAt('LoyaltyPoints', LOYALTY_ADDRESS);
  const tx2 = await loyalty.setStakingRouter(NEW_ROUTER);
  await tx2.wait();
  console.log('✅ Loyalty router updated to:', NEW_ROUTER);
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('✅ ALL CONTRACTS UPDATED!');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('StakingRouter:', NEW_ROUTER);
  console.log('Adapter:', ADAPTER_ADDRESS);
  console.log('Loyalty:', LOYALTY_ADDRESS);
  console.log('\n🌟 System is now fully integrated!');
  console.log('When you stake BNB, stars will automatically accumulate.\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
