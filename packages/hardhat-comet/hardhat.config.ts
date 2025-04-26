import "@nomicfoundation/hardhat-ethers";
import "./src/index"; // Tells Hardhat to load everything from the plugin entry point
import { HardhatUserConfig } from "hardhat/types";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: "https://mainnet.infura.io/v3/aba547734f7640bb85673cccedd201b1",
        // blockNumber: 17000000 // optional
      }
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/aba547734f7640bb85673cccedd201b1"
    }
  },
  solidity: "0.8.17"
};

export default config;
