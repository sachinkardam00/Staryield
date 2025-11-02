// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ReferralSystem
 * @notice Manages referral tiers, commissions, and rewards for StarYield
 * @dev Implements a 5-tier system with progressive commission rates
 */
contract ReferralSystem {
    // ═══════════════════════════════════════════════════════════════════════════
    // STATE VARIABLES
    // ═══════════════════════════════════════════════════════════════════════════

    address public owner;
    address public stakingRouter;

    // Tier thresholds (number of referrals needed)
    uint256 public constant TIER_STARTER = 1; // 1-10 referrals
    uint256 public constant TIER_BRONZE = 11; // 11-25 referrals
    uint256 public constant TIER_SILVER = 26; // 26-50 referrals
    uint256 public constant TIER_GOLD = 51; // 51-100 referrals
    uint256 public constant TIER_PLATINUM = 101; // 100+ referrals

    // Commission rates in basis points (1% = 100 bp)
    uint256 public constant COMMISSION_STARTER = 500; // 5%
    uint256 public constant COMMISSION_BRONZE = 700; // 7%
    uint256 public constant COMMISSION_SILVER = 1000; // 10%
    uint256 public constant COMMISSION_GOLD = 1200; // 12%
    uint256 public constant COMMISSION_PLATINUM = 1500; // 15%

    uint256 public constant BP_DIVISOR = 10000; // Basis points divisor

    // User referral data
    struct UserData {
        address referrer; // Who referred this user
        uint256 referralCount; // Total direct referrals
        uint256 totalCommission; // Lifetime commission earned
        uint256 claimableCommission; // Current claimable amount
        uint256 withdrawnCommission; // Total withdrawn
        uint256 xpPoints; // Experience points (for gamification)
        uint256 tier; // Current tier (0-4)
        bool isRegistered; // Whether user has set a referrer
    }

    mapping(address => UserData) public users;
    mapping(address => address[]) public referrals; // List of direct referrals

    // Global stats
    uint256 public totalUsers;
    uint256 public totalCommissionsPaid;
    uint256 public totalReferrals;

    // ═══════════════════════════════════════════════════════════════════════════
    // EVENTS
    // ═══════════════════════════════════════════════════════════════════════════

    event ReferralRegistered(address indexed user, address indexed referrer);
    event CommissionEarned(
        address indexed referrer,
        address indexed referee,
        uint256 amount
    );
    event CommissionClaimed(address indexed user, uint256 amount);
    event TierUpgraded(address indexed user, uint256 oldTier, uint256 newTier);
    event XPEarned(address indexed user, uint256 xpAmount);
    event StakingRouterUpdated(
        address indexed oldRouter,
        address indexed newRouter
    );

    // ═══════════════════════════════════════════════════════════════════════════
    // ERRORS
    // ═══════════════════════════════════════════════════════════════════════════

    error Unauthorized();
    error AlreadyRegistered();
    error SelfReferralNotAllowed();
    error InvalidReferrer();
    error NoCommissionToClaim();
    error TransferFailed();
    error ZeroAddress();

    // ═══════════════════════════════════════════════════════════════════════════
    // MODIFIERS
    // ═══════════════════════════════════════════════════════════════════════════

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    modifier onlyStakingRouter() {
        if (msg.sender != stakingRouter) revert Unauthorized();
        _;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CONSTRUCTOR
    // ═══════════════════════════════════════════════════════════════════════════

    constructor(address _stakingRouter) {
        if (_stakingRouter == address(0)) revert ZeroAddress();
        owner = msg.sender;
        stakingRouter = _stakingRouter;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // USER REGISTRATION
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * @notice Register user with a referrer
     * @param referrer Address of the referrer
     */
    function registerReferral(address referrer) external {
        if (users[msg.sender].isRegistered) revert AlreadyRegistered();
        if (referrer == msg.sender) revert SelfReferralNotAllowed();
        if (referrer == address(0)) revert InvalidReferrer();

        // Initialize user data
        users[msg.sender].referrer = referrer;
        users[msg.sender].isRegistered = true;

        // Update referrer's data
        users[referrer].referralCount++;
        referrals[referrer].push(msg.sender);

        // Award XP to referrer
        _awardXP(referrer, 100); // 100 XP per referral

        // Check for tier upgrade
        _updateTier(referrer);

        // Update global stats
        totalUsers++;
        totalReferrals++;

        emit ReferralRegistered(msg.sender, referrer);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // COMMISSION TRACKING (Called by Staking Router)
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * @notice Record commission when a referee earns rewards
     * @param referee Address of the user who earned rewards
     * @param rewardAmount Amount of rewards earned
     */
    function recordCommission(
        address referee,
        uint256 rewardAmount
    ) external payable onlyStakingRouter {
        address referrer = users[referee].referrer;

        // Skip if no referrer
        if (referrer == address(0) || !users[referee].isRegistered) {
            return;
        }

        // Calculate commission based on referrer's tier
        uint256 commissionRate = getCommissionRate(referrer);
        uint256 commission = (rewardAmount * commissionRate) / BP_DIVISOR;

        // Ensure we received enough BNB
        require(msg.value >= commission, "Insufficient commission sent");

        // Update referrer's commission
        users[referrer].totalCommission += commission;
        users[referrer].claimableCommission += commission;

        // Award XP based on commission amount (1 XP per 0.001 BNB)
        uint256 xpToAward = commission / 1e15; // 1 XP per 0.001 BNB
        if (xpToAward > 0) {
            _awardXP(referrer, xpToAward);
        }

        emit CommissionEarned(referrer, referee, commission);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // CLAIM COMMISSION
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * @notice Claim accumulated commissions
     */
    function claimCommission() external {
        uint256 claimable = users[msg.sender].claimableCommission;
        if (claimable == 0) revert NoCommissionToClaim();

        // Update state before transfer (CEI pattern)
        users[msg.sender].claimableCommission = 0;
        users[msg.sender].withdrawnCommission += claimable;
        totalCommissionsPaid += claimable;

        // Transfer BNB
        (bool success, ) = payable(msg.sender).call{value: claimable}("");
        if (!success) revert TransferFailed();

        emit CommissionClaimed(msg.sender, claimable);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TIER MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * @notice Update user's tier based on referral count
     * @param user Address of the user
     */
    function _updateTier(address user) internal {
        uint256 refCount = users[user].referralCount;
        uint256 oldTier = users[user].tier;
        uint256 newTier;

        if (refCount >= TIER_PLATINUM) {
            newTier = 4; // Platinum
        } else if (refCount >= TIER_GOLD) {
            newTier = 3; // Gold
        } else if (refCount >= TIER_SILVER) {
            newTier = 2; // Silver
        } else if (refCount >= TIER_BRONZE) {
            newTier = 1; // Bronze
        } else {
            newTier = 0; // Starter
        }

        if (newTier != oldTier) {
            users[user].tier = newTier;
            emit TierUpgraded(user, oldTier, newTier);
        }
    }

    /**
     * @notice Get commission rate for a user based on their tier
     * @param user Address of the user
     * @return Commission rate in basis points
     */
    function getCommissionRate(address user) public view returns (uint256) {
        uint256 tier = users[user].tier;

        if (tier == 4) return COMMISSION_PLATINUM;
        if (tier == 3) return COMMISSION_GOLD;
        if (tier == 2) return COMMISSION_SILVER;
        if (tier == 1) return COMMISSION_BRONZE;
        return COMMISSION_STARTER;
    }

    /**
     * @notice Get tier name for a user
     * @param user Address of the user
     * @return Tier name as string
     */
    function getTierName(address user) public view returns (string memory) {
        uint256 tier = users[user].tier;

        if (tier == 4) return "Platinum";
        if (tier == 3) return "Gold";
        if (tier == 2) return "Silver";
        if (tier == 1) return "Bronze";
        return "Starter";
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // XP SYSTEM
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * @notice Award XP to a user
     * @param user Address of the user
     * @param amount Amount of XP to award
     */
    function _awardXP(address user, uint256 amount) internal {
        users[user].xpPoints += amount;
        emit XPEarned(user, amount);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // VIEW FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * @notice Get complete user data
     * @param user Address of the user
     * @return User's referral data
     */
    function getUserData(address user) external view returns (UserData memory) {
        return users[user];
    }

    /**
     * @notice Get list of direct referrals for a user
     * @param user Address of the user
     * @return Array of referral addresses
     */
    function getReferrals(
        address user
    ) external view returns (address[] memory) {
        return referrals[user];
    }

    /**
     * @notice Get referral count for a user
     * @param user Address of the user
     * @return Number of direct referrals
     */
    function getReferralCount(address user) external view returns (uint256) {
        return users[user].referralCount;
    }

    /**
     * @notice Check if user is registered
     * @param user Address of the user
     * @return Boolean indicating registration status
     */
    function isRegistered(address user) external view returns (bool) {
        return users[user].isRegistered;
    }

    /**
     * @notice Get user's referrer
     * @param user Address of the user
     * @return Address of the referrer
     */
    function getReferrer(address user) external view returns (address) {
        return users[user].referrer;
    }

    /**
     * @notice Calculate next tier requirements
     * @param user Address of the user
     * @return refNeeded Number of additional referrals needed for next tier
     * @return nextTier Next tier level
     */
    function getNextTierRequirements(
        address user
    ) external view returns (uint256 refNeeded, uint256 nextTier) {
        uint256 currentTier = users[user].tier;
        uint256 refCount = users[user].referralCount;

        if (currentTier == 4) {
            return (0, 4); // Already at max tier
        }

        nextTier = currentTier + 1;
        uint256 threshold;

        if (nextTier == 1) threshold = TIER_BRONZE;
        else if (nextTier == 2) threshold = TIER_SILVER;
        else if (nextTier == 3) threshold = TIER_GOLD;
        else if (nextTier == 4) threshold = TIER_PLATINUM;

        refNeeded = threshold > refCount ? threshold - refCount : 0;
    }

    /**
     * @notice Get comprehensive stats for a user
     * @param user Address of the user
     * @return referralCount Total referrals
     * @return tier Current tier (0-4)
     * @return tierName Name of current tier
     * @return commissionRate Current commission rate in basis points
     * @return totalEarned Total commission earned (lifetime)
     * @return claimable Claimable commission amount
     * @return withdrawn Total withdrawn commission
     * @return xpPoints Total XP points
     */
    function getUserStats(
        address user
    )
        external
        view
        returns (
            uint256 referralCount,
            uint256 tier,
            string memory tierName,
            uint256 commissionRate,
            uint256 totalEarned,
            uint256 claimable,
            uint256 withdrawn,
            uint256 xpPoints
        )
    {
        UserData memory userData = users[user];
        return (
            userData.referralCount,
            userData.tier,
            getTierName(user),
            getCommissionRate(user),
            userData.totalCommission,
            userData.claimableCommission,
            userData.withdrawnCommission,
            userData.xpPoints
        );
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // ADMIN FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * @notice Update staking router address
     * @param newRouter New staking router address
     */
    function setStakingRouter(address newRouter) external onlyOwner {
        if (newRouter == address(0)) revert ZeroAddress();
        address oldRouter = stakingRouter;
        stakingRouter = newRouter;
        emit StakingRouterUpdated(oldRouter, newRouter);
    }

    /**
     * @notice Transfer ownership
     * @param newOwner New owner address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        owner = newOwner;
    }

    /**
     * @notice Emergency withdraw (owner only)
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        (bool success, ) = payable(owner).call{value: amount}("");
        if (!success) revert TransferFailed();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // RECEIVE FUNCTION
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * @notice Accept BNB deposits for commission pool
     */
    receive() external payable {}
}
