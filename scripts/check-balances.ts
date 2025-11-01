import { createPublicClient, http, formatEther } from 'viem';
import { bscTestnet } from 'viem/chains';

const ROUTER_ADDRESS = '0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78';
const ADAPTER_ADDRESS = '0x53b595246C29Edab594c91D99a503cB9be6758eb';

const publicClient = createPublicClient({
  chain: bscTestnet,
  transport: http('https://data-seed-prebsc-1-s1.binance.org:8545/')
});

async function checkBalances() {
  console.log('Checking contract balances...');
  
  const [routerBalance, adapterBalance] = await Promise.all([
    publicClient.getBalance({ address: ROUTER_ADDRESS as `0x${string}` }),
    publicClient.getBalance({ address: ADAPTER_ADDRESS as `0x${string}` })
  ]);

  console.log('\n=== Contract Balances ===');
  console.log('Router:', formatEther(routerBalance), 'BNB');
  console.log('Adapter:', formatEther(adapterBalance), 'BNB');
  
  if (adapterBalance === BigInt(0)) {
    console.log('\n❌ Adapter has 0 balance! This is why unstaking fails.');
    console.log('The staked funds are stuck in the adapter contract.');
  } else {
    console.log('\n✅ Adapter has funds available for unstaking');
  }
}

checkBalances();
