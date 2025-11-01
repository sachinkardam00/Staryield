# Staking BNB Smart Contracts

This folder contains the Solidity smart contracts and Hardhat configuration for the BNB staking system.

## Contracts

- `contracts/StakingBNB.sol` - Contains both `StakingRouterBNB` (user-facing contract) and `StakingAdapterBNB` (StakeHub interface)

## Structure

- `contracts/` - Solidity smart contracts
- `scripts/` - Deployment and utility scripts
- `artifacts/` - Compiled contract artifacts (generated)
- `abi/` - Exported ABIs and bytecode for the frontend
- `cache/` - Hardhat cache (generated)

## Workflow

### 1. Install Dependencies

```bash
npm install
```

### 2. Compile Contracts

```bash
npx hardhat compile
```

This compiles the contracts and generates artifacts in `artifacts/`.

### 3. Export ABI

```bash
node scripts/export-abi.js
```

This exports the ABI and bytecode to `abi/` folder:

- `StakingRouterBNB.abi.json` - Contract ABI
- `StakingRouterBNB.bytecode.json` - Deployment bytecode

### 4. Sync ABI to Frontend

From the root `arbstake/` directory:

```bash
npm run sync-abi
```

This copies the ABI to the frontend TypeScript file at `src/contracts/abi/StakingRouterBNB.ts`.

### Complete Workflow (After Contract Changes)

```bash
cd web3
npx hardhat compile
node scripts/export-abi.js
cd ..
npm run sync-abi
```

Or use the combined command from root:

```bash
npm run compile-contracts && npm run sync-abi
```

## Deploy to BSC Testnet

### Setup Environment

Create `web3/.env` with:

```env
PRIVATE_KEY=0x...
BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545
VALIDATOR_ADDRESS=0xYourValidatorAddress
OWNER_ADDRESS=0xYourOwnerAddress (optional, defaults to deployer)
UNBONDING_PERIOD=604800 (optional, defaults to 7 days)
```

### Deploy

```bash
npx hardhat run scripts/deploy-testnet.js --network bscTestnet
```

After deployment, copy the contract addresses to your app's `.env.local`:

```env
NEXT_PUBLIC_ROUTER_ADDRESS=0x...
NEXT_PUBLIC_ADAPTER_ADDRESS=0x...
```

## Network Configuration

Edit `hardhat.config.js` to add/modify networks. Current networks:

- BSC Testnet
- BSC Mainnet (configure in hardhat.config.js)

## Contract Verification

Add to `.env`:

```env
BSCSCAN_API_KEY=your_api_key_here
```

Then verify:

```bash
npx hardhat verify --network bscTestnet DEPLOYED_CONTRACT_ADDRESS "constructor" "args"
```
