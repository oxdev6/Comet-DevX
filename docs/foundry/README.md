### Foundry Fuzz Tests

This repo includes a minimal Foundry suite under `foundry/` with a skeleton fuzz test for Comet.

#### Prerequisites
- Foundry installed (`forge --version`)
- `MAINNET_RPC_URL` env var for forking

#### Run tests
```bash
cd foundry
MAINNET_RPC_URL=<your_mainnet_rpc> forge test -vv
```

Relevant file:
- `foundry/test/CometFuzz.t.sol`


