#!/usr/bin/env node

import { program } from "commander";
import * as fs from "fs";
import * as path from "path";

// Define CLI version and description
program
  .version("0.1.0")
  .description("CLI tool to scaffold new Comet integration projects that integrate @comet-devx/sdk with React or Node.js");

// Define the "create" command with required project name and an optional template parameter.
// We'll use "react" as the default template.
program
  .command("create <project-name>")
  .description("Scaffold a new Comet app project")
  .option("-t, --template <template>", "Project template: react or node", "react")
  .action((projectName: string, options: { template: string }) => {
    const projectPath = path.join(process.cwd(), projectName);

    // Check if directory already exists.
    if (fs.existsSync(projectPath)) {
      console.error(`Error: Directory "${projectName}" already exists.`);
      process.exit(1);
    }

    // Create project directory.
    fs.mkdirSync(projectPath);
    
    // Depending on the chosen template, scaffold the appropriate project.
    if (options.template === "react") {
      // Create directories for a React project.
      fs.mkdirSync(path.join(projectPath, "public"));
      fs.mkdirSync(path.join(projectPath, "src"));

      // Create public/index.html.
      const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${projectName}</title>
</head>
<body>
  <div id="root"></div>
  <script src="../dist/bundle.js"></script>
</body>
</html>
      `.trim();
      fs.writeFileSync(path.join(projectPath, "public", "index.html"), indexHtml);

      // Create src/App.tsx.
      const appTsx = `
import React from 'react';

const App: React.FC = () => {
  return (
    <div>
      <h1>Welcome to your Comet React App!</h1>
      <p>This project integrates the @comet-devx/sdk for interacting with Compound V3 (Comet).</p>
    </div>
  );
};

export default App;
      `.trim();
      fs.writeFileSync(path.join(projectPath, "src", "App.tsx"), appTsx);

      // Create src/index.tsx.
      const indexTsx = `
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Example usage of @comet-devx/sdk (update with your actual configuration)
import { Comet } from '@comet-devx/sdk';
import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/YOUR_INFURA_KEY");
const wallet = new ethers.Wallet("0xYOUR_PRIVATE_KEY", provider);
const comet = new Comet("sepolia", wallet);

console.log("Comet instance:", comet);

ReactDOM.render(<App />, document.getElementById('root'));
      `.trim();
      fs.writeFileSync(path.join(projectPath, "src", "index.tsx"), indexTsx);

      // Create package.json for React project.
      const packageJsonReact = {
        name: projectName,
        version: "0.1.0",
        description: "A React project integrating @comet-devx/sdk for Compound V3 (Comet)",
        main: "src/index.tsx",
        scripts: {
          build: "tsc && webpack",
          start: "webpack serve --mode development"
        },
        dependencies: {
          "react": "^18.2.0",
          "react-dom": "^18.2.0",
          "@comet-devx/sdk": "^0.1.0",
          "ethers": "^5.7.2"
        },
        devDependencies: {
          "typescript": "^4.9.5",
          "ts-loader": "^9.4.2",
          "webpack": "^5.75.0",
          "webpack-cli": "^5.0.1",
          "webpack-dev-server": "^4.11.1",
          "@types/react": "^18.0.26",
          "@types/react-dom": "^18.0.9"
        },
        license: "MIT"
      };
      fs.writeFileSync(
        path.join(projectPath, "package.json"),
        JSON.stringify(packageJsonReact, null, 2)
      );

      // Create a basic tsconfig.json for the React project.
      const tsconfigReact = {
        compilerOptions: {
          target: "es2019",
          module: "esnext",
          jsx: "react-jsx",
          strict: true,
          esModuleInterop: true,
          outDir: "dist",
          rootDir: "src"
        },
        include: ["src/**/*"]
      };
      fs.writeFileSync(
        path.join(projectPath, "tsconfig.json"),
        JSON.stringify(tsconfigReact, null, 2)
      );

      // Create a README.md file.
      const readmeReact = `# ${projectName}

This project was scaffolded using \`create-comet-app\` with the React template. It integrates the \`@comet-devx/sdk\` for interacting with Compound V3 (Comet).

## Getting Started

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Update \`src/index.tsx\` with your RPC provider URL, private key, and relevant addresses.

3. Build and run the project:
   \`\`\`
   npm run build
   npm start
   \`\`\`
`;
      fs.writeFileSync(path.join(projectPath, "README.md"), readmeReact.trim());
      
    } else if (options.template === "node") {
      // Create a minimal Node.js project.
      fs.mkdirSync(path.join(projectPath, "src"));

      // Create src/index.ts for Node.js.
      const indexTs = `
import { ethers } from "ethers";
import { Comet } from "@comet-devx/sdk";

async function main() {
  // Example configuration - update with your actual RPC provider and private key.
  const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/YOUR_INFURA_KEY");
  const wallet = new ethers.Wallet("0xYOUR_PRIVATE_KEY", provider);
  const comet = new Comet("sepolia", wallet);

  console.log("Comet instance created:", comet);

  // Example: Supply 50 USDC (assuming USDC has 6 decimals)
  const amount = ethers.utils.parseUnits("50", 6);
  try {
    const tx = await comet.supply("0xUSDC_ADDRESS", amount);
    console.log("Supply Transaction Hash:", tx.hash);
  } catch (error) {
    console.error("Error during supply:", error);
  }
}

main().catch(console.error);
      `.trim();
      fs.writeFileSync(path.join(projectPath, "src", "index.ts"), indexTs);

      // Create package.json for Node.js project.
      const packageJsonNode = {
        name: projectName,
        version: "0.1.0",
        description: "A Node.js project integrating @comet-devx/sdk for Compound V3 (Comet)",
        main: "src/index.ts",
        scripts: {
          build: "tsc",
          start: "ts-node src/index.ts"
        },
        dependencies: {
          "@comet-devx/sdk": "^0.0.4",
          "ethers": "^5.7.2"
        },
        devDependencies: {
          "typescript": "^4.9.5",
          "ts-node": "^10.9.2"
        },
        license: "MIT"
      };
      fs.writeFileSync(
        path.join(projectPath, "package.json"),
        JSON.stringify(packageJsonNode, null, 2)
      );

      // Create a basic tsconfig.json for Node.js.
      const tsconfigNode = {
        compilerOptions: {
          target: "es2019",
          module: "commonjs",
          strict: true,
          esModuleInterop: true,
          outDir: "dist",
          rootDir: "src"
        },
        include: ["src/**/*"]
      };
      fs.writeFileSync(
        path.join(projectPath, "tsconfig.json"),
        JSON.stringify(tsconfigNode, null, 2)
      );

      // Create a README.md file for the Node.js project.
      const readmeNode = `# ${projectName}

This project was scaffolded using \`create-comet-app\` with the Node.js template. It integrates the \`@comet-devx/sdk\` for interacting with Compound V3 (Comet).

## Getting Started

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Update \`src/index.ts\` with your RPC provider URL, private key, and Comet/USDC addresses.

3. Build and run the project:
   \`\`\`
   npm run build
   npm start
   \`\`\`
`;
      fs.writeFileSync(path.join(projectPath, "README.md"), readmeNode.trim());
      
    } else {
      console.warn(`Template "${options.template}" not recognized. Use "react" or "node".`);
      process.exit(1);
    }

    console.log(`Project "${projectName}" created successfully at ${projectPath}`);
  });

// Parse command-line arguments.
program.parse(process.argv);
