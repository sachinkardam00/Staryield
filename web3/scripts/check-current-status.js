const fetch = require('node-fetch');

async function checkStatus() {
  const userAddress = "0x45F3a935F36ebbe3be3da8C9c14ff95023403acd";
  const routerAddress = "0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78";
  const oldAdapterAddress = "0x5975cB954D4C957Cec14cbbc923D927b4d0A0AAF";
  const newAdapterAddress = "0x58E7DF3cAae6EEb94A76Ac3b74eC88049F438e7B";

  console.log("\n=== Checking Current Status ===\n");

  const rpc = "https://data-seed-prebsc-1-s1.binance.org:8545/";

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

  await checkBalance(userAddress, "User wallet        ");
  const routerBal = await checkBalance(routerAddress, "Router             ");
  const oldAdapterBal = await checkBalance(oldAdapterAddress, "Old Adapter (0x59..)");
  const newAdapterBal = await checkBalance(newAdapterAddress, "New Adapter (0x58..)");

  console.log("\n=== Issue Identified ===");
  if (oldAdapterBal > 0) {
    console.log(`❌ Your ${oldAdapterBal} BNB is in the OLD adapter`);
    console.log("   The old adapter doesn't have time-based rewards");
  }
  if (newAdapterBal > 0) {
    console.log(`✅ ${newAdapterBal} BNB is in the NEW adapter`);
    console.log("   This will generate time-based rewards");
  }
  if (routerBal > 0) {
    console.log(`⚠️  ${routerBal} BNB is in the Router`);
    console.log("   This might be from unstaked funds");
  }

  // Check router's view of user shares
  console.log("\n=== Checking Router State ===");
  
  const sharesOfData = `0x170497a4000000000000000000000000${userAddress.slice(2)}`;
  const sharesResponse = await fetch(rpc, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_call',
      params: [{
        to: routerAddress,
        data: sharesOfData
      }, 'latest']
    })
  });
  const sharesData = await sharesResponse.json();
  if (sharesData.result && sharesData.result !== '0x') {
    const shares = BigInt(sharesData.result);
    console.log("User shares in router:", Number(shares) / 1e18, "BNB");
  }

  console.log("\n=== Solution ===");
  console.log("1. Unstake your 0.5 BNB from old adapter");
  console.log("2. Re-stake to new adapter for time-based rewards");
  console.log("3. Wait a few minutes and rewards will show!");
}

checkStatus().catch(console.error);
