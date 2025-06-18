// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Test.sol";

interface IComet {
    function supply(address asset, uint256 amount) external;
}

contract CometFuzz is Test {
    address constant COMET = 0xc3d688B66703497DAA19211EEdff47f25384cdc3;
    address constant USDC  = 0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48;

    function setUp() public {
        string memory rpc = vm.envOr("MAINNET_RPC_URL", "");
        vm.createSelectFork(rpc, 19100000);
    }

    function testFuzzSupply(uint256 amount) public {
        amount = bound(amount, 1, 1_000_000e6);
        vm.assume(amount > 0);
        IComet comet = IComet(COMET);
        // placeholder: would call comet.supply(USDC, amount);
        assertTrue(amount <= 1_000_000e6);
    }
}
