// scripts/supply-simulation.ts
import hre from "hardhat";
import { getAddress } from "ethers";

const { ethers } = hre;

// Lowercase in getAddress to avoid checksum errors, or hard-code the checksummed literal
const USDC_ADDRESS  = getAddress("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");
const COMET_ADDRESS = "0xc3d688B66703497DAA19211EEdff47f25384cdc3";

const ERC20_ABI = [
  "function approve(address,uint256) external returns (bool)",
  "function balanceOf(address) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
];

const COMET_ABI = [
  "function supply(address asset, uint256 amount) external",
  // Read your deposited base-asset balance (USDC) including interest
  "function balanceOf(address account) external view returns (uint256)",
];

async function main() {
  const [signer] = await ethers.getSigners();
  console.log(`\n🔎 Simulating supply from: ${signer.address}\n`);

  // Attach to USDC & Comet contracts
  const usdc  = await ethers.getContractAt(ERC20_ABI,  USDC_ADDRESS,  signer);
  const comet = await ethers.getContractAt(COMET_ABI, COMET_ADDRESS, signer);

  const AMOUNT = ethers.parseUnits("1000", 6); // 1 000 USDC

  // Pre-supply USDC balance
  const preUsdc = await usdc.balanceOf(signer.address);
  console.log(`🪙 Pre-supply USDC balance: ${ethers.formatUnits(preUsdc, 6)} USDC\n`);

  // Approve
  console.log(`🔒 Approving ${ethers.formatUnits(AMOUNT, 6)} USDC to Comet…`);
  await usdc.approve(COMET_ADDRESS, AMOUNT);
  const allowance = await usdc.allowance(signer.address, COMET_ADDRESS);
  console.log(`   ✅ Allowance: ${ethers.formatUnits(allowance, 6)} USDC\n`);

  // Supply
  console.log(`🚀 Supplying ${ethers.formatUnits(AMOUNT, 6)} USDC to Comet…`);
  const tx = await comet.supply(USDC_ADDRESS, AMOUNT);
  await tx.wait();
  console.log(`   ✅ Supply tx mined\n`);

  // Post-supply USDC balance
  const postUsdc = await usdc.balanceOf(signer.address);
  console.log(`🪙 Post-supply USDC balance: ${ethers.formatUnits(postUsdc, 6)} USDC\n`);

  // Comet-supplied balance (base asset)
  const baseSupplied = await comet.balanceOf(signer.address);
  console.log(`📈 Comet.balanceOf(base asset): ${ethers.formatUnits(baseSupplied, 6)} USDC\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
