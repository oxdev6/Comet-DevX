export interface NetworkConfig {
  cometAddress?: string; // Make it optional or required, depending on your usage
  wethAddress: string;
  // Add other network-specific configurations
}

export const defaultNetworks: { [network: string]: NetworkConfig } = {
  mainnet: {
    cometAddress: "0xc3d688B66703497DAA19211EEdff47f25384cdc3",
    wethAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  },
  // Add other networks as needed
}; 