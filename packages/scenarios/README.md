
# Comet DevX – Scenario Simulation Toolkit  
_A full-length guide to the four reference scripts_

---

## 1. Overview  
This package ships **four self-contained TypeScript scripts** that exercise critical behaviours of **Compound III (Comet)** on a Hardhat main-net fork.

| Script file | Scenario goal | Core actions |
|-------------|---------------|--------------|
| `supply-simulation.ts` | “Happy-path” supply of USDC into Comet | `ERC20.approve`, `Comet.supply` |
| `price-shock.ts` | **Rapid ETH price drop** – monitor collateral value | Wrap ETH → mock price-feed override |
| `interest-rate-spike.ts` | Drive **utilisation above the kink** – observe APR jump | Whale fund → supply → borrow 99 % |
| `partial-liquidation.ts` | Force an account under water and call **`absorb`** | Collateral WETH + iterative feed grind |

All scripts use **Ethers v6 syntax** and Hardhat JSON-RPC impersonation tricks.

---

## 2. Prerequisites
| Tool | Min version |
|------|-------------|
| Node.js | 18 LTS |
| Hardhat | 3.0.8 |
| Ethers  | ^6.13 |


Clone, then install monorepo deps:

```bash
git clone https://github.com/Comet-DevX-Suite/DevX.git
cd DevX
npm install            
```

---

## 3. Quick local-fork setup
```bash
# terminal ① – main-net fork
npx hardhat node 

# terminal ② – export once to shorten commands
export HH_NET=localhost
```

---

## 4. Running each scenario

### 4.1 Supply-Simulation — baseline
```bash
npx hardhat run scripts/supply-simulation.ts --network $HH_NET
```
Steps  
1. Impersonate USDC whale → send 1 000 USDC  
2. `approve` + `supply` all USDC  
3. Echo pre/post balances.

---

### 4.2 Price-Shock — ETH crash
```bash
npx hardhat run scripts/price-shock.ts --network $HH_NET
```
Workflow  
* Wrap 1 ETH → supply 1 WETH  
* Deploy **MockAggregator** priced at \$500  
* Replace Chainlink ETH/USD code via `hardhat_setCode`  
* Re-query collateral value.

---

### 4.3 Interest-Rate Spike — utilisation jump
```bash
npx hardhat run scripts/interest-rate-spike.ts --network $HH_NET
```
1. Whale airdrops 100 000 USDC → supply.  
2. Snapshot utilisation & APRs.  
3. Borrow 99 000 USDC (~99 %).  
4. Snapshot again.

Formula: `APR = ratePerSecond × 31 536 000 ÷ 1e18`.

---

### 4.4 Partial Liquidation — absorb
```bash
npx hardhat run scripts/partial-liquidation.ts --network $HH_NET
```
Logic  
1. Victim: deposit **0.25 WETH**, borrow 80 % of limit in USDC.  
2. Swap Chainlink ETH/USD feed with a mutable mock.  
3. Loop: price × 0.95 each round until `isLiquidatable(victim)` == **true**.  
4. Liquidator executes `absorb(liquidator, [victim])`.  
5. Print post-liq balances.

Aborts after 60 iterations if still solvent (good CI guard).

---




## 7. Troubleshooting FAQ
| Issue | Fix |
|-------|-----|
| **`bad address checksum`** | Wrap literals with `ethers.getAddress("0x…")`. |
| **`transfer amount exceeds balance`** | Whale lacks ETH gas; fund via `hardhat_setBalance`. |
| **`absorb` missing** | Using outdated ABI; ensure main-net Comet (v3). |
| **Rates unchanged after borrow** | Utilisation below kink; increase borrow amount. |
| **Silent revert on supply** | Asset isn’t base nor listed collateral; use WETH/USDC. |

---


_Happy simulating!_  
Questions? Ping **@TefroLabs** on Discord.

