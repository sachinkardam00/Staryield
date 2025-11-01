import { createPublicClient, http } from 'viem';
import { bscTestnet } from 'viem/chains';

const ROUTER_ADDRESS = '0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78';
const ADAPTER_ADDRESS = '0xf66693a90Bd8c69e96f6E82a881c41F16ceBF080';

// Adapter ABI
const ADAPTER_ABI = [
  {
    "inputs": [],
    "name": "router",
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "stakeHub",
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "validator",
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "selDelegate",
    "outputs": [{ "name": "", "type": "bytes4" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

async function checkAdapter() {
  const client = createPublicClient({
    chain: bscTestnet,
    transport: http('https://data-seed-prebsc-1-s1.binance.org:8545')
  });

  console.log('🔍 Checking StakingAdapterBNB...\n');
  console.log('Adapter Address:', ADAPTER_ADDRESS);
  console.log('');

  try {
    // Check if contract exists
    const code = await client.getBytecode({ address: ADAPTER_ADDRESS as `0x${string}` });
    if (!code || code === '0x') {
      console.log('❌ Adapter contract not deployed at this address!');
      return;
    }
    console.log('✅ Adapter contract is deployed\n');

    // Check paused status
    const paused = await client.readContract({
      address: ADAPTER_ADDRESS as `0x${string}`,
      abi: ADAPTER_ABI,
      functionName: 'paused'
    });
    console.log('Paused:', paused ? '❌ YES (Adapter is paused!)' : '✅ NO');

    // Check router
    const router = await client.readContract({
      address: ADAPTER_ADDRESS as `0x${string}`,
      abi: ADAPTER_ABI,
      functionName: 'router'
    });
    console.log('Router:', router);
    if (router.toLowerCase() !== ROUTER_ADDRESS.toLowerCase()) {
      console.log('❌ PROBLEM: Router address mismatch!');
      console.log('   Expected:', ROUTER_ADDRESS);
      console.log('   Got:', router);
    } else {
      console.log('✅ Router is correctly set');
    }

    // Check stakeHub
    const stakeHub = await client.readContract({
      address: ADAPTER_ADDRESS as `0x${string}`,
      abi: ADAPTER_ABI,
      functionName: 'stakeHub'
    });
    console.log('StakeHub:', stakeHub);
    if (stakeHub === '0x0000000000000000000000000000000000000000') {
      console.log('❌ PROBLEM: StakeHub is not set!');
      console.log('   Solution: Call setStakeHub() or wireTestnetDefaults() as owner');
    } else {
      console.log('✅ StakeHub is set');
    }

    // Check validator
    const validator = await client.readContract({
      address: ADAPTER_ADDRESS as `0x${string}`,
      abi: ADAPTER_ABI,
      functionName: 'validator'
    });
    console.log('Validator:', validator);
    if (validator === '0x0000000000000000000000000000000000000000') {
      console.log('❌ PROBLEM: Validator is not set!');
    } else {
      console.log('✅ Validator is set');
    }

    // Check delegate selector
    const selDelegate = await client.readContract({
      address: ADAPTER_ADDRESS as `0x${string}`,
      abi: ADAPTER_ABI,
      functionName: 'selDelegate'
    });
    console.log('Delegate Selector:', selDelegate);
    if (selDelegate === '0x00000000') {
      console.log('❌ PROBLEM: Delegate selector not set!');
    } else {
      console.log('✅ Delegate selector is set');
    }

    console.log('\n📋 Adapter Summary:');
    const problems = [];
    if (paused) problems.push('Adapter is PAUSED');
    if (router.toLowerCase() !== ROUTER_ADDRESS.toLowerCase()) problems.push('Router mismatch');
    if (stakeHub === '0x0000000000000000000000000000000000000000') problems.push('StakeHub not set');
    if (validator === '0x0000000000000000000000000000000000000000') problems.push('Validator not set');
    if (selDelegate === '0x00000000') problems.push('Selectors not set');

    if (problems.length > 0) {
      console.log('⚠️  Issues found:');
      problems.forEach(p => console.log('   - ' + p));
      console.log('\n💡 To fix, call as adapter owner:');
      console.log('   adapter.wireTestnetDefaults(routerAddress, validatorAddress)');
    } else {
      console.log('✅ Adapter looks properly configured!');
    }

  } catch (error: any) {
    console.error('❌ Error checking adapter:', error.message);
    console.error(error);
  }
}

checkAdapter().catch(console.error);
