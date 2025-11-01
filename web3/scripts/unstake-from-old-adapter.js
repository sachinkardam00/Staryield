const hre = require("hardhat");

async function main() {
  const routerAddress = "0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78";
  const oldAdapterAddress = "0x5975cB954D4C957Cec14cbbc923D927b4d0A0AAF";

  console.log("\n🔄 Switching to OLD adapter temporarily to unstake funds...\n");

  const router = await hre.ethers.getContractAt("StakingRouterBNB", routerAddress);

  // Step 1: Set old adapter as current
  console.log("1️⃣  Setting old adapter as current...");
  const setTx = await router.setAdapter(oldAdapterAddress);
  await setTx.wait();
  console.log("✅ Old adapter set:", setTx.hash);

  // Step 2: Unstake all from old adapter (0.1 BNB)
  console.log("\n2️⃣  Unstaking 0.1 BNB from old adapter...");
  const deadline = Math.floor(Date.now() / 1000) + 600; // 10 minutes from now
  const unstakeTx = await router.requestUnstake(hre.ethers.parseEther("0.1"), deadline);
  await unstakeTx.wait();
  console.log("✅ Unstake requested:", unstakeTx.hash);

  // Step 3: Wait for unbonding (should be instant with 0 seconds)
  console.log("\n3️⃣  Waiting 3 seconds for transaction to finalize...");
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Step 4: Withdraw from queue
  console.log("\n4️⃣  Withdrawing from unbond queue...");
  try {
    const withdrawTx = await router.withdraw(0); // Queue index 0
    await withdrawTx.wait();
    console.log("✅ Withdrawn:", withdrawTx.hash);
  } catch (e) {
    console.log("Note:", e.message);
    console.log("Funds may already be in router");
  }

  // Step 5: Switch back to new adapter
  console.log("\n5️⃣  Switching back to new adapter...");
  const newAdapterAddress = "0x58E7DF3cAae6EEb94A76Ac3b74eC88049F438e7B";
  const switchTx = await router.setAdapter(newAdapterAddress);
  await switchTx.wait();
  console.log("✅ New adapter restored:", switchTx.hash);

  console.log("\n✅ Done! Your 0.1 BNB from old adapter should now be in the router.");
  console.log("Total in router should be ~0.4 BNB (0.3 + 0.1)");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
