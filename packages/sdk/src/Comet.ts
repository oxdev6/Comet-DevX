import { ethers } from "ethers";
import { NETWORKS } from "./config/networks";
const CometInterface = require("./abis/CometInterface.json");

export class Comet {
  private contract: ethers.Contract;

  constructor(
    network: keyof typeof NETWORKS,
    signerOrProvider: ethers.Signer | ethers.Provider
  ) {
    const { cometProxyAddress } = NETWORKS[network];
    
    this.contract = new ethers.Contract(
      cometProxyAddress,
      CometInterface,
      signerOrProvider
    );
  }

  public sampleMethod(): string {
    return "MVP placeholder";
  }

    /**
   * Supply an asset into Comet
   * @param asset - the ERC20 token address being supplied
   * @param amount - the raw amount (in smallest units) to supply
   * @returns a TransactionResponse from ethers
   */
    public async supply(
        asset: string,
        amount: ethers.BigNumberish
      ): Promise<ethers.ContractTransaction> {
        // In a real scenario, the user must have already "approved" the Comet contract
        // to pull tokens from their wallet. We assume that’s handled externally.
        return this.contract.supply(asset, amount);
      }

        /**
   * Borrow the base asset from Comet by calling `withdraw(baseAsset, amount)`.
   * You must have enough collateral to safely do this.
   * @param amount - The raw amount of base asset to borrow (e.g. USDC in smallest units)
   * @returns TransactionResponse
   */
  public async borrow(
    amount: ethers.BigNumberish
  ): Promise<ethers.ContractTransaction> {
    // get the base token address from Comet
    // const baseAsset: string = await this.contract.baseToken();
    const baseAsset: string = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d";

    // "Borrow" by withdrawing the base asset from your account
    return this.contract.withdraw(baseAsset, amount);
  }
  

  /**
   * Repay borrowed amount by calling supply(baseAsset, amount).
   * This effectively offsets your negative base balance in Comet.
   * @param amount - The raw amount of base asset to repay
   */
  public async repay(
    amount: ethers.BigNumberish
  ): Promise<ethers.ContractTransaction> {
    // const baseAsset: string = await this.contract.baseToken();
    const baseAsset: string = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d";

    return this.contract.supply(baseAsset, amount);
  }
}