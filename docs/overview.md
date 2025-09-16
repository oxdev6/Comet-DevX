### Overview

Comet DevX is a monorepo of developer tooling around Compound V3 (Comet):

- `packages/sdk`: TypeScript SDK (ethers v6) to interact with Comet
- `packages/python-sdk`: Python SDK (web3.py) to interact with Comet
- `packages/hardhat-comet`: Hardhat plugin with tasks and config extensions
- `packages/scenarios`: Hardhat project with ready-to-run simulation scripts
- `packages/cli`: CLI to scaffold React/Node apps wired to the TS SDK
- `packages/comet-scenario-framework`: Early scenario framework (WIP)
- `foundry/`: Foundry fuzz test workspace

High-level flow:
- Use the SDKs in your apps to read/write to Comet
- Use the Hardhat plugin to fork mainnet, seed accounts, and run security tools
- Use scenario scripts to simulate shocks and behaviors on a fork
- Use the CLI to bootstrap new projects integrated with the TS SDK

Networks & addresses:
- Mainnet Comet proxy: `0xc3d688B66703497DAA19211EEdff47f25384cdc3`
- Mainnet USDC: `0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48`
- Mainnet WETH: `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`

For testnets, see each SDK's network configuration.


