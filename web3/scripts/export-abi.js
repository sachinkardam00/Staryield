const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'abi');

const CONTRACTS = [
  {
    name: 'StakingRouterBNB',
    artifact: path.join(__dirname, '..', 'artifacts', 'contracts', 'StakingBNB.sol', 'StakingRouterBNB.json')
  },
  {
    name: 'SimpleMockAdapter',
    artifact: path.join(__dirname, '..', 'artifacts', 'contracts', 'SimpleMockAdapter.sol', 'SimpleMockAdapter.json')
  },
  {
    name: 'ReferralSystem',
    artifact: path.join(__dirname, '..', 'artifacts', 'contracts', 'ReferralSystem.sol', 'ReferralSystem.json')
  },
  {
    name: 'LoyaltyPoints',
    artifact: path.join(__dirname, '..', 'artifacts', 'contracts', 'LoyaltyPoints.sol', 'LoyaltyPoints.json')
  }
];

function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const contract of CONTRACTS) {
    if (!fs.existsSync(contract.artifact)) {
      console.warn(`⚠️  Artifact not found: ${contract.name}`);
      continue;
    }

    const artifact = JSON.parse(fs.readFileSync(contract.artifact, 'utf-8'));
    const abi = artifact.abi || [];
    const bytecode = artifact.bytecode || '';

    fs.writeFileSync(
      path.join(OUT_DIR, `${contract.name}.abi.json`),
      JSON.stringify(abi, null, 2)
    );
    fs.writeFileSync(
      path.join(OUT_DIR, `${contract.name}.bytecode.json`),
      JSON.stringify({ bytecode }, null, 2)
    );

    console.log(`✅ Exported ${contract.name}`);
  }

  console.log('\n✨ All ABIs exported to web3/abi');
}

main();
