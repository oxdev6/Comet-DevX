
# @comet-devx/sdk

A minimal TypeScript/JavaScript SDK for interacting with the [Compound III (Comet)](https://compound.finance) protocol. This library provides an easy-to-use interface to:

- **Supply** collateral to Comet.
- **Borrow** the base asset (e.g., USDC).
- **Repay** your borrowed balance.


---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
- [Usage](#usage)
  - [Importing the Library](#importing-the-library)
  - [Constructing a `Comet` Instance](#constructing-a-comet-instance)
  - [Core Methods](#core-methods)
    - [`supply(asset, amount)`](#supplyasset-amount)
    - [`borrow(amount)`](#borrowamount)
    - [`repay(amount)`](#repayamount)
- [Local Testing & Mocking](#local-testing--mocking)
- [Configuration](#configuration)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **TypeScript & Typed Definitions**: Provides complete type-safety and IntelliSense support.
- **Core Methods**:
  - **`supply`**: Supply an ERC20 token as collateral.
  - **`borrow`**: Borrow the base asset using your collateral.
  - **`repay`**: Repay the borrowed base asset.
- **Ethers.js Compatible**: Works seamlessly as a wrapper for Ethers.js, allowing for both read and write operations.

---

## Installation

Install the package via npm or yarn:

```bash
npm install @comet-devx/sdk
# or
yarn add @comet-devx/sdk
```

---

## Prerequisites

- **Node.js** and **npm** (or Yarn) installed.
- A web3 provider connected to your target network (e.g., [Infura](https://infura.io), [Alchemy](https://www.alchemy.com), or a local node like Hardhat).
- A valid **signer** (typically a Wallet or account with a private key) for write operations.

---

## Quickstart

1. **Install** the package using npm/yarn.
2. **Instantiate** the `Comet` class with your network and signer.
3. **Call** the desired method (`supply`, `borrow`, or `repay`).
4. **Await** the transaction response to confirm the action.

---

## Usage

### Importing the Library

For **TypeScript**:

```ts
import { Comet } from "@comet-devx/sdk";
```

For **JavaScript**:

```js
const { Comet } = require("@comet-devx/sdk");
```

### Constructing a `Comet` Instance

Pass the network key (e.g., `"sepolia"`) and a signer or provider to the constructor:

```ts
import { ethers } from "ethers";
import { Comet } from "@comet-devx/sdk";

// Connect to an RPC provider (e.g., Infura)
const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/YOUR_INFURA_KEY");

// Create a signer (using your private key)
const wallet = new ethers.Wallet("0xYOUR_PRIVATE_KEY", provider);

// Construct the Comet instance
const comet = new Comet("sepolia", wallet);
```

> **Note:** When using methods that send transactions (like `supply`, `borrow`, or `repay`), ensure you pass a signer (not a read-only provider).

### Core Methods

#### `supply(asset, amount)`

Supplies the provided asset as collateral.  
- **Parameters:**
  - `asset`: The ERC20 token address as a string.
  - `amount`: The amount to supply in the token's smallest unit.  
    - For example, USDC uses 6 decimals, so to supply **1 USDC**, pass `1,000,000`.
    
```ts
// Example: Supply 1 USDC (USDC having 6 decimals)
import { ethers } from "ethers";
const usdcAmount = ethers.utils.parseUnits("1", 6); // Converts "1" into 1000000 as a BigNumber
const supplyTx = await comet.supply("0xTokenAddress", usdcAmount);
console.log("Supply Transaction Hash:", supplyTx.hash);
```

#### `borrow(amount)`

Borrows the base asset from Comet.  
- **Parameter:**  
  - `amount`: The amount to borrow in the base asset’s smallest unit.
  
```ts
// Example: Borrow 100 USDC (assuming base asset uses 6 decimals)
const borrowAmount = ethers.utils.parseUnits("100", 6);
const borrowTx = await comet.borrow(borrowAmount);
console.log("Borrow Transaction Hash:", borrowTx.hash);
```

#### `repay(amount)`

Repays the borrowed base asset.  
- **Parameter:**  
  - `amount`: The amount to repay in the base asset’s smallest unit.
  
```ts
// Example: Repay 50 USDC
const repayAmount = ethers.utils.parseUnits("50", 6);
const repayTx = await comet.repay(repayAmount);
console.log("Repay Transaction Hash:", repayTx.hash);
```

---


## Examples

### Minimal Example

```ts
import { ethers } from "ethers";
import { Comet } from "@comet-devx/sdk";

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/YOUR_INFURA_KEY");
  const wallet = new ethers.Wallet("0xYOUR_PRIVATE_KEY", provider);
  const comet = new Comet("sepolia", wallet);

  // Supply 50 USDC (assuming USDC uses 6 decimals)
  const supplyAmount = ethers.utils.parseUnits("50", 6);
  const supplyTx = await comet.supply("0xUSDC_ADDRESS", supplyAmount);
  console.log("Supply TX:", supplyTx.hash);

  // Borrow 20 USDC
  const borrowAmount = ethers.utils.parseUnits("20", 6);
  const borrowTx = await comet.borrow(borrowAmount);
  console.log("Borrow TX:", borrowTx.hash);

  // Repay 10 USDC
  const repayAmount = ethers.utils.parseUnits("10", 6);
  const repayTx = await comet.repay(repayAmount);
  console.log("Repay TX:", repayTx.hash);
}

main().catch(console.error);
```

### Checking Transaction Receipts

```ts
const tx = await comet.borrow(ethers.utils.parseUnits("1", 6));
const receipt = await tx.wait();
console.log("Transaction confirmed in block:", receipt.blockNumber);
```

---

## Contributing

Contributions are welcome! If you want to improve the SDK, fix bugs, or add new features:

1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request for review.

For major changes, please open an issue first to discuss what you would like to change.

---

## License

This project is available under the [MIT License](./LICENSE).

---

**Happy Building!**  
If you encounter any issues or have questions, feel free to open an issue on our GitHub repository.
```
