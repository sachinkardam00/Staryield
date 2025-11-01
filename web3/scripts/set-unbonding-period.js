const hre = require('hardhat');

async function main() {
  const routerAddress = '0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78';
  
  console.log('Setting unbonding period to 0 for instant testing...');
  console.log('Router:', routerAddress);

  const [deployer] = await hre.ethers.getSigners();
  console.log('Using account:', deployer.address);

  const Router = await hre.ethers.getContractAt('StakingRouterBNB', routerAddress);

  // Set unbonding period to 0 (instant unstake for testing)
  const tx = await Router.setUnbondingPeriod(0);
  console.log('Transaction sent:', tx.hash);
  
  await tx.wait();
  console.log('✅ Unbonding period set to 0 seconds!');

  // Verify
  const period = await Router.unbondingPeriod();
  console.log('Current unbonding period:', period.toString(), 'seconds');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
