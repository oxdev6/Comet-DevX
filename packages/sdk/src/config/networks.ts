export interface NetworkConfig {
  sepolia: {
    cometProxyAddress: string;
  };
}

export const NETWORKS: NetworkConfig = {
  sepolia: {
    // Replace this with the actual Comet proxy address on Sepolia if known,
    // otherwise we'll keep a placeholder for now.
    cometProxyAddress: "0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf",
  },
};
