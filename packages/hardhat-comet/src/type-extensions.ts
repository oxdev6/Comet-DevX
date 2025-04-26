import "hardhat/types/config";
import "hardhat/types/runtime";
import { NetworkConfig } from "./config/networks";


declare module "hardhat/types/config" {
  export interface HardhatUserConfig {
    comet?: {
      networks?: {
        [network: string]: {
          cometAddress?: string;
          // add other custom properties if needed
        };
      };
    };
  }
  export interface HardhatConfig {
    comet: {
      networks: {
        [network: string]: {
          cometAddress?: string;
        };
      };
    };
  }
}


// Extend HardhatRuntimeEnvironment
declare module "hardhat/types/runtime" {
  interface HardhatRuntimeEnvironment {
    comet: {
      getNetworkConfig(): NetworkConfig;
    };
  }
} 