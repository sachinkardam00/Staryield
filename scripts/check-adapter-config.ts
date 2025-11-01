import { createPublicClient, http, parseAbi } from 'viem';
import { bscTestnet } from 'viem/chains';

const ROUTER_ADDRESS = '0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78';
const EXPECTED_ADAPTER = '0x53b595246C29Edab594c91D99a503cB9be6758eb';

const publicClient = createPublicClient({
  chain: bscTestnet,
  transport: http('https://data-seed-prebsc-1-s1.binance.org:8545/')
});

async function checkAdapterConfig() {
  console.log('Checking adapter configuration...');
  
  const abi = parseAbi([
    'function currentAdapter() view returns (address)',
    'function isAdapterAllowed(address) view returns (bool)',
    'function router() view returns (address)'
  ]);

  const currentAdapter = await publicClient.readContract({
    address: ROUTER_ADDRESS as `0x${string}`,
    abi,
    functionName: 'currentAdapter'
  });

  const isAllowed = await publicClient.readContract({
    address: ROUTER_ADDRESS as `0x${string}`,
    abi,
    functionName: 'isAdapterAllowed',
    args: [EXPECTED_ADAPTER as `0x${string}`]
  });

  console.log('\n=== Router Adapter Config ===');
  console.log('Current Adapter:', currentAdapter);
  console.log('Expected Adapter:', EXPECTED_ADAPTER);
  console.log('Is Allowed:', isAllowed);
  console.log('Match:', currentAdapter.toLowerCase() === EXPECTED_ADAPTER.toLowerCase() ? '✅' : '❌');

  // Check adapter's router setting
  const adapterAbi = parseAbi(['function router() view returns (address)']);
  const adapterRouter = await publicClient.readContract({
    address: EXPECTED_ADAPTER as `0x${string}`,
    abi: adapterAbi,
    functionName: 'router'
  });

  console.log('\n=== Adapter Router Config ===');
  console.log('Adapter\'s Router:', adapterRouter);
  console.log('Expected Router:', ROUTER_ADDRESS);
  console.log('Match:', adapterRouter.toLowerCase() === ROUTER_ADDRESS.toLowerCase() ? '✅' : '❌');

  if (currentAdapter.toLowerCase() !== EXPECTED_ADAPTER.toLowerCase()) {
    console.log('\n❌ ERROR: Adapter mismatch! Router is using a different adapter.');
  }
  
  if (adapterRouter.toLowerCase() !== ROUTER_ADDRESS.toLowerCase()) {
    console.log('\n❌ ERROR: Adapter pointing to wrong router!');
  }
  
  if (currentAdapter.toLowerCase() === EXPECTED_ADAPTER.toLowerCase() && 
      adapterRouter.toLowerCase() === ROUTER_ADDRESS.toLowerCase()) {
    console.log('\n✅ Configuration looks correct!');
    console.log('The issue might be with the callback mechanism.');
  }
}

checkAdapterConfig();
