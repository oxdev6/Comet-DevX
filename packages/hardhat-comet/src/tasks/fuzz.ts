import { task } from "hardhat/config";
import path from "path";
import { execSync } from "child_process";

task("forge-fuzz", "Run Foundry fuzz tests")
  .addOptionalParam("pattern", "Test pattern to run", "")
  .setAction(async (args, hre) => {
    const foundryDir = path.resolve(hre.config.paths.root, "foundry");
    const pat = args.pattern ? `--match-test ${args.pattern}` : "";
    const cmd = `forge test -vv ${pat}`;
    console.log(`Running: ${cmd} in ${foundryDir}`);
    execSync(cmd, { stdio: "inherit", cwd: foundryDir });
  });
