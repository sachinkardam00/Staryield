import { ethers } from "hardhat";

async function main() {
  const userAddress = "0x45F3a935F36ebbe3be3da8C9c14ff95023403acd";
  const routerAddress = "0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78";
  const adapterAddress = "0x5975cB954D4C957Cec14cbbc923D927b4d0A0AAF";

  console.log("\n=== Balances ===");
  const userBalance = await ethers.provider.getBalance(userAddress);
  console.log("User wallet:", ethers.formatEther(userBalance), "BNB");

  const adapterBalance = await ethers.provider.getBalance(adapterAddress);
  console.log("Adapter:", ethers.formatEther(adapterBalance), "BNB");

  const routerBalance = await ethers.provider.getBalance(routerAddress);
  console.log("Router:", ethers.formatEther(routerBalance), "BNB");

  console.log("\n=== Recent Transactions to Router ===");
  const currentBlock = await ethers.provider.getBlockNumber();
  console.log("Current block:", currentBlock);
  
  // Check last 1000 blocks (~50 minutes)
  const startBlock = currentBlock - 1000;
  console.log(`Scanning blocks ${startBlock} to ${currentBlock}...`);

  for (let i = currentBlock; i > startBlock; i -= 50) {
    const fromBlock = Math.max(startBlock, i - 50);
    const blocks = await Promise.all(
      Array.from({ length: i - fromBlock + 1 }, (_, idx) =>
        ethers.provider.getBlock(fromBlock + idx, true)
      )
    );

    for (const block of blocks) {
      if (!block || !block.transactions) continue;
      
      for (const tx of block.transactions) {
        if (typeof tx === 'string') continue;
        
        if (
          tx.from.toLowerCase() === userAddress.toLowerCase() &&
          tx.to?.toLowerCase() === routerAddress.toLowerCase()
        ) {
          const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
          console.log("\n📝 Transaction:", tx.hash);
          console.log("   Block:", block.number, "Time:", new Date((block.timestamp || 0) * 1000).toLocaleString());
          console.log("   Value:", ethers.formatEther(tx.value), "BNB");
          console.log("   Status:", receipt?.status === 1 ? "✅ Success" : "❌ Failed");
          console.log("   Gas used:", receipt?.gasUsed.toString());
        }
      }
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
