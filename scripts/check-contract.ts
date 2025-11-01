import { createPublicClient, http, formatEther } from 'viem';
import { bscTestnet } from 'viem/chains';

const ROUTER_ADDRESS = '0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78';
const ADAPTER_ADDRESS = '0x53b595246C29Edab594c91D99a503cB9be6758eb'; // Mock Adapter

// Minimal ABI for checking contract state
const ROUTER_ABI = [
  {
    "inputs": [],
    "name": "adapter",
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
    "inputs": [{ "name": "", "type": "address" }],
    "name": "allowedAdapter",
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

async function checkContract() {
  const client = createPublicClient({
    chain: bscTestnet,
    transport: http('https://data-seed-prebsc-1-s1.binance.org:8545')
  });

  console.log('🔍 Checking StakingRouterBNB Contract...\n');
  console.log('Router Address:', ROUTER_ADDRESS);
  console.log('Adapter Address:', ADAPTER_ADDRESS);
  console.log('');

  try {
    // Check if contract exists
    const code = await client.getBytecode({ address: ROUTER_ADDRESS as `0x${string}` });
    if (!code || code === '0x') {
      console.log('❌ Contract not deployed at this address!');
      return;
    }
    console.log('✅ Contract is deployed\n');

    // Check paused status
    const paused = await client.readContract({
      address: ROUTER_ADDRESS as `0x${string}`,
      abi: ROUTER_ABI,
      functionName: 'paused'
    });
    console.log('Paused:', paused ? '❌ YES (Contract is paused!)' : '✅ NO');

    // Check owner
    const owner = await client.readContract({
      address: ROUTER_ADDRESS as `0x${string}`,
      abi: ROUTER_ABI,
      functionName: 'owner'
    });
    console.log('Owner:', owner);

    // Check adapter
    const adapter = await client.readContract({
      address: ROUTER_ADDRESS as `0x${string}`,
      abi: ROUTER_ABI,
      functionName: 'adapter'
    });
    console.log('Current Adapter:', adapter);
    
    if (adapter === '0x0000000000000000000000000000000000000000') {
      console.log('❌ PROBLEM: Adapter is not set! This will cause transactions to fail.');
      console.log('   Solution: Call allowAdapter() then setAdapter() as owner.');
    } else {
      console.log('✅ Adapter is set');
    }

    // Check if adapter is allowed
    const isAllowed = await client.readContract({
      address: ROUTER_ADDRESS as `0x${string}`,
      abi: ROUTER_ABI,
      functionName: 'allowedAdapter',
      args: [ADAPTER_ADDRESS as `0x${string}`]
    });
    console.log('Adapter Allowed:', isAllowed ? '✅ YES' : '❌ NO (needs to be allowed first)');

    console.log('\n📋 Summary:');
    if (paused) {
      console.log('⚠️  Contract is PAUSED - unpause it to allow deposits');
    }
    if (adapter === '0x0000000000000000000000000000000000000000') {
      console.log('⚠️  No adapter set - deposits will fail');
      console.log('   Run: allowAdapter(' + ADAPTER_ADDRESS + ', true)');
      console.log('   Then: setAdapter(' + ADAPTER_ADDRESS + ')');
    }
    if (!isAllowed) {
      console.log('⚠️  Adapter not in allowlist - add it first');
    }

    if (!paused && adapter !== '0x0000000000000000000000000000000000000000' && isAllowed) {
      console.log('✅ Contract looks ready to accept deposits!');
    }

  } catch (error: any) {
    console.error('❌ Error checking contract:', error.message);
  }
}

checkContract().catch(console.error);
