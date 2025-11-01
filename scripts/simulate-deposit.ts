import { createPublicClient, createWalletClient, http, parseEther } from 'viem';
import { bscTestnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const ROUTER_ADDRESS = '0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78';

// Test wallet - DO NOT USE IN PRODUCTION
const TEST_PRIVATE_KEY = '0x0000000000000000000000000000000000000000000000000000000000000001'; // Replace with test wallet

const ABI = [
  {
    "inputs": [{ "name": "deadline", "type": "uint256" }],
    "name": "depositBNB",
    "outputs": [{ "name": "sharesMinted", "type": "uint256" }],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;

async function simulateDeposit() {
  const client = createPublicClient({
    chain: bscTestnet,
    transport: http('https://data-seed-prebsc-1-s1.binance.org:8545')
  });

  console.log('🔍 Simulating depositBNB transaction...\n');

  const testAmount = parseEther('0.1'); // BSC StakeHub minimum
  const deadline = BigInt(Math.floor(Date.now() / 1000) + 1800); // 30 min from now

  try {
    console.log('Simulating with:');
    console.log('  Amount: 0.1 BNB (BSC StakeHub minimum)');
    console.log('  Deadline:', deadline.toString());
    console.log('  From: 0x45f3a935f36ebbe3be3da8c9c14ff95023403acd (owner)');
    console.log('');

    // Simulate the transaction
    const { request } = await client.simulateContract({
      address: ROUTER_ADDRESS as `0x${string}`,
      abi: ABI,
      functionName: 'depositBNB',
      args: [deadline],
      value: testAmount,
      account: '0x45f3a935f36ebbe3be3da8c9c14ff95023403acd' // Owner address
    });

    console.log('✅ Transaction simulation successful!');
    console.log('Expected shares:', request.args?.[0]?.toString());
    console.log('\n✅ The contract should accept deposits.');
    console.log('❓ Check if the user has enough BNB and gas.');

  } catch (error: any) {
    console.error('❌ Transaction simulation failed!');
    console.error('\nError details:');
    console.error('Message:', error.message);
    
    if (error.message.includes('AdapterNotAllowed')) {
      console.error('\n🔴 ISSUE: Adapter not allowed');
      console.error('   Solution: Call allowAdapter() and setAdapter()');
    } else if (error.message.includes('DeadlineExpired')) {
      console.error('\n🔴 ISSUE: Deadline expired');
      console.error('   Solution: Check system clock or increase deadline');
    } else if (error.message.includes('InvalidAmount')) {
      console.error('\n🔴 ISSUE: Invalid amount');
      console.error('   Solution: Send BNB with the transaction (msg.value)');
    } else if (error.message.includes('PAUSED')) {
      console.error('\n🔴 ISSUE: Contract is paused');
      console.error('   Solution: Call unpause() as owner');
    } else if (error.message.includes('DELEGATE_CALL_FAILED')) {
      console.error('\n🔴 ISSUE: Delegation to StakeHub failed');
      console.error('   Possible causes:');
      console.error('   - Validator address invalid');
      console.error('   - StakeHub address wrong');
      console.error('   - Minimum delegation amount not met');
      console.error('   - Validator not active');
    } else {
      console.error('\n🔴 Unknown error. Full details:');
      console.error(error);
    }
  }
}

simulateDeposit().catch(console.error);
