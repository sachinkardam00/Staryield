const hre = require("hardhat");

async function main() {
  const adapterAddress = process.argv[2] || "0x58E7DF3cAae6EEb94A76Ac3b74eC88049F438e7B";
  const routerAddress = "0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78";

  console.log("\n⚙️  Configuring Router with new adapter...\n");
  console.log("Router:", routerAddress);
  console.log("Adapter:", adapterAddress);

  const router = await hre.ethers.getContractAt("StakingRouterBNB", routerAddress);

  // Step 1: Allow the adapter
  console.log("\n1️⃣  Allowing adapter...");
  const allowTx = await router.allowAdapter(adapterAddress, true);
  await allowTx.wait();
  console.log("✅ Adapter allowed:", allowTx.hash);

  // Step 2: Set as current adapter
  console.log("\n2️⃣  Setting as current adapter...");
  const setTx = await router.setAdapter(adapterAddress);
  await setTx.wait();
  console.log("✅ Adapter set:", setTx.hash);

  console.log("\n✅ Configuration complete!");
  console.log("\n📝 Update .env.local:");
  console.log(`   NEXT_PUBLIC_ADAPTER_ADDRESS=${adapterAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
