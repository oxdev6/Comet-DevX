import { task, types } from "hardhat/config";

task("fork-network", "Fork a network locally at a given block")
  .addOptionalParam("blockNumber", "Block number to fork from", undefined, types.int)
  .setAction(async (taskArgs, hre) => {
    const networkName = hre.network.name;
    const networkConfig = hre.config.networks[networkName];

    if (!networkConfig) {
      throw new Error(`No configuration found for network: ${networkName}`);
    }

    // If we're on the local Hardhat network with forking configured:
    //   - we'll use networkConfig.forking.url (if set)
    // Else if it's a direct network (like mainnet), we expect networkConfig.url
    const forkingConfig = (networkConfig as any).forking; 
    const topLevelUrl = (networkConfig as any).url;

    let rpcUrl: string | undefined;
    if (forkingConfig && forkingConfig.url) {
      // Hardhat network with a forking config
      rpcUrl = forkingConfig.url;
    } else if (topLevelUrl) {
      // "mainnet" or some other network that has a top-level url
      rpcUrl = topLevelUrl;
    }

    if (!rpcUrl) {
      throw new Error(
        `No RPC URL found for network: ${networkName}. ` +
        `Please set one in hardhat.config.ts (either as 'url' or under 'forking.url').`
      );
    }

    const blockNumber = taskArgs.blockNumber || (forkingConfig && forkingConfig.blockNumber) || undefined;

    console.log(`Forking ${networkName} from ${rpcUrl} at block ${blockNumber || "latest"}...`);

    await hre.network.provider.request({
      method: "hardhat_reset",
      params: [
        {
          forking: {
            jsonRpcUrl: rpcUrl,
            blockNumber: blockNumber,
          },
        },
      ],
    });

    console.log(`Successfully forked ${networkName} at block ${blockNumber || "latest"}.`);
  });
