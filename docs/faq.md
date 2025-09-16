### FAQ & Troubleshooting

- Ethers v5 vs v6?
  - TypeScript SDK and scenarios use ethers v6. The Hardhat plugin and CLI templates use v5. Prefer one version in your app; see [TS SDK](./packages/sdk/README.md) and [Hardhat plugin](./packages/hardhat-comet/README.md).

- Sepolia/testnet addresses differ between SDKs
  - Verify each SDK’s network map: TS SDK (`packages/sdk/src/config/networks.ts`) and Python SDK (`packages/python-sdk/src/comet_devx/config/networks.py`).

- `hardhat_impersonateAccount` fails
  - Ensure you’re on the `hardhat` network with forking enabled. Use [`fork-network`](./packages/hardhat-comet/README.md#tasks) first, then run [`setup-comet-env`](./packages/hardhat-comet/README.md#tasks).

- Slither not found
  - Install Slither (`pipx install slither-analyzer`) and try the [`slither` task](./packages/hardhat-comet/README.md#tasks) again.

- Foundry `forge` not found
  - Install Foundry and run `foundryup`. See [Foundry guide](./foundry/README.md).

- Where do I start?
  - Read [Getting Started](./getting-started.md) and run a script from [Scenarios](./packages/scenarios/README.md#run-on-a-mainnet-fork).


