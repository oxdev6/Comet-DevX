### @comet-devx/sdk (TypeScript)

Interact with Compound V3 (Comet) from Node/TypeScript using ethers v6.

#### Install
```bash
npm install @comet-devx/sdk ethers@^6
# or
yarn add @comet-devx/sdk ethers@^6
```

#### Quick start
```ts
import { Comet } from "@comet-devx/sdk";
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL!);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const comet = new Comet("sepolia", signer);

// Supply 1,000 USDC (6 decimals)
const usdc = "0xA0b86991C6218B36C1d19D4a2E9Eb0CE3606EB48"; // example
const amount = ethers.parseUnits("1000", 6);
await comet.supply(usdc, amount);
```

#### Configuration
The SDK reads addresses from its internal map (`src/config/networks.ts`). Example:
```ts
export const NETWORKS = {
  sepolia: {
    cometProxyAddress: "0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf"
  }
};
```
Adjust your usage to the networks supported by the SDK build.

#### API Reference
- `new Comet(network: "sepolia" | ..., signerOrProvider: ethers.Signer | ethers.Provider)`
  - Connects to the Comet proxy for the given network

- `supply(asset: string, amount: bigint | number | string)` → Promise<TransactionResponse>
  - Calls `Comet.supply(asset, amount)`; requires prior ERC20 approval when using a signer

- `borrow(amount: bigint | number | string)` → Promise<TransactionResponse>
  - Calls `Comet.withdraw(baseAsset, amount)` to borrow the base token; ensure sufficient collateral

- `repay(amount: bigint | number | string)` → Promise<TransactionResponse>
  - Calls `Comet.supply(baseAsset, amount)` to repay borrowed base

Notes:
- Returns are ethers v6 transaction responses once integrated end-to-end.
- Approvals must be handled by callers for ERC20 transfers to Comet.

#### Examples
- Approving USDC before supply:
```ts
const erc20 = new ethers.Contract(usdc, ["function approve(address,uint256) returns (bool)"], signer);
await erc20.approve(NETWORKS.sepolia.cometProxyAddress, amount);
await comet.supply(usdc, amount);
```

#### Troubleshooting
- Ensure your app, SDK, and Hardhat/ethers versions are compatible (prefer ethers v6 for apps using this SDK).
- Verify network RPC and addresses; for testnets, check the configured `cometProxyAddress`.

#### See also
- [Getting Started](../../getting-started.md)
- [Hardhat Plugin tasks](../hardhat-comet/README.md#tasks)
- [Scenarios](../scenarios/README.md)
- [FAQ](../../faq.md)


