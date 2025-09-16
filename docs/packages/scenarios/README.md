### Scenarios (Hardhat Project)

A ready-to-run Hardhat workspace with scripts that simulate common behaviors on a mainnet fork using real Comet/USDC/WETH addresses.

#### Install
```bash
cd packages/scenarios
npm install
```

#### Run on a mainnet fork
```bash
MAINNET_RPC_URL=<your_mainnet_rpc> npx hardhat run scripts/supply-simulation.ts --network hardhat
```

#### Scripts
- `supply-simulation.ts`: Approve and supply 1,000 USDC into Comet
- `price-shock.ts`: Supply WETH, then compare USD collateral value before/after a mocked ETH/USD price
- `interest-rate-spike.ts`: Increase utilisation and observe APR (see script)
- `partial-liquidation.ts`: Drive a position under water and absorb (see script)
- `stablecoin-depeg.ts`: Demonstrate price feed stress (see script)

All scripts use ethers v6 APIs.

#### Contracts
- `contracts/MockAggregator.sol`: Chainlink-like aggregator for controlled price tests

#### See also
- [Hardhat Plugin tasks](../hardhat-comet/README.md#tasks)
- [Getting Started](../../getting-started.md)
- [FAQ](../../faq.md)


