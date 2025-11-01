import { ethers } from "hardhat";

async function main() {
  const routerAddress = "0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78";
  const adapterAddress = "0x5975cB954D4C957Cec14cbbc923D927b4d0A0AAF";
  const userAddress = "0x45F3a935F36ebbe3be3da8C9c14ff95023403acd";

  const router = await ethers.getContractAt(
    "StakingRouterBNB",
    routerAddress
  );

  console.log("\n=== Balance Check ===");
  const routerBalance = await ethers.provider.getBalance(routerAddress);
  const adapterBalance = await ethers.provider.getBalance(adapterAddress);
  console.log("Router balance:", ethers.formatEther(routerBalance), "BNB");
  console.log("Adapter balance:", ethers.formatEther(adapterBalance), "BNB");

  console.log("\n=== User Staking Info ===");
  const shares = await router.sharesOf(userAddress);
  console.log("User shares:", ethers.formatEther(shares));

  const pendingRewards = await router.pendingRewards(userAddress);
  console.log("Pending rewards:", ethers.formatEther(pendingRewards), "BNB");

  const totalRewardsEarned = await router.totalRewardsEarned(userAddress);
  console.log("Total rewards earned:", ethers.formatEther(totalRewardsEarned), "BNB");

  const totalRewardsClaimed = await router.totalRewardsClaimed(userAddress);
  console.log("Total rewards claimed:", ethers.formatEther(totalRewardsClaimed), "BNB");

  console.log("\n=== Expected Harvest Rewards ===");
  if (adapterBalance > 0n) {
    const mockRewards = adapterBalance / 1000n; // 0.1%
    console.log("Calling harvest() would generate:", ethers.formatEther(mockRewards), "BNB");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
