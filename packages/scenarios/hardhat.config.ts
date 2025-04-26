// import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";
// import "@nomicfoundation/hardhat-ethers";

// const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || "https://mainnet.infura.io/v3/aba547734f7640bb85673cccedd201b1";

// const config: HardhatUserConfig = {
//   defaultNetwork: "hardhat",
//   networks: {
//     hardhat: {
//       forking: {
//         url: MAINNET_RPC_URL,
//         blockNumber: 19100000 // recent block with stable oracle conditions
//       },
//       initialBaseFeePerGas: 0,        
//       allowUnlimitedContractSize: true
//     }
//   },
//   solidity: "0.8.20"
// };

// export default config;

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";   // includes solidity, ethers plugins

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      forking: {
        url: process.env.MAINNET_RPC_URL || "https://mainnet.infura.io/v3/aba547734f7640bb85673cccedd201b1",
        blockNumber: 19100000
      },
      initialBaseFeePerGas: 0,
      allowUnlimitedContractSize: true
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  },
  paths: {
    sources: "./contracts",     // where MockAggregator.sol lives
    tests:   "./test",
    cache:   "./cache",
    artifacts: "./artifacts"
  }
};

export default config;
