import { createPublicClient, http, parseAbi } from 'viem';
import { bscTestnet } from 'viem/chains';

const ROUTER_ADDRESS = '0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78';
const USER_ADDRESS = '0x45F3a935F36ebbe3be3da8C9c14ff95023403acd';

const publicClient = createPublicClient({
  chain: bscTestnet,
  transport: http('https://data-seed-prebsc-1-s1.binance.org:8545/')
});

async function checkUserShares() {
  console.log('Checking user shares...');
  console.log('Router:', ROUTER_ADDRESS);
  console.log('User:', USER_ADDRESS);
  
  const abi = parseAbi([
    'function sharesOf(address) view returns (uint256)',
    'function totalShares() view returns (uint256)',
    'function totalPrincipal() view returns (uint256)',
    'function pendingRewards(address) view returns (uint256)',
    'function currentAdapter() view returns (address)'
  ]);

  try {
    const [shares, totalShares, totalPrincipal, rewards, adapter] = await Promise.all([
      publicClient.readContract({
        address: ROUTER_ADDRESS as `0x${string}`,
        abi,
        functionName: 'sharesOf',
        args: [USER_ADDRESS as `0x${string}`]
      }),
      publicClient.readContract({
        address: ROUTER_ADDRESS as `0x${string}`,
        abi,
        functionName: 'totalShares'
      }),
      publicClient.readContract({
        address: ROUTER_ADDRESS as `0x${string}`,
        abi,
        functionName: 'totalPrincipal'
      }),
      publicClient.readContract({
        address: ROUTER_ADDRESS as `0x${string}`,
        abi,
        functionName: 'pendingRewards',
        args: [USER_ADDRESS as `0x${string}`]
      }),
      publicClient.readContract({
        address: ROUTER_ADDRESS as `0x${string}`,
        abi,
        functionName: 'currentAdapter'
      })
    ]);

    console.log('\n=== User Status ===');
    console.log('User Shares:', shares.toString(), 'wei');
    console.log('User Shares (BNB):', (Number(shares) / 1e18).toFixed(6), 'BNB');
    console.log('Pending Rewards:', rewards.toString(), 'wei');
    console.log('Pending Rewards (BNB):', (Number(rewards) / 1e18).toFixed(6), 'BNB');
    
    console.log('\n=== Contract Status ===');
    console.log('Total Shares:', totalShares.toString());
    console.log('Total Principal:', totalPrincipal.toString(), 'wei');
    console.log('Total Principal (BNB):', (Number(totalPrincipal) / 1e18).toFixed(6), 'BNB');
    console.log('Current Adapter:', adapter);
    
    console.log('\n=== Can Unstake? ===');
    if (shares > BigInt(0)) {
      console.log('✅ Yes! User has', (Number(shares) / 1e18).toFixed(6), 'shares to unstake');
    } else {
      console.log('❌ No! User has 0 shares');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkUserShares();
