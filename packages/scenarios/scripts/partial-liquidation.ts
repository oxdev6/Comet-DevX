// packages/scenarios/scripts/partial-liquidation.ts
import { ethers, network } from "hardhat";
import { getAddress, parseUnits, formatUnits } from "ethers";

/* ────────── constants ────────── */
const COMET = getAddress("0xc3d688b66703497daa19211eedff47f25384cdc3");
const FEED  = getAddress("0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419"); // ETH / USD
const WETH  = getAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
const USDC  = getAddress("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");

/* ────────── ABIs ────────── */
const WETH_ABI = [
  "function deposit() payable",
  "function approve(address,uint256) external returns (bool)"
];
const COMET_ABI = [
  "function supply(address,uint256)",
  "function withdraw(address,uint256)",
  "function collateralBalanceOf(address,address) view returns (uint256)",
  "function borrowBalanceOf(address) view returns (uint256)",
  "function isLiquidatable(address) view returns (bool)",
  "function absorb(address,address[])",
  "function getAssetInfo(uint8) view returns (uint96,uint64,uint8,uint8,uint32,uint32,uint64,uint64)"
];
const FEED_ABI = [
  "function decimals() view returns (uint8)",
  "function latestRoundData() view returns (uint80,int256,uint256,uint256,uint80)"
];

async function main() {
  const [victim, liquidator] = await ethers.getSigners();
  console.log(`Victim:     ${victim.address}`);
  console.log(`Liquidator: ${liquidator.address}\n`);

  /* contracts */
  const weth  = await ethers.getContractAt(WETH_ABI, WETH, victim);
  const comet = await ethers.getContractAt(COMET_ABI, COMET, victim);
  /** cast to any for absorb call */
  const cometLiq: any = comet.connect(liquidator);
  const feed  = await ethers.getContractAt(FEED_ABI, FEED);

  /* 1. supply 1 WETH */
  const deposit = parseUnits("1");
  await weth.deposit({ value: deposit });
  await weth.approve(COMET, deposit);
  await comet.supply(WETH, deposit);

  /* 2. liquidation CF for WETH */
  const info = await comet.getAssetInfo(0);
  const liqCF = info[6];                               // 1 e18-scaled

  /* 3. borrow close to limit */
  const [, priceRaw] = await feed.latestRoundData();
  const feedDec = await feed.decimals();
  const price   = BigInt(priceRaw.toString());

  const colUsd = deposit * price / 10n**(18n - BigInt(feedDec));
  const maxDebt = colUsd * liqCF / 10n**18n;
  const borrowAmt = maxDebt * 95n / 100n;               // 95 %

  await comet.withdraw(USDC, borrowAmt);
  console.log(
    `✅ Victim supplied 1 WETH & borrowed ${formatUnits(borrowAmt,6)} USDC`
  );

  /* 4. swap feed with mutable mock */
  const Mock = await ethers.getContractFactory("MockAggregator", liquidator);
  const mock = await Mock.deploy(price);
  await mock.waitForDeployment();

  const code = await ethers.provider.getCode(mock.target);
  await network.provider.send("hardhat_setCode", [FEED, code]);
  console.log(`🔧 Feed overridden with mock ${mock.target}\n`);

  const setPrice = async (p: bigint) => {
    const slot0 = "0x" + p.toString(16).padStart(64, "0");
    await network.provider.send("hardhat_setStorageAt", [mock.target,"0x0",slot0]);
    await network.provider.send("evm_mine");
  };

  /* 5. drop price 2 % per step */
  let p = price;
  for (let i = 1; i <= 120; i++) {
    p = p * 98n / 100n;            // −2 %
    await setPrice(p);
    if (await comet.isLiquidatable(victim.address)) {
      console.log(`\n✅ Liquidatable after ${i} steps at $${formatUnits(p,feedDec)}`);
      break;
    }
    if (i % 10 === 0)
      console.log(`step ${i}: $${formatUnits(p,feedDec)}`);
    if (i === 120) {
      console.error("❌ gave up after 120 steps");
      return;
    }
  }

  /* 6. liquidate */
  await (await cometLiq.absorb(liquidator.address,[victim.address])).wait();
  console.log("✅ absorb() mined");
}

main().catch(e => { console.error(e); process.exit(1); });
