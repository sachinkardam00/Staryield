const hre = require("hardhat");

async function main() {
  const newAdapterAddress = "0x58E7DF3cAae6EEb94A76Ac3b74eC88049F438e7B";
  const routerAddress = "0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78";
  const userAddress = "0x45F3a935F36ebbe3be3da8C9c14ff95023403acd";

  console.log("\n📊 Real-Time Rewards Check\n");

  const adapter = await hre.ethers.getContractAt("SimpleMockAdapter", newAdapterAddress);
  const router = await hre.ethers.getContractAt("StakingRouterBNB", routerAddress);

  // Check adapter state
  const totalStaked = await adapter.totalStaked();
  const lastHarvest = await adapter.lastHarvestTime();
  const pendingRewards = await adapter.calculatePendingRewards();
  
  console.log("=== New Adapter (Time-Based) ===");
  console.log("Total Staked:", hre.ethers.formatEther(totalStaked), "BNB");
  console.log("Last Harvest:", new Date(Number(lastHarvest) * 1000).toLocaleString());
  
  const now = Math.floor(Date.now() / 1000);
  const elapsed = now - Number(lastHarvest);
  console.log("Time Elapsed:", `${elapsed}s (${Math.floor(elapsed / 60)} minutes)`);
  
  console.log("Pending Rewards (from adapter):", hre.ethers.formatEther(pendingRewards), "BNB");

  // Check router's view
  console.log("\n=== Router View ===");
  try {
    const userShares = await router.sharesOf(userAddress);
    console.log("User Shares:", hre.ethers.formatEther(userShares), "BNB");
    
    const userPendingRewards = await router.pendingRewards(userAddress);
    console.log("Pending Rewards (from router):", hre.ethers.formatEther(userPendingRewards), "BNB");
  } catch (e) {
    console.log("Error reading router:", e.message);
  }

  console.log("\n=== Expected Calculation ===");
  const stakedBNB = parseFloat(hre.ethers.formatEther(totalStaked));
  const apy = 0.10; // 10%
  const secondsPerYear = 365 * 24 * 60 * 60;
  const expectedRewards = stakedBNB * apy * (elapsed / secondsPerYear);
  console.log(`Formula: ${stakedBNB} BNB × 10% APY × (${elapsed}s / ${secondsPerYear}s)`);
  console.log(`Expected: ${expectedRewards.toFixed(10)} BNB`);
  
  if (parseFloat(hre.ethers.formatEther(pendingRewards)) === 0) {
    console.log("\n⚠️  WARNING: Pending rewards are 0!");
    console.log("Possible reasons:");
    console.log("1. No BNB staked in new adapter yet");
    console.log("2. Just staked and no time has elapsed");
    console.log("3. Harvest was recently called");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
