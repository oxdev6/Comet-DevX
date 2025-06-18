import "@nomicfoundation/hardhat-ethers";
import "./src/index"; // Tells Hardhat to load everything from the plugin entry point
import { HardhatUserConfig } from "hardhat/types";

const infuraKey = process.env.INFURA_API_KEY || "";
const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: `https://mainnet.infura.io/v3/${infuraKey}`,
        // blockNumber: 17000000 // optional
      }
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${infuraKey}`
    }
  },
  solidity: "0.8.17"
};

export default config;
