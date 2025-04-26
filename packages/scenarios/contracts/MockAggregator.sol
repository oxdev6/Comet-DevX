// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockAggregator {
    int256 private _price;
    uint8  private constant _DECIMALS = 8;

    constructor(int256 initialPrice) {
        _price = initialPrice;
    }

    /// @notice Mimic Chainlink’s latestRoundData
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (0, _price, 0, block.timestamp, 0);
    }

    /// @notice Mimic Chainlink’s decimals()
    function decimals() external pure returns (uint8) {
        return _DECIMALS;
    }
}
