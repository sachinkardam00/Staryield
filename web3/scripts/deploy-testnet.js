require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat');

async function main() {
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const RPC = process.env.BSC_TESTNET_RPC_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545';
  const VALIDATOR = process.env.VALIDATOR_ADDRESS; // required for adapter wiring
  const OWNER = process.env.OWNER_ADDRESS; // optional, defaults to deployer
  const UNBONDING_SECONDS = Number(process.env.UNBONDING_PERIOD || 7 * 24 * 60 * 60); // default 7d

  if (!PRIVATE_KEY) {
    console.warn('Warning: PRIVATE_KEY not set. Hardhat will use default accounts if available.');
  }
  if (!VALIDATOR) {
    throw new Error('VALIDATOR_ADDRESS is required to wire adapter on BSC testnet');
  }

  const [deployer] = await ethers.getSigners();
  console.log('Deploying with:', deployer.address);

  // Deploy Router
  const Router = await ethers.getContractFactory('StakingRouterBNB');
  const router = await Router.deploy(OWNER || deployer.address, UNBONDING_SECONDS);
  await router.waitForDeployment();
  console.log('Router:', await router.getAddress());

  // Deploy Adapter
  const Adapter = await ethers.getContractFactory('StakingAdapterBNB');
  const adapter = await Adapter.deploy(OWNER || deployer.address);
  await adapter.waitForDeployment();
  console.log('Adapter:', await adapter.getAddress());

  // Allow & set adapter on router
  await (await router.allowAdapter(await adapter.getAddress(), true)).wait();
  await (await router.setAdapter(await adapter.getAddress())).wait();

  // Wire adapter to router and testnet defaults
  await (await adapter.setRouter(await router.getAddress())).wait();
  await (await adapter.wireTestnetDefaults(await router.getAddress(), VALIDATOR)).wait();

  // Persist addresses
  const outDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const out = {
    network: 'bscTestnet',
    router: await router.getAddress(),
    adapter: await adapter.getAddress(),
    validator: VALIDATOR,
    owner: OWNER || deployer.address,
    unbondingPeriod: UNBONDING_SECONDS,
    timestamp: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(outDir, 'bscTestnet.json'), JSON.stringify(out, null, 2));
  console.log('Saved deployments to web3/deployments/bscTestnet.json');

  // Helpful env snippet
  console.log('\nAdd to .env.local and web3/.env:');
  console.log('NEXT_PUBLIC_ROUTER_ADDRESS=' + out.router);
  console.log('NEXT_PUBLIC_ADAPTER_ADDRESS=' + out.adapter);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
