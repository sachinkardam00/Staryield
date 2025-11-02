// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LoyaltyPoints (Stars System)
 * @notice Manages loyalty points for stakers
 * - Earn stars based on staking amount and duration
 * - 1 star per 0.0001 BNB staked per 24 hours
 * - Track stars from own staking
 * - Track stars from referred users' staking
 * - Track referral count
 */
contract LoyaltyPoints {
    // ============ Errors ============

    error Unauthorized();
    error ZeroAddress();
    error InvalidAmount();

    // ============ Events ============

    event StarsEarned(
        address indexed user,
        uint256 amount,
        string category // "staking" or "referral"
    );

    event StarsUpdated(
        address indexed user,
        uint256 totalStars,
        uint256 stakingStars,
        uint256 referralStars
    );

    event ReferralRecorded(address indexed referrer, address indexed referee);

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    // ============ Structs ============

    struct UserStats {
        uint256 totalStars; // Total stars earned
        uint256 stakingStars; // Stars from own staking
        uint256 referralStars; // Stars from referrals
        uint256 referralCount; // Number of referrals
        uint256 lastUpdateTime; // Last time stars were calculated
        mapping(address => bool) hasReferred; // Track unique referrals
    }

    struct StakeInfo {
        uint256 amount; // Staked amount
        uint256 startTime; // Stake start time
        uint256 lastClaimTime; // Last time stars were claimed
        bool isActive; // Is stake active
    }

    // ============ State Variables ============

    address public owner;
    address public stakingRouter;
    address public referralSystem;

    // Constants for star calculation
    uint256 public constant STARS_PER_PERIOD = 1; // 1 star
    uint256 public constant MIN_STAKE_FOR_STAR = 0.0001 ether; // 0.0001 BNB
    uint256 public constant PERIOD_DURATION = 24 hours; // 24 hours

    // User stats
    mapping(address => UserStats) private userStats;

    // Active stakes for each user (user => stakeId => StakeInfo)
    mapping(address => mapping(uint256 => StakeInfo)) public userStakes;
    mapping(address => uint256) public userStakeCount;

    // Referrer mapping (referee => referrer)
    mapping(address => address) public referrers;

    // ============ Modifiers ============

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier onlyStakingRouter() {
        if (msg.sender != stakingRouter) revert Unauthorized();
        _;
    }

    // ============ Constructor ============

    constructor(address _stakingRouter) {
        if (_stakingRouter == address(0)) revert ZeroAddress();
        owner = msg.sender;
        stakingRouter = _stakingRouter;
    }

    // ============ Admin Functions ============

    function setStakingRouter(address _stakingRouter) external onlyOwner {
        if (_stakingRouter == address(0)) revert ZeroAddress();
        stakingRouter = _stakingRouter;
    }

    function setReferralSystem(address _referralSystem) external onlyOwner {
        if (_referralSystem == address(0)) revert ZeroAddress();
        referralSystem = _referralSystem;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    function renounceOwnership() external onlyOwner {
        address oldOwner = owner;
        owner = address(0);
        emit OwnershipTransferred(oldOwner, address(0));
    }

    /**
     * @notice Admin function to manually record a stake (for migration)
     * @param user The user who staked
     * @param amount The amount staked
     * @param referrer The referrer address (if any)
     */
    function adminRecordStake(
        address user,
        uint256 amount,
        address referrer
    ) external onlyOwner {
        if (user == address(0)) revert ZeroAddress();
        if (amount == 0) revert InvalidAmount();

        // Record the stake
        uint256 stakeId = userStakeCount[user];
        userStakes[user][stakeId] = StakeInfo({
            amount: amount,
            startTime: block.timestamp,
            lastClaimTime: block.timestamp,
            isActive: true
        });
        userStakeCount[user]++;

        // Record referrer if valid
        if (
            referrer != address(0) &&
            referrer != user &&
            referrers[user] == address(0)
        ) {
            referrers[user] = referrer;

            // Update referrer's referral count
            if (!userStats[referrer].hasReferred[user]) {
                userStats[referrer].hasReferred[user] = true;
                userStats[referrer].referralCount++;
                emit ReferralRecorded(referrer, user);
            }
        }
    }

    // ============ Staking Router Functions ============

    /**
     * @notice Record a new stake
     * @param user The user who staked
     * @param amount The amount staked
     * @param referrer The referrer address (if any)
     */
    function recordStake(
        address user,
        uint256 amount,
        address referrer
    ) external onlyStakingRouter {
        if (user == address(0)) revert ZeroAddress();
        if (amount == 0) revert InvalidAmount();

        // Record the stake
        uint256 stakeId = userStakeCount[user];
        userStakes[user][stakeId] = StakeInfo({
            amount: amount,
            startTime: block.timestamp,
            lastClaimTime: block.timestamp,
            isActive: true
        });
        userStakeCount[user]++;

        // Record referrer if first time and valid
        if (
            referrer != address(0) &&
            referrer != user &&
            referrers[user] == address(0)
        ) {
            referrers[user] = referrer;

            // Update referrer's referral count if first time
            if (!userStats[referrer].hasReferred[user]) {
                userStats[referrer].hasReferred[user] = true;
                userStats[referrer].referralCount++;
                emit ReferralRecorded(referrer, user);
            }
        }
    }

    /**
     * @notice Update stake amount (for additional stakes or unstakes)
     * @param user The user
     * @param stakeId The stake ID
     * @param newAmount The new amount
     * @param isUnstake Whether this is an unstake
     */
    function updateStake(
        address user,
        uint256 stakeId,
        uint256 newAmount,
        bool isUnstake
    ) external onlyStakingRouter {
        StakeInfo storage stake = userStakes[user][stakeId];
        if (!stake.isActive) return;

        // Claim pending stars before updating
        _claimPendingStars(user, stakeId);

        if (isUnstake) {
            stake.isActive = false;
        } else {
            stake.amount = newAmount;
        }
    }

    /**
     * @notice Claim accumulated stars for a user's stake
     * @param user The user
     * @param stakeId The stake ID
     */
    function claimStars(address user, uint256 stakeId) external {
        if (msg.sender != user && msg.sender != stakingRouter)
            revert Unauthorized();
        _claimPendingStars(user, stakeId);
    }

    /**
     * @notice Claim stars for all active stakes
     * @param user The user
     */
    function claimAllStars(address user) external {
        if (msg.sender != user && msg.sender != stakingRouter)
            revert Unauthorized();

        uint256 totalNewStars = 0;
        uint256 count = userStakeCount[user];

        for (uint256 i = 0; i < count; i++) {
            if (userStakes[user][i].isActive) {
                uint256 stars = _claimPendingStars(user, i);
                totalNewStars += stars;
            }
        }
    }

    // ============ Internal Functions ============

    function _claimPendingStars(
        address user,
        uint256 stakeId
    ) internal returns (uint256) {
        StakeInfo storage stake = userStakes[user][stakeId];
        if (!stake.isActive || stake.amount < MIN_STAKE_FOR_STAR) return 0;

        uint256 timeElapsed = block.timestamp - stake.lastClaimTime;
        if (timeElapsed == 0) return 0;

        // Calculate stars earned with fractional precision (1e18)
        uint256 stakeMultiplier = stake.amount / MIN_STAKE_FOR_STAR;
        uint256 starsEarnedScaled = (stakeMultiplier * timeElapsed * 1e18) /
            PERIOD_DURATION;

        // Convert to whole stars (divide by 1e18)
        uint256 starsEarned = starsEarnedScaled / 1e18;

        if (starsEarned > 0) {
            // Update user stats
            userStats[user].stakingStars += starsEarned;
            userStats[user].totalStars += starsEarned;
            userStats[user].lastUpdateTime = block.timestamp;

            // Update stake claim time
            stake.lastClaimTime = block.timestamp;

            emit StarsEarned(user, starsEarned, "staking");
            emit StarsUpdated(
                user,
                userStats[user].totalStars,
                userStats[user].stakingStars,
                userStats[user].referralStars
            );

            // Award referral stars to referrer
            address referrer = referrers[user];
            if (referrer != address(0)) {
                _awardReferralStars(referrer, starsEarned);
            }
        }

        return starsEarned;
    }

    function _awardReferralStars(address referrer, uint256 amount) internal {
        userStats[referrer].referralStars += amount;
        userStats[referrer].totalStars += amount;
        userStats[referrer].lastUpdateTime = block.timestamp;

        emit StarsEarned(referrer, amount, "referral");
        emit StarsUpdated(
            referrer,
            userStats[referrer].totalStars,
            userStats[referrer].stakingStars,
            userStats[referrer].referralStars
        );
    }

    // ============ View Functions ============

    /**
     * @notice Get user's total stats
     * @param user The user address
     */
    function getUserStats(
        address user
    )
        external
        view
        returns (
            uint256 totalStars,
            uint256 stakingStars,
            uint256 referralStars,
            uint256 referralCount,
            uint256 lastUpdateTime
        )
    {
        UserStats storage stats = userStats[user];
        return (
            stats.totalStars,
            stats.stakingStars,
            stats.referralStars,
            stats.referralCount,
            stats.lastUpdateTime
        );
    }

    /**
     * @notice Calculate pending stars for a stake (real-time, with decimals)
     * @param user The user
     * @param stakeId The stake ID
     * @return Pending stars scaled by 1e18 for fractional stars
     */
    function getPendingStars(
        address user,
        uint256 stakeId
    ) external view returns (uint256) {
        StakeInfo storage stake = userStakes[user][stakeId];
        if (!stake.isActive || stake.amount < MIN_STAKE_FOR_STAR) return 0;

        uint256 timeElapsed = block.timestamp - stake.lastClaimTime;
        if (timeElapsed == 0) return 0;

        // Calculate fractional stars: (amount / 0.0001 BNB) * (timeElapsed / 24 hours)
        // Scaled by 1e18 to preserve decimals
        uint256 stakeMultiplier = stake.amount / MIN_STAKE_FOR_STAR;
        uint256 starsEarned = (stakeMultiplier * timeElapsed * 1e18) /
            PERIOD_DURATION;
        return starsEarned;
    }

    /**
     * @notice Get total pending stars for all active stakes (real-time)
     * @param user The user
     * @return Total pending stars scaled by 1e18
     */
    function getTotalPendingStars(
        address user
    ) external view returns (uint256) {
        uint256 totalPending = 0;
        uint256 count = userStakeCount[user];

        for (uint256 i = 0; i < count; i++) {
            StakeInfo storage stake = userStakes[user][i];
            if (!stake.isActive || stake.amount < MIN_STAKE_FOR_STAR) continue;

            uint256 timeElapsed = block.timestamp - stake.lastClaimTime;
            if (timeElapsed > 0) {
                // Calculate fractional stars with 1e18 precision
                uint256 stakeMultiplier = stake.amount / MIN_STAKE_FOR_STAR;
                uint256 starsEarned = (stakeMultiplier * timeElapsed * 1e18) /
                    PERIOD_DURATION;
                totalPending += starsEarned;
            }
        }

        return totalPending;
    }

    /**
     * @notice Get user's stake info
     * @param user The user
     * @param stakeId The stake ID
     * @return amount Staked amount
     * @return startTime Stake start timestamp
     * @return lastClaimTime Last claim timestamp
     * @return isActive Whether stake is active
     * @return pendingStars Pending stars (scaled by 1e18)
     */
    function getStakeInfo(
        address user,
        uint256 stakeId
    )
        external
        view
        returns (
            uint256 amount,
            uint256 startTime,
            uint256 lastClaimTime,
            bool isActive,
            uint256 pendingStars
        )
    {
        StakeInfo storage stake = userStakes[user][stakeId];
        uint256 pending = 0;

        if (stake.isActive && stake.amount >= MIN_STAKE_FOR_STAR) {
            uint256 timeElapsed = block.timestamp - stake.lastClaimTime;
            if (timeElapsed > 0) {
                // Calculate fractional stars with 1e18 precision
                uint256 stakeMultiplier = stake.amount / MIN_STAKE_FOR_STAR;
                pending =
                    (stakeMultiplier * timeElapsed * 1e18) /
                    PERIOD_DURATION;
            }
        }

        return (
            stake.amount,
            stake.startTime,
            stake.lastClaimTime,
            stake.isActive,
            pending
        );
    }

    /**
     * @notice Get referrer for a user
     * @param user The user
     */
    function getReferrer(address user) external view returns (address) {
        return referrers[user];
    }

    /**
     * @notice Check if user has referred another user
     * @param referrer The referrer
     * @param referee The referee
     */
    function hasReferred(
        address referrer,
        address referee
    ) external view returns (bool) {
        return userStats[referrer].hasReferred[referee];
    }
}
