import hre from "hardhat";
import { getAddress, parseUnits } from "ethers";

const USDC_ADDRESS = getAddress("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");
const USDC_WHALE = getAddress("0x0A59649758aa4d66E25f08Dd01271e891fe52199");

const ERC20_ABI = [
  "function transfer(address,uint256) external returns (bool)",
  "function balanceOf(address) external view returns (uint256)"
];

async function main() {
  const [localSigner] = await hre.ethers.getSigners();
  const recipient = localSigner.address;

  console.log(`Funding signer: ${recipient}`);

  // Step 1: Give the whale ETH
  await hre.network.provider.request({
    method: "hardhat_setBalance",
    params: [
      USDC_WHALE,
      "0x1000000000000000000" // 1 ETH in hex
    ]
  });

  // Step 2: Impersonate the whale
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [USDC_WHALE],
  });

  const whaleSigner = await hre.ethers.getSigner(USDC_WHALE);
  const usdc = await hre.ethers.getContractAt(ERC20_ABI, USDC_ADDRESS, whaleSigner);

  const amount = parseUnits("1000", 6); // 1000 USDC
  
  const whaleBal = await usdc.balanceOf(USDC_WHALE);
  console.log(`Whale balance before: ${whaleBal.toString()}`);
  
  console.log(`Transferring 1000 USDC from whale to signer...`);
  const tx = await usdc.transfer(recipient, amount);
  await tx.wait();
const bal = await usdc.balanceOf(recipient);
console.log(`Signer USDC balance after transfer: ${bal.toString()}`);

  console.log(`Funding complete.`);

  await hre.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [USDC_WHALE],
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
