const fs = require('fs');
const path = require('path');

// Read the ABI JSON files
const routerAbi = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../abi/StakingRouterBNB.abi.json'), 'utf8')
);

const adapterAbi = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../abi/SimpleMockAdapter.abi.json'), 'utf8')
);

// Generate TypeScript file for Router
const routerTs = `// Auto-generated from web3/abi/StakingRouterBNB.abi.json
export const StakingRouterBNBABI = ${JSON.stringify(routerAbi, null, 2)} as const;
`;

// Generate TypeScript file for Adapter
const adapterTs = `// Auto-generated from web3/abi/SimpleMockAdapter.abi.json
export const SimpleMockAdapterABI = ${JSON.stringify(adapterAbi, null, 2)} as const;
`;

// Write to frontend src directory
const frontendAbiPath = path.join(__dirname, '../../src/contracts/abi');
fs.writeFileSync(path.join(frontendAbiPath, 'StakingRouterBNB.ts'), routerTs);
fs.writeFileSync(path.join(frontendAbiPath, 'SimpleMockAdapter.ts'), adapterTs);

console.log('✅ Generated StakingRouterBNB.ts');
console.log('✅ Generated SimpleMockAdapter.ts');
console.log('\n📁 Location: src/contracts/abi/');
