// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title SimpleMockAdapter
/// @notice Mock adapter that holds funds without callbacks
/// @dev Doesn't call notifyUnstakeReturned - router pulls funds instead

interface IStakingAdapterBNB {
    function stake() external payable;
    function harvest() external;
    function beginUnstake(uint256 amountWei) external;
    function setRouter(address router_) external;
}

contract SimpleMockAdapter is IStakingAdapterBNB {
    address public router;
    address public owner;

    // Track pending withdrawals without calling back
    mapping(uint256 => uint256) public pendingWithdrawals;
    uint256 public withdrawalNonce;

    // Time-based rewards tracking
    uint256 public lastHarvestTime;
    uint256 public totalStaked;

    // APY: 10% per year for testing (in basis points: 1000 = 10%)
    uint256 public constant ANNUAL_RATE_BP = 1000; // 10% APY
    uint256 public constant BP_DIVISOR = 10000;
    uint256 public constant SECONDS_PER_YEAR = 365 days;

    event Staked(uint256 amount);
    event Harvested(uint256 rewards);
    event UnstakeRequested(uint256 nonce, uint256 amount);

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
        lastHarvestTime = block.timestamp;
    }

    /// @notice Accept stake
    function stake() external payable onlyRouter {
        totalStaked += msg.value;
        emit Staked(msg.value);
    }

    /// @notice Calculate pending rewards based on time elapsed
    function calculatePendingRewards() public view returns (uint256) {
        if (totalStaked == 0) return 0;

        uint256 timeElapsed = block.timestamp - lastHarvestTime;

        // rewards = staked * APY * timeElapsed / secondsPerYear
        // Example: 0.1 BNB staked for 600 seconds (10 min) at 10% APY
        // = 0.1 * 0.1 * (600 / 31536000) = 0.00000190258 BNB
        uint256 rewards = (totalStaked * ANNUAL_RATE_BP * timeElapsed) /
            (BP_DIVISOR * SECONDS_PER_YEAR);

        return rewards;
    }

    /// @notice Mock harvest with time-based rewards
    function harvest() external onlyRouter {
        uint256 pendingRewards = calculatePendingRewards();

        if (pendingRewards > 0) {
            // Check if we have enough balance for rewards
            require(address(this).balance >= pendingRewards, "INSUFFICIENT_BALANCE_FOR_REWARDS");
            
            lastHarvestTime = block.timestamp;

            (bool success, ) = router.call{value: pendingRewards}(
                abi.encodeWithSignature("notifyRewardsReceived()")
            );
            require(success, "HARVEST_FAILED");
            emit Harvested(pendingRewards);
        }
    }

    /// @notice Begin unstake - send funds back to router WITH proper callback
    function beginUnstake(uint256 amountWei) external onlyRouter {
        require(address(this).balance >= amountWei, "INSUFFICIENT_BALANCE");

        // Reduce tracked staked amount
        if (amountWei <= totalStaked) {
            totalStaked -= amountWei;
        } else {
            totalStaked = 0;
        }

        pendingWithdrawals[withdrawalNonce] = amountWei;
        emit UnstakeRequested(withdrawalNonce, amountWei);
        withdrawalNonce++;

        // Send funds back to router WITH notifyUnstakeReturned callback
        // This properly notifies the router that unstaked funds have returned
        (bool success, ) = payable(router).call{value: amountWei}(
            abi.encodeWithSignature("notifyUnstakeReturned()")
        );
        require(success, "TRANSFER_FAILED");
    }

    /// @notice Update router
    function setRouter(address router_) external onlyOwner {
        require(router_ != address(0), "ZERO_ADDRESS");
        router = router_;
    }

    /// @notice Fund reward pool (owner deposits BNB for rewards)
    function fundRewards() external payable onlyOwner {
        require(msg.value > 0, "MUST_SEND_BNB");
        // Funds added to contract balance, available for rewards
    }

    /// @notice Emergency withdraw
    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = payable(owner).call{value: address(this).balance}(
            ""
        );
        require(success, "WITHDRAW_FAILED");
    }

    /// @notice Get balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {}
}
