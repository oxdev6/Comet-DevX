### Getting Started

#### Prerequisites
- Node.js 18+
- npm or yarn or pnpm
- Python 3.8+ (for the Python SDK)
- Hardhat (installed per-project)
- Optional: Foundry (`forge`) for fuzz tests

#### Install monorepo dependencies
```bash
npm install
```

#### Quick: run a scenario on a mainnet fork
```bash
cd packages/scenarios
MAINNET_RPC_URL=<your_mainnet_rpc> npx hardhat run scripts/supply-simulation.ts --network hardhat
```

#### Quick: use the Hardhat plugin tasks (in your Hardhat project)
```ts
// hardhat.config.ts
import "@comet-devx/hardhat-comet";
```
```bash
npx hardhat print-network-config
npx hardhat fork-network --network hardhat --block-number 19100000
npx hardhat setup-comet-env --network hardhat
npx hardhat slither
npx hardhat forge-fuzz
```

#### Quick: TypeScript SDK in a Node app
```ts
import { Comet } from "@comet-devx/sdk";
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL!);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
const comet = new Comet("sepolia", wallet);

// await comet.supply(usdc, amount);
```

#### Quick: Python SDK
```python
from web3 import Web3
from comet_devx.comet import Comet

web3 = Web3(Web3.HTTPProvider("https://sepolia.infura.io/v3/<KEY>"))
account = web3.toChecksumAddress("0x...")
comet = Comet(network="sepolia", web3=web3, account=account)

# await comet.supply(asset, amount, private_key)
```

See module-specific docs for details:
- [TS SDK](./packages/sdk/README.md)
- [Python SDK](./packages/python-sdk/README.md)
- [Hardhat plugin](./packages/hardhat-comet/README.md)
- [Scenarios](./packages/scenarios/README.md)
- [CLI](./packages/cli/README.md)


