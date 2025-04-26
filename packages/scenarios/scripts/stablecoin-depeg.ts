// packages/scenarios/scripts/stablecoin-depeg.ts

import hre from "hardhat";
import {
  getAddress,
  parseUnits,
  formatUnits,
  type BigNumberish,
  Contract
} from "ethers";

type ERC20 = {
  transfer(to: string, amount: BigNumberish): Promise<any>;
  approve(spender: string, amount: BigNumberish): Promise<any>;
  balanceOf(account: string): Promise<bigint>;
};

async function main() {
  const { ethers, network } = hre;
  const [user, liquidator] = await ethers.getSigners();

  // ─── on-chain addresses (checksummed) ───
  const COMET     = getAddress("0xc3d688b66703497daa19211eedff47f25384cdc3");
  const USDT      = getAddress("0xdAC17F958D2ee523a2206206994597C13D831ec7");
  const USDC      = getAddress("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");
  const USDT_FEED = getAddress("0x3E7d1eAB13ad0104d2750B8863b489D65364e32D");

  console.log(`\n👤  User:       ${user.address}`);
  console.log(`🛡  Liquidator: ${liquidator.address}\n`);

  // ─── ABIs ───
  const ERC20_ABI = [
    "function transfer(address,uint256) returns (bool)",
    "function approve(address,uint256) returns (bool)",
    "function balanceOf(address) view returns (uint256)"
  ];
  const COMET_ABI = [
    "function supply(address,uint256) external",
    "function withdraw(address,uint256) external",
    "function collateralBalanceOf(address,address) view returns (uint256)",
    "function borrowBalanceOf(address) view returns (uint256)",
    "function isLiquidatable(address) view returns (bool)",
    "function absorb(address,address[]) external"
  ];
  const FEED_ABI = [
    "function decimals() view returns (uint8)",
    "function latestRoundData() view returns (uint80,int256,uint256,uint256,uint80)"
  ];

  // ─── Contract instances ───
  const usdtBase    = await ethers.getContractAt(ERC20_ABI, USDT) as unknown as Contract & ERC20;
  const usdtUser    = usdtBase.connect(user)      as Contract & ERC20;
  const cometUser   = await ethers.getContractAt(COMET_ABI, COMET, user);
  const cometLiq    = await ethers.getContractAt(COMET_ABI, COMET, liquidator);
  const feedUSDT    = await ethers.getContractAt(FEED_ABI, USDT_FEED);

  // ─── 1) Impersonate USDT whale & fund user ───
  const USDT_WHALE   = getAddress("0xF977814e90dA44bFA03b6295A0616a897441aceC");
  const COLL_AMOUNT  = parseUnits("1000", 6); // 1 000 USDT

  console.log(`🔀 Impersonating whale and sending ${formatUnits(COLL_AMOUNT,6)} USDT…`);
  await network.provider.request({
    method: "hardhat_setBalance",
    params: [USDT_WHALE, "0x1000000000000000000"]  // give whale 1 ETH
  });
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [USDT_WHALE]
  });
  const whaleSigner = await ethers.getSigner(USDT_WHALE);
  const usdtWhale   = usdtBase.connect(whaleSigner) as Contract & ERC20;
  await usdtWhale.transfer(user.address, COLL_AMOUNT);
  await network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [USDT_WHALE]
  });

  console.log(`📥 User USDT balance: ${formatUnits(await usdtUser.balanceOf(user.address),6)} USDT\n`);

  // ─── 2) Approve & supply as collateral ───
  console.log(`🔒 Approving Comet to spend USDT…`);
  await usdtUser.approve(COMET, COLL_AMOUNT);
  console.log(`📦 Supplying ${formatUnits(COLL_AMOUNT,6)} USDT to Comet…`);
  await cometUser.supply(USDT, COLL_AMOUNT);

  // ─── 3) Borrow USDC (80% LTV) ───
  const BORROW_AMOUNT = parseUnits("800", 6); // $800
  console.log(`💸 Borrowing ${formatUnits(BORROW_AMOUNT,6)} USDC…`);
  await cometUser.withdraw(USDC, BORROW_AMOUNT);

  const preCol  = await cometUser.collateralBalanceOf(user.address, USDT);
  const preDebt = await cometUser.borrowBalanceOf(user.address);
  console.log(`\n🏦 Pre-depeg collateral: ${formatUnits(preCol,6)} USDT`);
  console.log(`💰 Pre-depeg debt:       ${formatUnits(preDebt,6)} USDC\n`);

  // ─── 4) Deploy/mock-depeg feed at $0.80 ───
  const [, priceRaw] = await feedUSDT.latestRoundData();
  const feedDec       = await feedUSDT.decimals();
  // $0.80 → 0.80 × 10^feedDec
  const depegPrice    = BigInt(80) * 10n ** BigInt(feedDec - 2);
  const MockFactory   = await ethers.getContractFactory("MockAggregator", liquidator);
  const mockAgg       = await MockFactory.deploy(depegPrice);
  await mockAgg.waitForDeployment();

  // overwrite real feed code
  const code          = await ethers.provider.getCode(mockAgg.target);
  await network.provider.request({
    method: "hardhat_setCode",
    params: [USDT_FEED, code]
  });
  console.log(`🔧 USDT feed now returns $${formatUnits(depegPrice,feedDec)} at ${USDT_FEED}\n`);

  // ─── 5) Liquidate ───
  const isLiq = await cometUser.isLiquidatable(user.address);
  console.log(`⚠️  isLiquidatable? ${isLiq}\n`);
  if (!isLiq) {
    console.error("❌ Not liquidatable after de-peg; aborting.");
    process.exit(1);
  }

  console.log("✅ Liquidatable — calling absorb…");
  await cometLiq.absorb(liquidator.address, [user.address]);
  console.log("🎉 absorb() succeeded!\n");

  const postCol  = await cometLiq.collateralBalanceOf(user.address, USDT);
  const postDebt = await cometLiq.borrowBalanceOf(user.address);
  console.log(`📉 Post-liq collateral: ${formatUnits(postCol,6)} USDT`);
  console.log(`📉 Post-liq debt:       ${formatUnits(postDebt,6)} USDC\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
