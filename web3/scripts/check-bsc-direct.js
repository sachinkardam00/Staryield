const fetch = require('node-fetch');

async function checkBscTestnet() {
  const userAddress = "0x45F3a935F36ebbe3be3da8C9c14ff95023403acd";
  const routerAddress = "0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78";
  const adapterAddress = "0x5975cB954D4C957Cec14cbbc923D927b4d0A0AAF";

  console.log("\n=== Checking BSC Testnet via RPC ===\n");

  const rpc = "https://data-seed-prebsc-1-s1.binance.org:8545/";

  // Check balances
  const checkBalance = async (address, name) => {
    const response = await fetch(rpc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBalance',
        params: [address, 'latest']
      })
    });
    const data = await response.json();
    const balanceWei = BigInt(data.result);
    const balanceBNB = Number(balanceWei) / 1e18;
    console.log(`${name}: ${balanceBNB.toFixed(4)} BNB`);
    return balanceBNB;
  };

  await checkBalance(userAddress, "User wallet   ");
  const adapterBal = await checkBalance(adapterAddress, "Adapter       ");
  await checkBalance(routerAddress, "Router        ");

  console.log("\n=== Expected Rewards if harvest() called ===");
  const rewardsEstimate = adapterBal * 0.001; // 0.1%
  console.log(`Harvest would generate: ${rewardsEstimate.toFixed(6)} BNB\n`);

  // Get current block
  const blockResponse = await fetch(rpc, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_blockNumber',
      params: []
    })
  });
  const blockData = await blockResponse.json();
  const currentBlock = parseInt(blockData.result, 16);
  console.log(`Current block: ${currentBlock}`);

  // Check recent transactions
  console.log("\n=== Checking recent stake transactions ===");
  const startBlock = currentBlock - 500;
  
  for (let i = currentBlock; i >= startBlock; i -= 1) {
    const blockResponse = await fetch(rpc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBlockByNumber',
        params: [`0x${i.toString(16)}`, true]
      })
    });
    const blockData = await blockResponse.json();
    
    if (blockData.result && blockData.result.transactions) {
      for (const tx of blockData.result.transactions) {
        if (
          tx.from.toLowerCase() === userAddress.toLowerCase() &&
          tx.to?.toLowerCase() === routerAddress.toLowerCase() &&
          parseInt(tx.value, 16) > 0
        ) {
          const valueInBNB = parseInt(tx.value, 16) / 1e18;
          const timestamp = parseInt(blockData.result.timestamp, 16);
          console.log(`\n✅ Found stake transaction:`);
          console.log(`   Hash: ${tx.hash}`);
          console.log(`   Block: ${i}`);
          console.log(`   Time: ${new Date(timestamp * 1000).toLocaleString()}`);
          console.log(`   Amount: ${valueInBNB} BNB`);
        }
      }
    }
  }
}

checkBscTestnet().catch(console.error);
