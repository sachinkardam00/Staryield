import { createPublicClient, http, parseAbi, formatEther } from 'viem';
import { bscTestnet } from 'viem/chains';

const ROUTER_ADDRESS = '0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78';
const USER_ADDRESS = '0x45F3a935F36ebbe3be3da8C9c14ff95023403acd';

const publicClient = createPublicClient({
  chain: bscTestnet,
  transport: http('https://data-seed-prebsc-1-s1.binance.org:8545/')
});

async function checkUnbondQueue() {
  console.log('Checking unbond queue...');
  console.log('Router:', ROUTER_ADDRESS);
  console.log('User:', USER_ADDRESS);
  
  const abi = parseAbi([
    'function queueLength() view returns (uint256)',
    'function unbondQueue(uint256) view returns (address user, uint256 shares, uint256 bnbAmount, uint256 readyAt, bool claimed)',
    'function unbondingPeriod() view returns (uint256)'
  ]);

  try {
    const [queueLength, unbondingPeriod] = await Promise.all([
      publicClient.readContract({
        address: ROUTER_ADDRESS as `0x${string}`,
        abi,
        functionName: 'queueLength'
      }),
      publicClient.readContract({
        address: ROUTER_ADDRESS as `0x${string}`,
        abi,
        functionName: 'unbondingPeriod'
      })
    ]);

    console.log('\n=== Queue Status ===');
    console.log('Total queue length:', queueLength.toString());
    console.log('Unbonding period:', unbondingPeriod.toString(), 'seconds');
    
    if (queueLength === BigInt(0)) {
      console.log('\n❌ Queue is empty - no pending unstakes');
      return;
    }

    console.log('\n=== Your Unstake Requests ===');
    let foundUserRequests = false;
    
    for (let i = 0; i < Number(queueLength); i++) {
      const request = await publicClient.readContract({
        address: ROUTER_ADDRESS as `0x${string}`,
        abi,
        functionName: 'unbondQueue',
        args: [BigInt(i)]
      }) as [string, bigint, bigint, bigint, boolean];

      const [user, shares, bnbAmount, readyAt, claimed] = request;
      
      if (user.toLowerCase() === USER_ADDRESS.toLowerCase()) {
        foundUserRequests = true;
        const currentTime = Math.floor(Date.now() / 1000);
        const isReady = currentTime >= Number(readyAt);
        
        console.log(`\nIndex ${i}:`);
        console.log('  User:', user);
        console.log('  Shares:', formatEther(shares));
        console.log('  BNB Amount:', formatEther(bnbAmount), 'BNB');
        console.log('  Ready At:', new Date(Number(readyAt) * 1000).toLocaleString());
        console.log('  Claimed:', claimed);
        console.log('  Status:', isReady ? '✅ READY TO WITHDRAW' : '⏳ Waiting for unbonding period');
        
        if (isReady && !claimed) {
          console.log(`\n💡 You can withdraw this! Run: withdrawUnbonded(${i})`);
        } else if (claimed) {
          console.log('  ℹ️  Already withdrawn');
        }
      }
    }
    
    if (!foundUserRequests) {
      console.log('\n❌ No unstake requests found for your address');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkUnbondQueue();
