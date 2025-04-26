import { task } from "hardhat/config";
import { ethers } from "ethers";
import type { HardhatRuntimeEnvironment } from "hardhat/types";

// Minimal ERC20 ABI needed for our calls.
const IERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address,uint256) returns (bool)",
  "function approve(address,uint256) returns (bool)"
];

// Minimal Comet ABI (only the supply function needed here)
const COMET_ABI = [
  "function supply(address asset, uint256 amount) external"
];

// Raw addresses (as strings, in lowercase to ensure proper checksum when normalized)
const USDC_ADDRESS_RAW = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const FALLBACK_COMET_ADDRESS_RAW = "0xc3d688b66703497daa19211eedff47f25384cdc3";
const RICH_USDC_HOLDER = "0x37305b1cd40574e4c5ce33f8e8306be057fd7341";

// Inline minimal interface for ERC20 functions.
interface IERC20 {
  approve(spender: string, amount: ethers.BigNumberish): Promise<any>;
  transfer(to: string, amount: ethers.BigNumberish): Promise<any>;
  balanceOf(account: string): Promise<ethers.BigNumber>;
}

task("setup-comet-env", "Set up a local Comet dev environment on a fork")
  .setAction(async (_, hre: HardhatRuntimeEnvironment) => {
    // Normalize addresses at runtime using ethers v5.7.2
    const USDC_ADDRESS = ethers.utils.getAddress(USDC_ADDRESS_RAW);
    const FALLBACK_COMET_ADDRESS = ethers.utils.getAddress(FALLBACK_COMET_ADDRESS_RAW);

    const networkName = hre.network.name;
    if (networkName !== "hardhat") {
      console.warn(
        `Warning: setup-comet-env is designed to run on a forked "hardhat" network. You're on '${networkName}'.`
      );
    }

    // Step 1: Impersonate the USDC whale.
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [RICH_USDC_HOLDER],
    });
    console.log(`Impersonated USDC whale: ${RICH_USDC_HOLDER}`);
    const whaleSigner = await hre.ethers.getSigner(RICH_USDC_HOLDER);

    // Step 2: Transfer 1,000 USDC from the whale to the test account.
    const [testAccount] = await hre.ethers.getSigners();
    console.log(`Transferring 1,000 USDC to test account: ${testAccount.address}`);

    // Get the USDC contract instance using the whale as the signer.
    const usdcBase = await hre.ethers.getContractAt(IERC20_ABI, USDC_ADDRESS, whaleSigner);
    // Cast it to our inline IERC20 interface.
    const usdc = usdcBase as unknown as IERC20;

    // Define the fund amount: 1,000 USDC with 6 decimals.
    const FUND_AMOUNT = ethers.utils.parseUnits("1000", 6); // This returns a BigNumber
    // IMPORTANT: Convert FUND_AMOUNT to string when passing it as a BigNumberish.
    const transferTx = await usdc.transfer(testAccount.address, FUND_AMOUNT.toString());
    await transferTx.wait();

    // Stop impersonating the whale.
    await hre.network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [RICH_USDC_HOLDER],
    });

    // Step 3: Determine the Comet address.
    let cometAddress: string;
    if (
      hre.config.comet &&
      hre.config.comet.networks &&
      hre.config.comet.networks[networkName] &&
      hre.config.comet.networks[networkName].cometAddress
    ) {
      cometAddress = hre.config.comet.networks[networkName].cometAddress!;
    } else {
      cometAddress = FALLBACK_COMET_ADDRESS;
      console.warn(`No Comet address found in config for network '${networkName}'. Falling back to: ${cometAddress}`);
    }
    // Normalize the Comet address at runtime.
    cometAddress = ethers.utils.getAddress(cometAddress);

    // Step 4: Approve the Comet contract to spend USDC from the test account.
    const usdcAsTestAccount = usdcBase.connect(testAccount) as unknown as IERC20;
    console.log(`Approving Comet (${cometAddress}) to spend test account's USDC...`);
    const approveTx = await usdcAsTestAccount.approve(cometAddress, FUND_AMOUNT.toString());
    await approveTx.wait();

    // Step 5: Supply USDC to the Comet contract.
    const comet = await hre.ethers.getContractAt(COMET_ABI, cometAddress, testAccount);
    console.log(`Supplying 1,000 USDC to Comet at ${cometAddress}...`);
    const supplyTx = await comet.supply(USDC_ADDRESS, FUND_AMOUNT.toString());
    await supplyTx.wait();

    console.log("Successfully supplied 1,000 USDC to Comet!");

    // Optional: Check final USDC balance of the test account.
    const finalBal = await usdcAsTestAccount.balanceOf(testAccount.address);
    console.log(`Test account's USDC balance after supply: ${finalBal.toString()} (should be 0 if fully supplied)`);
  });
