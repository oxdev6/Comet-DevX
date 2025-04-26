// packages/scenarios/scripts/interest-rate-spike.ts

import hre from "hardhat";
import {
  getAddress,
  parseUnits,
  formatUnits,
  type BigNumberish,
  type TransactionResponse
} from "ethers";

interface ERC20 {
  transfer(to: string, amount: BigNumberish): Promise<TransactionResponse>;
  approve(spender: string, amount: BigNumberish): Promise<TransactionResponse>;
  balanceOf(account: string): Promise<bigint>;
}

interface Comet {
  getUtilization(): Promise<bigint>;
  getSupplyRate(utilization: BigNumberish): Promise<bigint>;
  getBorrowRate(utilization: BigNumberish): Promise<bigint>;
  supply(asset: string, amount: BigNumberish): Promise<TransactionResponse>;
  withdraw(asset: string, amount: BigNumberish): Promise<TransactionResponse>;
}

async function main() {
  const { ethers, network } = hre;
  const [user] = await ethers.getSigners();

  // ─── On-chain addresses ───
  const COMET_ADDRESS = getAddress("0xc3d688b66703497daa19211eedff47f25384cdc3");
  const USDC_ADDRESS  = getAddress("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");
  const USDC_WHALE    = getAddress("0x0A59649758aa4d66E25f08Dd01271e891fe52199");

  console.log(`User: ${user.address}\n`);

  // ─── ABIs ───
  const COMET_ABI = [
    "function getUtilization() view returns (uint256)",
    "function getSupplyRate(uint256) view returns (uint256)",
    "function getBorrowRate(uint256) view returns (uint256)",
    "function supply(address,uint256) external",
    "function withdraw(address,uint256) external"
  ];
  const ERC20_ABI = [
    "function transfer(address,uint256) returns (bool)",
    "function approve(address,uint256) returns (bool)",
    "function balanceOf(address) view returns (uint256)"
  ];

  // ─── Contract instances (with casting) ───
  const cometRaw = await ethers.getContractAt(COMET_ABI, COMET_ADDRESS, user);
  const comet    = cometRaw as unknown as Comet;

  const usdcRaw  = await ethers.getContractAt(ERC20_ABI, USDC_ADDRESS, user);
  const usdc     = usdcRaw  as unknown as ERC20;

  // ─── 1) Impersonate USDC whale & fund user ───
  const FUND_AMOUNT: BigNumberish = parseUnits("100000", 6); // 100,000 USDC

  console.log(`Transferring ${formatUnits(FUND_AMOUNT, 6)} USDC from whale…`);
  // give whale some ETH to cover gas
  await network.provider.request({
    method: "hardhat_setBalance",
    params: [USDC_WHALE, "0x1000000000000000000"]
  });
  // start impersonation
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [USDC_WHALE]
  });
  // get a contract instance *with* the whale as signer
  const usdcWhaleRaw = await ethers.getContractAt(ERC20_ABI, USDC_ADDRESS, await ethers.getSigner(USDC_WHALE));
  const usdcWhale    = usdcWhaleRaw as unknown as ERC20;
  // transfer
  await usdcWhale.transfer(user.address, FUND_AMOUNT);
  // stop impersonation
  await network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [USDC_WHALE]
  });

  // ─── 2) Approve & supply ───
  console.log("\nApproving Comet to spend USDC…");
  await usdc.approve(COMET_ADDRESS, FUND_AMOUNT);

  console.log(`Supplying ${formatUnits(FUND_AMOUNT, 6)} USDC to Comet…`);
  await comet.supply(USDC_ADDRESS, FUND_AMOUNT);

  // ─── helper to snapshot utilization & APRs ───
  const SECS_PER_YEAR = 60 * 60 * 24 * 365;
  async function snapshot() {
    const utilRaw    = await comet.getUtilization();
    const supRateSec = await comet.getSupplyRate(utilRaw);
    const borRateSec = await comet.getBorrowRate(utilRaw);

    const util   = Number(utilRaw) / 1e18;
    const supApr = (Number(supRateSec) / 1e18) * SECS_PER_YEAR * 100;
    const borApr = (Number(borRateSec) / 1e18) * SECS_PER_YEAR * 100;

    return { util, supApr, borApr };
  }

  // ─── 3) BEFORE spike ───
  const before = await snapshot();
  console.log("\nBefore spike:");
  console.log(`  Utilization: ${before.util.toFixed(4)}`);
  console.log(`  Supply APR:  ${before.supApr.toFixed(4)}%`);
  console.log(`  Borrow APR:  ${before.borApr.toFixed(4)}%\n`);

  // ─── 4) BORROW 99% to push past the kink ───
  const BORROW_AMOUNT = (BigInt(FUND_AMOUNT.toString()) * 99n) / 100n;
  console.log(`Borrowing ${formatUnits(BORROW_AMOUNT, 6)} USDC…`);
  await comet.withdraw(USDC_ADDRESS, BORROW_AMOUNT);

  // ─── 5) AFTER spike ───
  const after = await snapshot();
  console.log("After spike:");
  console.log(`  Utilization: ${after.util.toFixed(4)}`);
  console.log(`  Supply APR:  ${after.supApr.toFixed(4)}%`);
  console.log(`  Borrow APR:  ${after.borApr.toFixed(4)}%\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
