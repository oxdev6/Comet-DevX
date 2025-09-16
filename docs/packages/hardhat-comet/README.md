### @comet-devx/hardhat-comet (Hardhat Plugin)

Hardhat plugin adding Comet-focused tasks, config, and utilities.

#### Install
```bash
npm install --save-dev @comet-devx/hardhat-comet hardhat
```

#### Setup
```ts
// hardhat.config.ts
import "@comet-devx/hardhat-comet";

const config = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: process.env.MAINNET_RPC_URL,
        blockNumber: 19100000
      }
    }
  },
  comet: {
    networks: {
      mainnet: { cometAddress: "0xc3d688B66703497DAA19211EEdff47f25384cdc3" }
    }
  }
};
export default config;
```

#### Tasks
- `print-network-config`: print current Comet network config
- `fork-network [--block-number N]`: reset and fork from RPC URL
- `setup-comet-env`: impersonate USDC whale, fund, approve, and supply 1,000 USDC
- `slither`: run Slither against `packages/scenarios/contracts`
- `forge-fuzz [--pattern PATTERN]`: run Foundry tests under `foundry/`

#### Usage
```bash
npx hardhat print-network-config
npx hardhat fork-network --network hardhat --block-number 19100000
npx hardhat setup-comet-env --network hardhat
npx hardhat slither
npx hardhat forge-fuzz --pattern testFuzzSupply
```

#### Notes
- This plugin currently uses ethers v5 under Hardhat; your app code may use ethers v6 separately.

#### See also
- [Getting Started](../../getting-started.md)
- [Scenarios](../scenarios/README.md)
- [Foundry guide](../../foundry/README.md)
- [FAQ](../../faq.md)


