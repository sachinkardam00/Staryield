import { createWalletClient, http } from 'viem';
import { bscTestnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const ROUTER_ADDRESS = '0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78';
const NEW_ADAPTER = '0x5975cB954D4C957Cec14cbbc923D927b4d0A0AAF';
const PRIVATE_KEY = '0xfb30bab886498b4c11ef2cc2a7fae63f395834287fd02a15889a7ff7e73e3f52';

const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);

const walletClient = createWalletClient({
  account,
  chain: bscTestnet,
  transport: http('https://data-seed-prebsc-1-s1.binance.org:8545/')
});

async function configureAdapter() {
  console.log('Configuring SimpleMockAdapter...');
  console.log('Router:', ROUTER_ADDRESS);
  console.log('New Adapter:', NEW_ADAPTER);

  const routerAbi = [
    {
      name: 'allowAdapter',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'adapter_', type: 'address' },
        { name: 'allowed', type: 'bool' }
      ],
      outputs: []
    },
    {
      name: 'setAdapter',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [{ name: 'adapter_', type: 'address' }],
      outputs: []
    }
  ];

  try {
    // 1. Allow the adapter
    console.log('\n1. Allowing adapter...');
    const hash1 = await walletClient.writeContract({
      address: ROUTER_ADDRESS as `0x${string}`,
      abi: routerAbi,
      functionName: 'allowAdapter',
      args: [NEW_ADAPTER as `0x${string}`, true]
    });
    console.log('   Transaction:', hash1);

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 2. Set as current adapter
    console.log('\n2. Setting as current adapter...');
    const hash2 = await walletClient.writeContract({
      address: ROUTER_ADDRESS as `0x${string}`,
      abi: routerAbi,
      functionName: 'setAdapter',
      args: [NEW_ADAPTER as `0x${string}`]
    });
    console.log('   Transaction:', hash2);

    console.log('\n✅ SimpleMockAdapter configured!');
    console.log('\nUpdate .env.local with:');
    console.log(`NEXT_PUBLIC_ADAPTER_ADDRESS=${NEW_ADAPTER}`);
    
  } catch (error: any) {
    console.error('Error:', error.message || error);
  }
}

configureAdapter();
