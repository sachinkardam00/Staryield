const fs = require('fs');
const path = require('path');

const ARTIFACT = path.join(__dirname, '..', 'artifacts', 'contracts', 'StakingBNB.sol', 'StakingRouterBNB.json');
const OUT_DIR = path.join(__dirname, '..', 'abi');

function main() {
  if (!fs.existsSync(ARTIFACT)) {
    console.error('Artifact not found. Run `npm run compile` first.');
    process.exit(1);
  }
  const artifact = JSON.parse(fs.readFileSync(ARTIFACT, 'utf-8'));
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const abi = artifact.abi || [];
  const bytecode = artifact.bytecode || '';

  fs.writeFileSync(path.join(OUT_DIR, 'StakingRouterBNB.abi.json'), JSON.stringify(abi, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'StakingRouterBNB.bytecode.json'), JSON.stringify({ bytecode }, null, 2));

  console.log('Exported ABI and bytecode to web3/abi');
}

main();
