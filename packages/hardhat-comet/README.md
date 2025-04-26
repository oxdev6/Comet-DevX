# @comet-devx/hardhat-comet

A Hardhat plugin for interacting with Compound V3 (Comet). This plugin simplifies the development process by providing tasks and utilities to:

- **Set up a local Comet development environment:** Easily fork mainnet, impersonate accounts, and prepare your testing environment.
- **Fork a network:** Create a local fork of mainnet for safe, isolated testing.
- **Integrate with the Comet protocol:** Provide helper functions  for interacting with Comet contracts.


---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Plugin Configuration](#plugin-configuration)
  - [Available Tasks](#available-tasks)
- [Examples](#examples)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Local Environment Setup:**  
  Easily fork mainnet, impersonate accounts, and prepare your testing environment with a single command.

- **Network Forking:**  
  Utilize the `fork-network` task to reset and fork a network, allowing for isolated and repeatable testing.

- **Token Management:**  
  Built-in tasks help you manage tokens (e.g., transferring, approving) to simulate real-world scenarios.

- **SDK Integration:**  
  Provides type extensions and helper functions for interacting with the Comet protocol.


---

## Installation

1. **Install Hardhat (if not already installed):**

   ```bash
   npm install --save-dev hardhat
   ```

2. **Install the plugin via npm:**

   ```bash
   npm install --save-dev @comet-devx/hardhat-comet
   ```


---

## Usage

### Plugin Configuration

To use the plugin, import it in your Hardhat configuration file (`hardhat.config.ts`):

```ts
import "@comet-devx/hardhat-comet";
```

You can extend your configuration by adding custom settings for Comet under the `comet` field. For example:

```ts
import { HardhatUserConfig } from "hardhat/types";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID",
        blockNumber: 17000000
      }
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"
    }
  },
  // Custom configuration for the Comet plugin:
  comet: {
    networks: {
      mainnet: {
        cometAddress: "0xc3d688B66703497DAA19211EEdff47f25384cdc3"
      }
    }
  },
  solidity: "0.8.17"
};

export default config;
```

### Available Tasks

- **`setup-comet-env`**  
  Sets up a local development environment by:
  - Forking a network,
  - Impersonating a USDC whale,
  - Transferring a predefined amount of USDC to your test account,
  - Approving the Comet contract, and
  - Supplying USDC to the Comet protocol.

  **Usage:**

  ```bash
  npx hardhat setup-comet-env --network hardhat
  ```

- **`fork-network`**  
  Forks a network at a specific block (or latest) to create a local testing environment.

  **Usage:**

  ```bash
  npx hardhat fork-network --network hardhat 
  ```

  or

   ```bash
  npx hardhat fork-network --network hardhat --block-number 17000000
  ```


---

## Examples

### Setting Up a Local Environment

After configuring your Hardhat network to fork mainnet, run:

```bash
npx hardhat setup-comet-env --network hardhat
```

This command will:
- Impersonate a USDC whale.
- Transfer a predefined amount of USDC to your test account.
- Approve the Comet contract to spend your USDC.
- Supply USDC to the Comet contract.

Logs will confirm the success of each step (e.g., a test account balance of 0 USDC after supply).

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your changes.
3. Write tests for your new functionality.
4. Submit a pull request with a detailed description of your changes.

For major changes, please open an issue first to discuss the design.

---

## License

This project is licensed under the MIT License.


