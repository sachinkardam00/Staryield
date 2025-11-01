import { createWalletClient, http, parseEther } from 'viem';
import { bscTestnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const ROUTER_ADDRESS = '0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78';
const PRIVATE_KEY = '0xfb30bab886498b4c11ef2cc2a7fae63f395834287fd02a15889a7ff7e73e3f52';

const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);

const walletClient = createWalletClient({
  account,
  chain: bscTestnet,
  transport: http('https://data-seed-prebsc-1-s1.binance.org:8545/')
});

async function setUnbondingPeriod() {
  console.log('Setting unbonding period to 0...');
  console.log('Router:', ROUTER_ADDRESS);
  console.log('From:', account.address);

  try {
    const hash = await walletClient.writeContract({
      address: ROUTER_ADDRESS as `0x${string}`,
      abi: [{
        name: 'setUnbondingPeriod',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'seconds_', type: 'uint256' }],
        outputs: []
      }],
      functionName: 'setUnbondingPeriod',
      args: [BigInt(0)]
    });

    console.log('Transaction sent:', hash);
    console.log('✅ Unbonding period set to 0! Unstaking will be instant.');
    
  } catch (error: any) {
    console.error('Error:', error.message || error);
  }
}

setUnbondingPeriod();
