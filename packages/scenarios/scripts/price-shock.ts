// scripts/price-shock.ts
import hre from "hardhat";
const { ethers } = hre;

//
// 1) Mainnet addresses (checksummed via ethers.getAddress)
//
const COMET_ADDRESS      = ethers.getAddress("0xc3d688B66703497DAA19211EEdff47f25384cdc3");
const ETH_USD_AGGREGATOR = ethers.getAddress("0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419");
const WETH_ADDRESS       = ethers.getAddress("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");

//
// 2) ABIs we’ll call
//
const WETH_ABI = [
  "function deposit() payable",
  "function approve(address,uint256) external returns (bool)",
  "function balanceOf(address) external view returns (uint256)",
];
const COMET_WETH_ABI = [
  "function supply(address asset, uint256 amount) external",
  "function collateralBalanceOf(address account, address asset) external view returns (uint256)",
];
const AGGREGATOR_ABI = [
  "function latestRoundData() view returns (uint80, int256, uint256, uint256, uint80)",
  "function decimals() view returns (uint8)",
];

async function main() {
  const [user] = await ethers.getSigners();
  console.log(`\n👤 User: ${user.address}`);

  //
  // --- Step A: Wrap 1 ETH → supply 1 WETH to Comet ---
  //
  const weth  = await ethers.getContractAt(WETH_ABI,      WETH_ADDRESS,       user);
  const comet = await ethers.getContractAt(COMET_WETH_ABI, COMET_ADDRESS, user);

  // 1) Wrap
  await weth.deposit({ value: ethers.parseEther("1") });
  const wethBal = await weth.balanceOf(user.address);
  console.log(`🪙 Wrapped 1 ETH → ${ethers.formatUnits(wethBal,18)} WETH`);

  // 2) Approve & supply
  await weth.approve(COMET_ADDRESS, wethBal);
  await comet.supply(WETH_ADDRESS, wethBal);
  console.log(`🚀 Supplied ${ethers.formatUnits(wethBal,18)} WETH to Comet`);

  // 3) Raw token collateral (should be = wethBal)
  const rawCollateral = await comet.collateralBalanceOf(user.address, WETH_ADDRESS);
  console.log(`🏦 Raw collateralBalanceOf: ${ethers.formatUnits(rawCollateral,18)} WETH\n`);

  //
  // --- Step B: Read real on-chain ETH/USD price (pre-shock) ---
  //
  const aggReal = await ethers.getContractAt(AGGREGATOR_ABI, ETH_USD_AGGREGATOR);
  const [ , answerBefore ] = await aggReal.latestRoundData();
  const dec = await aggReal.decimals();
  const usdBefore = rawCollateral * BigInt(answerBefore) / BigInt(10) ** BigInt(dec);
  console.log(`💵 USD value pre-shock: ${ethers.formatUnits(usdBefore,18)} USD\n`);

    //
  // --- Step C: Deploy a MockAggregator at a new address ---
  //
  const MockFactory = await ethers.getContractFactory("MockAggregator");
  // e.g. shock down to $500 (×10^decimals)
  const shockPrice = 500n * 10n ** BigInt(dec);
  const mockAgg = await MockFactory.deploy(shockPrice);
  // ethers v6: waitForDeployment, and use .target instead of .address
  await mockAgg.waitForDeployment();
  console.log(`🔧 Deployed MockAggregator at ${mockAgg.target} with price ${ethers.formatUnits(shockPrice, dec)} USD`);

  //
  // --- Step D: Read the mock’s latestRoundData (post-shock) ---
  //
  const [ , answerAfter ] = await mockAgg.latestRoundData();
  const usdAfter = rawCollateral * BigInt(answerAfter) / BigInt(10) ** BigInt(dec);
  console.log(`❗️ USD value post-shock: ${ethers.formatUnits(usdAfter,18)} USD\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
