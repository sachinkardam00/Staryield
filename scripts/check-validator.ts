import { createPublicClient, http } from 'viem';
import { bscTestnet } from 'viem/chains';

const STAKEHUB_ADDRESS = '0x0000000000000000000000000000000000002002';
const VALIDATOR_ADDRESS = '0x3D08A6360D6f505A717edFcb3A63F87C14D2A1a1';

// StakeHub minimal ABI for checking validator
const STAKEHUB_ABI = [
  {
    "inputs": [{ "name": "operatorAddress", "type": "address" }],
    "name": "getValidatorBasicInfo",
    "outputs": [
      { "name": "consensusAddress", "type": "address" },
      { "name": "creditContract", "type": "address" },
      { "name": "createdTime", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

async function checkValidator() {
  const client = createPublicClient({
    chain: bscTestnet,
    transport: http('https://data-seed-prebsc-1-s1.binance.org:8545')
  });

  console.log('🔍 Checking Validator Status...\n');
  console.log('StakeHub:', STAKEHUB_ADDRESS);
  console.log('Validator:', VALIDATOR_ADDRESS);
  console.log('');

  try {
    // Check if StakeHub exists
    const code = await client.getBytecode({ address: STAKEHUB_ADDRESS as `0x${string}` });
    if (!code || code === '0x') {
      console.log('❌ StakeHub not found at this address!');
      console.log('⚠️  The StakeHub address might be incorrect for BSC Testnet.');
      console.log('   Current BSC Testnet StakeHub: 0x0000000000000000000000000000000000002002');
      return;
    }
    console.log('✅ StakeHub contract exists\n');

    // Try to get validator info
    console.log('Attempting to query validator information...');
    try {
      const validatorInfo = await client.readContract({
        address: STAKEHUB_ADDRESS as `0x${string}`,
        abi: STAKEHUB_ABI,
        functionName: 'getValidatorBasicInfo',
        args: [VALIDATOR_ADDRESS as `0x${string}`]
      });
      
      console.log('✅ Validator found!');
      console.log('Consensus Address:', validatorInfo[0]);
      console.log('Credit Contract:', validatorInfo[1]);
      console.log('Created Time:', new Date(Number(validatorInfo[2]) * 1000).toISOString());
      
    } catch (err: any) {
      console.log('❌ Could not retrieve validator information');
      console.log('Error:', err.message);
      console.log('\n🔴 PROBLEM: The validator address might be invalid or not registered on BSC Testnet');
      console.log('\n💡 Solutions:');
      console.log('1. Get a valid testnet validator address from:');
      console.log('   https://testnet-staking.bnbchain.org/en/staking');
      console.log('2. Update the adapter with the correct validator:');
      console.log('   adapter.setStakeHub(stakeHubAddress, validValidatorAddress)');
      console.log('3. Or use wireTestnetDefaults with a valid validator');
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

checkValidator().catch(console.error);
