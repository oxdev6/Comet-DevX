import { extendConfig, extendEnvironment, task } from "hardhat/config";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import "./type-extensions";
import { defaultNetworks } from "./config/networks";
// import "./tasks/setup";
// import "./tasks/fork";

// Extend Hardhat config with Comet defaults and user overrides
extendConfig((config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
  config.comet = {
    networks: {
      ...defaultNetworks,
      ...(Object.entries(userConfig.comet?.networks || {}).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: { ...defaultNetworks.mainnet, ...value }
      }), {}))
    }
  };
});

// Extend Hardhat runtime environment to add comet helpers
extendEnvironment((hre) => {
  hre.comet = {
    getNetworkConfig: (): any => {
      const networkName = hre.network.name;
      const config = hre.config.comet.networks[networkName];
      if (!config) {
        throw new Error(`No configuration found for network ${networkName}`);
      }
      return config;
    }
  };
});

// Import tasks so they get registered
import "./tasks/setup";
import "./tasks/fork";
import "./tasks/tokens";
import "./tasks/print-config";



// Ensure this is treated as a Hardhat plugin
export default {};
