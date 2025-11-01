import { ethers } from "hardhat";

async function main() {
  const adapterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const userAddress = "0x45F3a935F36ebbe3be3da8C9c14ff95023403acd";

  const adapter = await ethers.getContractAt("SimpleMockAdapter", adapterAddress);

  console.log("\n📊 Time-Based Adapter Status:\n");
  
  const totalStaked = await adapter.totalStaked();
  console.log("Total Staked:", ethers.formatEther(totalStaked), "BNB");

  const lastHarvest = await adapter.lastHarvestTime();
  console.log("Last Harvest:", new Date(Number(lastHarvest) * 1000).toLocaleString());

  const pendingRewards = await adapter.calculatePendingRewards();
  console.log("Pending Rewards:", ethers.formatEther(pendingRewards), "BNB");

  const annualRate = await adapter.ANNUAL_RATE_BP();
  console.log("Annual APY:", Number(annualRate) / 100, "%");

  const adapterBalance = await ethers.provider.getBalance(adapterAddress);
  console.log("Adapter Balance:", ethers.formatEther(adapterBalance), "BNB");

  console.log("\n⏱️  Time since last harvest:");
  const now = Math.floor(Date.now() / 1000);
  const elapsed = now - Number(lastHarvest);
  console.log(`${elapsed} seconds (${Math.floor(elapsed / 60)} minutes)`);

  console.log("\n💰 Expected rewards if harvested now:");
  console.log(`${ethers.formatEther(pendingRewards)} BNB`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
