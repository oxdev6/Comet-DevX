

# @comet-devx/create-comet-app

A CLI tool to scaffold new projects that integrate the [@comet-devx/sdk](https://www.npmjs.com/package/@comet-devx/sdk) for interacting with Compound V3 (Comet). The tool allows you to quickly set up high-quality project templates for both React and Node.js applications, complete with boilerplate code and configuration for seamless integration with the Comet SDK.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Creating a New Project](#creating-a-new-project)
  - [Template Options](#template-options)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Scaffold Projects Quickly:** Create projects with a single CLI command.
- **Supports Multiple Templates:** Choose from a full-featured React app or a minimal Node.js backend project.
- **Integrated with Comet SDK:** Each project comes preconfigured to integrate with the @comet-devx/sdk, providing a starting point for interacting with Compound V3 (Comet).
- **Customizable:** Easily update the generated files with your RPC provider, private keys, and contract addresses.
- **Developer-Friendly:** Includes detailed README and configuration files to help you get started quickly.

---

## Installation

First, ensure you have [Node.js](https://nodejs.org/) and npm installed.

To install the CLI tool globally, run:

```bash
npm install -g @comet-devx/create-comet-app
```


---

## Usage

### Creating a New Project

To scaffold a new project, run the `create` command followed by your project name. The CLI tool supports a `--template` option to choose your project type.

**Example: Create a new React project**

```bash
create-comet-app create my-comet-react-app --template react
```

**Example: Create a new Node.js project**

```bash
create-comet-app create my-comet-node-app --template node
```

If no template is specified, the tool defaults to the **React** template.

### Template Options

- **react:**  
  Generates a full React application with:
  - A `public/` folder containing `index.html`
  - A `src/` folder with `index.tsx` and `App.tsx`
  - A sample configuration that demonstrates how to instantiate the Comet SDK.
  - Dependencies for React, ReactDOM, Webpack, and TypeScript.

- **node:**  
  Generates a minimal Node.js project with:
  - A `src/` folder containing an `index.ts` file that demonstrates usage of the Comet SDK.
  - A basic configuration for running a TypeScript application in Node.js.
  - Dependencies for the Comet SDK, Ethers.js, and TypeScript.

---

## Project Structure

After scaffolding, your project will have a structure similar to one of the following:

### React Template

```
my-comet-react-app/
├── package.json
├── tsconfig.json
├── public/
│   └── index.html
├── src/
│   ├── index.tsx
│   └── App.tsx
└── README.md
```

### Node.js Template

```
my-comet-node-app/
├── package.json
├── tsconfig.json
├── src/
│   └── index.ts
└── README.md
```

Each project includes a README with instructions to install dependencies, configure the SDK, build, and run the project.

---

## Configuration

In the generated project, update the following files with your own details:

- **RPC Provider & Private Key:**  
  In `src/index.tsx` (React) or `src/index.ts` (Node), update the provider URL (e.g., your Infura key) and your wallet private key.
  
- **Contract Addresses:**  
  Replace placeholder addresses (e.g., `0xUSDC_ADDRESS`) with the actual addresses relevant to your environment (mainnet or testnet).

- **SDK Integration:**  
  The sample code demonstrates how to import and instantiate the Comet SDK. Refer to the [@comet-devx/sdk documentation](https://github.com/your-org/comet-devx-sdk) for detailed usage instructions.

---

## Contributing

Contributions are welcome! To contribute to this project:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.

For major changes, please open an issue first to discuss what you would like to change.

---

## License

This project is licensed under the MIT License.

---

Happy coding and building with Compound V3 (Comet)! If you have any questions or feedback, please open an issue or join our community discussions on Discord.

