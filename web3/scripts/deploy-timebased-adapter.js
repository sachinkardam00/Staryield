const hre = require("hardhat");

async function main() {
  console.log("\n🚀 Deploying TimeBased SimpleMockAdapter to BSC Testnet...\n");

  const routerAddress = "0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78";

  const SimpleMockAdapter = await hre.ethers.getContractFactory("SimpleMockAdapter");
  const adapter = await SimpleMockAdapter.deploy(routerAddress);
  await adapter.waitForDeployment();

  const adapterAddress = await adapter.getAddress();
  console.log("✅ SimpleMockAdapter deployed to:", adapterAddress);

  // Get initial config
  console.log("\n📋 Configuration:");
  console.log("   Router:", await adapter.router());
  console.log("   Annual Rate:", (await adapter.ANNUAL_RATE_BP()).toString(), "basis points (10% APY)");
  console.log("   Last Harvest:", new Date((Number(await adapter.lastHarvestTime()) * 1000)).toLocaleString());

  console.log("\n⚠️  Next steps:");
  console.log("1. Allow and set adapter:");
  console.log(`   node scripts/configure-adapter-js.js ${adapterAddress}`);
  console.log("\n2. Update .env.local:");
  console.log(`   NEXT_PUBLIC_ADAPTER_ADDRESS=${adapterAddress}`);
  console.log("\n3. Restart Next.js dev server");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
