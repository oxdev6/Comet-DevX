import { task } from "hardhat/config";

task("print-network-config", "Print the current network configuration")
  .setAction(async (_, hre) => {
    const config = hre.comet.getNetworkConfig();
    console.log("Network configuration for", hre.network.name, ":", config);
    return config;
  });
