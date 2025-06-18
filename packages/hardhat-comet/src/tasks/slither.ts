import { task } from "hardhat/config";
import path from "path";
import { execSync } from "child_process";

task("slither", "Run Slither static analysis on custom contracts").setAction(async (_, hre) => {
  const contractsDir = path.resolve(hre.config.paths.root, "packages", "scenarios", "contracts");
  const cmd = `slither ${contractsDir} --ignore-compile --print human-summary`;
  console.log(`Running: ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
});
