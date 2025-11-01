import { createPublicClient, http, parseAbi, formatEther } from 'viem';
import { bscTestnet } from 'viem/chains';

const ROUTER_ADDRESS = '0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78';
const USER_ADDRESS = '0x45F3a935F36ebbe3be3da8C9c14ff95023403acd';

const publicClient = createPublicClient({
  chain: bscTestnet,
  transport: http('https://data-seed-prebsc-1-s1.binance.org:8545/')
});

const eventAbi = parseAbi([
  'event Deposited(address indexed user, uint256 amount, uint256 shares)',
  'event UnstakeRequested(address indexed user, uint256 shares, uint256 index)',
  'event Claimed(address indexed user, uint256 amount)',
  'event Withdrawn(address indexed user, uint256 index, uint256 amount)'
]);

async function checkEvents() {
  console.log('Checking events for router:', ROUTER_ADDRESS);
  console.log('User address:', USER_ADDRESS);
  
  const currentBlock = await publicClient.getBlockNumber();
  console.log('Current block:', currentBlock.toString());
  
  const fromBlock = currentBlock > BigInt(1000) ? currentBlock - BigInt(1000) : BigInt(0);
  console.log('Scanning from block:', fromBlock.toString());
  
  try {
    // Check Deposited events
    console.log('\n=== Checking Deposited Events ===');
    const depositLogs = await publicClient.getLogs({
      address: ROUTER_ADDRESS as `0x${string}`,
      event: eventAbi[0],
      args: { user: USER_ADDRESS as `0x${string}` },
      fromBlock,
      toBlock: 'latest'
    });
    
    console.log(`Found ${depositLogs.length} deposit events`);
    for (const log of depositLogs) {
      const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
      console.log({
        blockNumber: log.blockNumber.toString(),
        txHash: log.transactionHash,
        amount: formatEther(log.args.amount || BigInt(0)),
        shares: formatEther(log.args.shares || BigInt(0)),
        timestamp: new Date(Number(block.timestamp) * 1000).toLocaleString()
      });
    }
    
    // Check UnstakeRequested events
    console.log('\n=== Checking UnstakeRequested Events ===');
    const unstakeLogs = await publicClient.getLogs({
      address: ROUTER_ADDRESS as `0x${string}`,
      event: eventAbi[1],
      args: { user: USER_ADDRESS as `0x${string}` },
      fromBlock,
      toBlock: 'latest'
    });
    
    console.log(`Found ${unstakeLogs.length} unstake events`);
    for (const log of unstakeLogs) {
      const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
      console.log({
        blockNumber: log.blockNumber.toString(),
        txHash: log.transactionHash,
        shares: formatEther(log.args.shares || BigInt(0)),
        index: log.args.index?.toString(),
        timestamp: new Date(Number(block.timestamp) * 1000).toLocaleString()
      });
    }
    
    // Check Claimed events
    console.log('\n=== Checking Claimed Events ===');
    const claimLogs = await publicClient.getLogs({
      address: ROUTER_ADDRESS as `0x${string}`,
      event: eventAbi[2],
      args: { user: USER_ADDRESS as `0x${string}` },
      fromBlock,
      toBlock: 'latest'
    });
    
    console.log(`Found ${claimLogs.length} claim events`);
    for (const log of claimLogs) {
      const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
      console.log({
        blockNumber: log.blockNumber.toString(),
        txHash: log.transactionHash,
        amount: formatEther(log.args.amount || BigInt(0)),
        timestamp: new Date(Number(block.timestamp) * 1000).toLocaleString()
      });
    }
    
  } catch (error) {
    console.error('Error fetching events:', error);
  }
}

checkEvents();
