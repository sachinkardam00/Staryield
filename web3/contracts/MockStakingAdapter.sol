// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title MockStakingAdapter
/// @notice Mock adapter for testing without actual StakeHub delegation
/// @dev This adapter accepts stakes but doesn't delegate to StakeHub
/// Useful for frontend testing and development

interface IStakingAdapterBNB {
    function stake() external payable;
    function harvest() external;
    function beginUnstake(uint256 amountWei) external;
    function setRouter(address router_) external;
}

contract MockStakingAdapter is IStakingAdapterBNB {
    address public router;
    address public owner;

    event Staked(uint256 amount);
    event Harvested(uint256 rewards);
    event UnstakeStarted(uint256 amount);

    modifier onlyRouter() {
        require(msg.sender == router, "NOT_ROUTER");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    constructor(address _router) {
        router = _router;
        owner = msg.sender;
    }

    /// @notice Accept stake (mock - doesn't actually delegate)
    function stake() external payable onlyRouter {
        emit Staked(msg.value);
        // BNB is held in this contract, not delegated
    }

    /// @notice Mock harvest - can manually send rewards for testing
    function harvest() external onlyRouter {
        // Calculate mock rewards (0.1% of balance for testing)
        uint256 mockRewards = address(this).balance / 1000;

        if (mockRewards > 0) {
            // Send mock rewards to router
            (bool success, ) = router.call{value: mockRewards}(
                abi.encodeWithSignature("notifyRewardsReceived()")
            );
            require(success, "NOTIFY_FAILED");
            emit Harvested(mockRewards);
        }
    }

    /// @notice Mock unstake - immediately available
    function beginUnstake(uint256 amountWei) external onlyRouter {
        require(address(this).balance >= amountWei, "INSUFFICIENT_BALANCE");

        // Immediately return funds (no unbonding period in mock)
        (bool success, ) = router.call{value: amountWei}(
            abi.encodeWithSignature("notifyUnstakeReturned()")
        );
        require(success, "NOTIFY_FAILED");
        emit UnstakeStarted(amountWei);
    }

    /// @notice Update router address
    function setRouter(address router_) external onlyOwner {
        require(router_ != address(0), "ZERO_ADDRESS");
        router = router_;
    }

    /// @notice Owner can withdraw any stuck funds
    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "WITHDRAW_FAILED");
    }

    /// @notice Get contract balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Accept BNB
    receive() external payable {}
}
