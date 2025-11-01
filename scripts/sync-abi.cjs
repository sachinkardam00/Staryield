const fs = require('fs');
const path = require('path');

// Source: web3/abi
const ABI_SOURCE = path.join(__dirname, '..', 'web3', 'abi', 'StakingRouterBNB.abi.json');
// Target: src/contracts/abi
const ABI_TARGET = path.join(__dirname, '..', 'src', 'contracts', 'abi', 'StakingRouterBNB.ts');

function main() {
  if (!fs.existsSync(ABI_SOURCE)) {
    console.error('ABI source not found. Run `npm run compile` in web3/ first.');
    process.exit(1);
  }

  const abi = JSON.parse(fs.readFileSync(ABI_SOURCE, 'utf-8'));
  
  // Generate TypeScript file with the full ABI
  const tsContent = `// Auto-generated from web3/abi/StakingRouterBNB.abi.json
// Do not edit manually - run 'npm run sync-abi' to update

export const STAKING_ROUTER_BNB_ABI = ${JSON.stringify(abi, null, 2)} as const;
`;

  fs.writeFileSync(ABI_TARGET, tsContent);
  console.log('✅ Synced ABI to src/contracts/abi/StakingRouterBNB.ts');
}

main();
