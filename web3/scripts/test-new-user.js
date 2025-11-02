const hre = require('hardhat');

async function main() {
  const ROUTER = '0x6A17e9aa65f9121eCd1dB3b164B93227eEd3708C';
  const ADAPTER = '0xE62fcEDfE9f31d6B07B18f4cc62d2b6652E5E39C';
  
  console.log('🔍 FRONTEND CONNECTION TEST\n');
  console.log('Testing with your current wallet...\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const [signer] = await hre.ethers.getSigners();
  console.log('👛 Connected Wallet:', signer.address);
  
  const balance = await hre.ethers.provider.getBalance(signer.address);
  console.log('💰 Balance:', hre.ethers.formatEther(balance), 'BNB\n');

  const Router = await hre.ethers.getContractFactory('StakingRouterBNB');
  const router = Router.attach(ROUTER);
  
  const Adapter = await hre.ethers.getContractFactory('SimpleMockAdapter');
  const adapter = Adapter.attach(ADAPTER);

  console.log('📊 CONTRACT STATUS:\n');
  
  // Check router
  try {
    const isPaused = await router.paused();
    console.log('✅ Router connected:', ROUTER);
    console.log('   Paused:', isPaused);
  } catch (error) {
    console.log('❌ Router connection failed:', error.message);
  }

  // Check adapter
  try {
    const adapterBalance = await hre.ethers.provider.getBalance(ADAPTER);
    console.log('✅ Adapter connected:', ADAPTER);
    console.log('   Balance:', hre.ethers.formatEther(adapterBalance), 'BNB');
  } catch (error) {
    console.log('❌ Adapter connection failed:', error.message);
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('🧪 TESTING BASIC READ OPERATIONS:\n');
  
  // Test read operations
  try {
    const shares = await router.sharesOf(signer.address);
    console.log('✅ sharesOf():', shares.toString());
  } catch (error) {
    console.log('❌ sharesOf() failed:', error.message);
  }

  try {
    const totalShares = await router.totalShares();
    console.log('✅ totalShares():', totalShares.toString());
  } catch (error) {
    console.log('❌ totalShares() failed:', error.message);
  }

  try {
    const totalPrincipal = await router.totalPrincipal();
    console.log('✅ totalPrincipal():', hre.ethers.formatEther(totalPrincipal), 'BNB');
  } catch (error) {
    console.log('❌ totalPrincipal() failed:', error.message);
  }

  try {
    const queueLength = await router.queueLength();
    console.log('✅ queueLength():', queueLength.toString());
  } catch (error) {
    console.log('❌ queueLength() failed:', error.message);
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('🧪 TESTING SMALL STAKE (0.001 BNB):\n');

  // Test small stake
  try {
    const stakeAmount = hre.ethers.parseEther('0.001');
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    
    // Estimate gas first
    const gasEstimate = await router.depositBNB.estimateGas(deadline, {
      value: stakeAmount
    });
    console.log('✅ Gas estimate:', gasEstimate.toString());
    
    console.log('\n💵 Staking 0.001 BNB...');
    const tx = await router.depositBNB(deadline, {
      value: stakeAmount
    });
    console.log('⏳ Transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('✅ Transaction confirmed!');
    console.log('   Block:', receipt.blockNumber);
    console.log('   Gas used:', receipt.gasUsed.toString());
    
    // Check new shares
    const newShares = await router.sharesOf(signer.address);
    console.log('✅ Your new shares:', newShares.toString());
    
  } catch (error) {
    console.log('❌ Stake failed:', error.message);
    if (error.data) {
      console.log('   Error data:', error.data);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('📋 TROUBLESHOOTING GUIDE:\n');
  console.log('If you see "Transaction dropped or replaced" in MetaMask:');
  console.log('');
  console.log('1. Clear MetaMask cache:');
  console.log('   • Open MetaMask');
  console.log('   • Settings → Advanced');
  console.log('   • Click "Clear activity tab data"');
  console.log('   • Click "Reset account"');
  console.log('');
  console.log('2. Check network:');
  console.log('   • Make sure you\'re on BSC Testnet (Chain ID: 97)');
  console.log('   • RPC: https://data-seed-prebsc-1-s1.binance.org:8545');
  console.log('');
  console.log('3. Get testnet BNB:');
  console.log('   • https://testnet.bnbchain.org/faucet-smart');
  console.log('');
  console.log('4. Check contract addresses in frontend:');
  console.log('   • Router:', ROUTER);
  console.log('   • Adapter:', ADAPTER);
  console.log('');
  console.log('5. Hard refresh frontend:');
  console.log('   • Press Ctrl+Shift+R (Windows)');
  console.log('   • Or Cmd+Shift+R (Mac)');
  console.log('═══════════════════════════════════════════════════════════════\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
