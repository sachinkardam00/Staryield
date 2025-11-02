// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
/// Errors
error ZeroAddress();
error NotOwner();
error NotRouter();
error AdapterNotAllowed();
error DeadlineExpired();
error InvalidAmount();
error CooldownNotFinished();
error NotRequestOwner();
error AlreadyClaimed();
error NativeTransferFailed();
error FeeTooHigh(uint256 bps);
error FeeRecipientRequired();

/// Reentrancy guard
abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;
    constructor() {
        _status = _NOT_ENTERED;
    }
    modifier nonReentrant() {
        require(_status != _ENTERED, "REENTRANCY");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

/// Ownable
contract Ownable {
    address public owner;
    event OwnershipTransferred(address indexed prev, address indexed next);
    constructor(address _owner) {
        owner = _owner == address(0) ? msg.sender : _owner;
        emit OwnershipTransferred(address(0), owner);
    }
    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

/// Pausable core
contract PausableCore {
    bool public paused;
    event Paused(address indexed by);
    event Unpaused(address indexed by);
    modifier whenNotPaused() {
        require(!paused, "PAUSED");
        _;
    }
    function _pause() internal {
        paused = true;
        emit Paused(msg.sender);
    }
    function _unpause() internal {
        paused = false;
        emit Unpaused(msg.sender);
    }
}

/// Adapter interface (router uses this)
interface IStakingAdapterBNB {
    function stake() external payable;
    function harvest() external;
    function beginUnstake(uint256 amountWei) external;
    function wireTestnetDefaults(address router_, address validator_) external;
    function setStakeHub(address stakeHub_, address validator_) external;
    function setSelectors(
        bytes4 selDelegate_,
        bytes4 selUndelegate_,
        bytes4 selClaimReward_
    ) external;
    function setSelectorsBySig(
        string calldata a,
        string calldata b,
        string calldata c
    ) external;
    function setRouter(address router_) external;
}

/// Loyalty Points interface
interface ILoyaltyPoints {
    function recordStake(
        address user,
        uint256 amount,
        address referrer
    ) external;
    function updateStake(
        address user,
        uint256 stakeId,
        uint256 newAmount,
        bool isUnstake
    ) external;
}

/// Router (user entrypoint)
contract StakingRouterBNB is Ownable, PausableCore, ReentrancyGuard {
    // Adapter allowlist and selection
    address public adapter;
    mapping(address => bool) public allowedAdapter;

    // Loyalty Points integration
    ILoyaltyPoints public loyaltyPoints;
    mapping(address => uint256) public userStakeIds; // Track stake IDs for loyalty
    mapping(address => address) public userReferrers; // Track referrers

    // Rewards fee (rewards only; not principal)
    uint256 public feeBps; // out of 10_000
    address public feeRecipient;
    uint256 public constant MAX_FEE_BPS = 1000; // 10%

    // Shares and rewards accounting
    mapping(address => uint256) public sharesOf;
    uint256 public totalShares;

    uint256 public accRewardPerShare; // scaled by 1e18
    mapping(address => uint256) public rewardDebt;

    // Principal under management (excludes unharvested rewards)
    uint256 public totalPrincipal;

    // Unbonding queue
    struct UnbondReq {
        address user;
        uint256 shares;
        uint256 bnbAmount;
        uint256 readyAt;
        bool claimed;
    }
    UnbondReq[] public unbondQueue;
    uint256 public unbondingPeriod; // seconds

    // Events
    event AdapterAllowed(address indexed adapter, bool allowed);
    event AdapterSet(address indexed adapter);
    event FeeParamsUpdated(address indexed recipient, uint256 bps);
    event UnbondingPeriodUpdated(uint256 secondsPeriod);

    event Deposited(
        address indexed user,
        uint256 bnbStaked,
        uint256 sharesMinted
    );
    event Harvest(uint256 rewards, uint256 feeTaken);
    event Claimed(address indexed user, uint256 amount);
    event UnstakeRequested(
        address indexed user,
        uint256 shares,
        uint256 amountBNB,
        uint256 readyAt,
        uint256 index
    );
    event UnbondWithdrawn(
        address indexed user,
        uint256 index,
        uint256 amountBNB
    );

    constructor(address _owner, uint256 _unbondingPeriod) Ownable(_owner) {
        unbondingPeriod = _unbondingPeriod;
        emit UnbondingPeriodUpdated(_unbondingPeriod);
    }

    // Admin
    function pause() external onlyOwner {
        _pause();
    }
    function unpause() external onlyOwner {
        _unpause();
    }

    function allowAdapter(address a, bool allowed) external onlyOwner {
        if (a == address(0)) revert ZeroAddress();
        allowedAdapter[a] = allowed;
        emit AdapterAllowed(a, allowed);
    }

    function setAdapter(address a) external onlyOwner {
        if (!allowedAdapter[a]) revert AdapterNotAllowed();
        adapter = a;
        emit AdapterSet(a);
    }

    function setFeeParams(
        address _recipient,
        uint256 _feeBps
    ) external onlyOwner {
        if (_feeBps > MAX_FEE_BPS) revert FeeTooHigh(_feeBps);
        if (_feeBps > 0 && _recipient == address(0))
            revert FeeRecipientRequired();
        feeRecipient = _recipient;
        feeBps = _feeBps;
        emit FeeParamsUpdated(_recipient, _feeBps);
    }

    function setUnbondingPeriod(uint256 secondsPeriod) external onlyOwner {
        unbondingPeriod = secondsPeriod;
        emit UnbondingPeriodUpdated(secondsPeriod);
    }

    function setLoyaltyPoints(address _loyaltyPoints) external onlyOwner {
        loyaltyPoints = ILoyaltyPoints(_loyaltyPoints);
    }

    function setReferrer(address user, address referrer) external onlyOwner {
        if (userReferrers[user] == address(0)) {
            userReferrers[user] = referrer;
        }
    }

    // User deposit: send native BNB in msg.value
    function depositBNB(
        uint256 deadline
    )
        external
        payable
        whenNotPaused
        nonReentrant
        returns (uint256 sharesMinted)
    {
        if (adapter == address(0)) revert AdapterNotAllowed();
        if (block.timestamp > deadline) revert DeadlineExpired();
        if (msg.value == 0) revert InvalidAmount();

        // Shares minted against principal (rewards are tracked separately)
        sharesMinted = previewSharesFromBNB(msg.value);
        totalShares += sharesMinted;
        sharesOf[msg.sender] += sharesMinted;
        rewardDebt[msg.sender] += (sharesMinted * accRewardPerShare) / 1e18;

        // Update principal and delegate
        totalPrincipal += msg.value;
        IStakingAdapterBNB(adapter).stake{value: msg.value}();

        // Record stake in loyalty points system
        if (address(loyaltyPoints) != address(0)) {
            address referrer = userReferrers[msg.sender];
            loyaltyPoints.recordStake(msg.sender, msg.value, referrer);
            userStakeIds[msg.sender]++;
        }

        emit Deposited(msg.sender, msg.value, sharesMinted);
    }

    function previewSharesFromBNB(
        uint256 amountBNB
    ) public view returns (uint256) {
        if (totalShares == 0 || totalPrincipal == 0) return amountBNB;
        return (amountBNB * totalShares) / totalPrincipal;
    }

    function previewBNBFromShares(
        uint256 shares
    ) public view returns (uint256) {
        if (totalShares == 0) return 0;
        return (shares * totalPrincipal) / totalShares;
    }

    // Harvest rewards; adapter will atomically callback notifyRewardsReceived{value: rewards}()
    function harvest() external whenNotPaused nonReentrant {
        if (adapter == address(0)) revert AdapterNotAllowed();
        IStakingAdapterBNB(adapter).harvest();
    }

    // Adapter callback with rewards (single call with msg.value)
    // NOTE: No nonReentrant here - it's called within harvest()'s nonReentrant context
    function notifyRewardsReceived() external payable {
        if (msg.sender != adapter) revert NotRouter();
        uint256 rewards = msg.value;
        if (rewards == 0) return;

        // Take protocol fee first
        uint256 fee;
        if (feeBps != 0 && feeRecipient != address(0)) {
            fee = (rewards * feeBps) / 10_000;
            if (fee != 0) {
                (bool okF, ) = payable(feeRecipient).call{value: fee}("");
                if (!okF) revert NativeTransferFailed();
                rewards -= fee;
            }
        }

        // Distribute to holders
        if (rewards > 0 && totalShares > 0) {
            accRewardPerShare += (rewards * 1e18) / totalShares;
        }

        emit Harvest(rewards, fee);
    }

    // User claims accrued BNB rewards
    function claim()
        external
        whenNotPaused
        nonReentrant
        returns (uint256 amount)
    {
        amount = pendingRewards(msg.sender);
        if (amount == 0) return 0;
        rewardDebt[msg.sender] =
            (sharesOf[msg.sender] * accRewardPerShare) /
            1e18;
        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        if (!ok) revert NativeTransferFailed();
        emit Claimed(msg.sender, amount);
    }

    function pendingRewards(address user) public view returns (uint256) {
        uint256 accumulated = (sharesOf[user] * accRewardPerShare) / 1e18;
        if (accumulated < rewardDebt[user]) return 0;
        return accumulated - rewardDebt[user];
    }

    // Request unstake: burns shares, begins undelegation via adapter, queues withdrawal
    function requestUnstake(
        uint256 shares,
        uint256 deadline
    ) external whenNotPaused nonReentrant returns (uint256 index) {
        if (adapter == address(0)) revert AdapterNotAllowed();
        if (block.timestamp > deadline) revert DeadlineExpired();
        if (shares == 0 || shares > sharesOf[msg.sender])
            revert InvalidAmount();

        // Compute principal amount corresponding to shares
        uint256 amountBNB = previewBNBFromShares(shares);

        // Burn shares and update reward debt to current accrual for remaining shares
        sharesOf[msg.sender] -= shares;
        totalShares -= shares;
        rewardDebt[msg.sender] =
            (sharesOf[msg.sender] * accRewardPerShare) /
            1e18;

        // Reduce principal now (reserved for this request)
        totalPrincipal -= amountBNB;

        // Kick off undelegation; principal will return later
        IStakingAdapterBNB(adapter).beginUnstake(amountBNB);

        uint256 readyAt = block.timestamp + unbondingPeriod;
        unbondQueue.push(
            UnbondReq({
                user: msg.sender,
                shares: shares,
                bnbAmount: amountBNB,
                readyAt: readyAt,
                claimed: false
            })
        );
        index = unbondQueue.length - 1;

        emit UnstakeRequested(msg.sender, shares, amountBNB, readyAt, index);
    }

    // Adapter callback when principal returns (single call with msg.value)
    // NOTE: No nonReentrant here - it's called within requestUnstake()'s nonReentrant context
    function notifyUnstakeReturned() external payable {
        if (msg.sender != adapter) revert NotRouter();
        // No state to update here; funds increase router balance and will satisfy queued withdrawals.
    }

    // User withdraws after cooldown (requires returned liquidity present)
    function withdrawUnbonded(uint256 index) external nonReentrant {
        if (index >= unbondQueue.length) revert InvalidAmount();
        UnbondReq storage r = unbondQueue[index];
        if (r.user != msg.sender) revert NotRequestOwner();
        if (r.claimed) revert AlreadyClaimed();
        if (block.timestamp < r.readyAt) revert CooldownNotFinished();

        r.claimed = true;
        (bool ok, ) = payable(msg.sender).call{value: r.bnbAmount}("");
        if (!ok) revert NativeTransferFailed();

        emit UnbondWithdrawn(msg.sender, index, r.bnbAmount);
    }

    /// @notice Force withdraw without cooldown (TESTING ONLY - removes in production)
    /// @dev Allows instant withdrawal bypassing cooldown period
    /// @param index The unbond request index
    function forceWithdrawUnbonded(uint256 index) external nonReentrant {
        if (index >= unbondQueue.length) revert InvalidAmount();
        UnbondReq storage r = unbondQueue[index];
        if (r.user != msg.sender) revert NotRequestOwner();
        if (r.claimed) revert AlreadyClaimed();
        // NOTE: Skip cooldown check for testing
        // if (block.timestamp < r.readyAt) revert CooldownNotFinished();

        r.claimed = true;
        (bool ok, ) = payable(msg.sender).call{value: r.bnbAmount}("");
        if (!ok) revert NativeTransferFailed();

        emit UnbondWithdrawn(msg.sender, index, r.bnbAmount);
    }

    // Public view
    function queueLength() external view returns (uint256) {
        return unbondQueue.length;
    }

    /// @notice Emergency withdraw excess BNB (owner only)
    /// @dev Only withdraw excess BNB that is not allocated to users
    function emergencyWithdrawBNB(
        uint256 amount
    ) external onlyOwner nonReentrant {
        require(address(this).balance >= amount, "INSUFFICIENT_BALANCE");
        (bool ok, ) = payable(owner).call{value: amount}("");
        if (!ok) revert NativeTransferFailed();
    }

    // Accept BNB (rewards or undelegations)
    receive() external payable {}
}

/// Adapter that talks to StakeHub using configurable function selectors.
contract StakingAdapterBNB is
    Ownable,
    PausableCore,
    ReentrancyGuard,
    IStakingAdapterBNB
{
    address public router; // authorized router
    address public stakeHub; // StakeHub contract
    address public validator; // validator to delegate to

    // Function selectors (ABI-flexible)
    bytes4 public selDelegate; // delegate(address)
    bytes4 public selUndelegate; // undelegate(address,uint256)
    bytes4 public selClaimReward; // claimReward(address)

    event RouterSet(address indexed router);
    event StakeHubSet(address indexed hub, address indexed validator);
    event SelectorsSet(
        bytes4 delegateSel,
        bytes4 undelegateSel,
        bytes4 claimSel
    );

    modifier onlyRouter() {
        if (msg.sender != router) revert NotRouter();
        _;
    }

    constructor(address _owner) Ownable(_owner) {}

    function setRouter(address router_) public onlyOwner {
        if (router_ == address(0)) revert ZeroAddress();
        router = router_;
        emit RouterSet(router_);
    }

    function pause() external onlyOwner {
        _pause();
    }
    function unpause() external onlyOwner {
        _unpause();
    }

    function setStakeHub(
        address stakeHub_,
        address validator_
    ) public onlyOwner {
        if (stakeHub_ == address(0) || validator_ == address(0))
            revert ZeroAddress();
        stakeHub = stakeHub_;
        validator = validator_;
        emit StakeHubSet(stakeHub_, validator_);
    }

    function setSelectors(
        bytes4 selDelegate_,
        bytes4 selUndelegate_,
        bytes4 selClaimReward_
    ) public onlyOwner {
        selDelegate = selDelegate_;
        selUndelegate = selUndelegate_;
        selClaimReward = selClaimReward_;
        emit SelectorsSet(selDelegate_, selUndelegate_, selClaimReward_);
    }

    // Convenience: configurable by signature strings from Remix
    function setSelectorsBySig(
        string calldata a,
        string calldata b,
        string calldata c
    ) external onlyOwner {
        setSelectors(
            bytes4(keccak256(bytes(a))),
            bytes4(keccak256(bytes(b))),
            bytes4(keccak256(bytes(c)))
        );
    }

    // Convenience: wire testnet defaults (VERIFY stakeHub address on BscScan Testnet!)
    function wireTestnetDefaults(
        address router_,
        address validator_
    ) external onlyOwner {
        if (router_ == address(0) || validator_ == address(0))
            revert ZeroAddress();
        setRouter(router_);
        setStakeHub(0x0000000000000000000000000000000000002002, validator_); // Verify this on BscScan Testnet
        setSelectors(
            bytes4(keccak256("delegate(address)")),
            bytes4(keccak256("undelegate(address,uint256)")),
            bytes4(keccak256("claimReward(address)"))
        );
    }

    // Router -> Adapter: stake all incoming BNB by delegating to validator
    function stake() external payable onlyRouter whenNotPaused nonReentrant {
        uint256 amount = msg.value;
        if (amount == 0) revert InvalidAmount();
        (bool ok, bytes memory ret) = stakeHub.call{value: amount}(
            abi.encodeWithSelector(selDelegate, validator)
        );
        if (!ok) _bubbleRevert(ret, "DELEGATE_CALL_FAILED");
    }

    // Router -> Adapter: claim rewards, atomically forward to router.notifyRewardsReceived{value:gained}()
    function harvest() external onlyRouter whenNotPaused nonReentrant {
        uint256 beforeBal = address(this).balance;
        (bool ok, bytes memory ret) = stakeHub.call(
            abi.encodeWithSelector(selClaimReward, validator)
        );
        if (!ok) _bubbleRevert(ret, "CLAIM_CALL_FAILED");
        uint256 gained = address(this).balance - beforeBal;
        if (gained > 0) {
            (bool ok2, ) = router.call{value: gained}(
                abi.encodeWithSignature("notifyRewardsReceived()")
            );
            require(ok2, "NOTIFY_REWARDS_FAILED");
        }
    }

    // Router -> Adapter: begin undelegation of amount; StakeHub will return BNB later
    function beginUnstake(
        uint256 amountWei
    ) external onlyRouter whenNotPaused nonReentrant {
        if (amountWei == 0) revert InvalidAmount();
        (bool ok, bytes memory ret) = stakeHub.call(
            abi.encodeWithSelector(selUndelegate, validator, amountWei)
        );
        if (!ok) _bubbleRevert(ret, "UNDELEGATE_CALL_FAILED");
    }

    // When StakeHub pushes BNB here (undelegation complete), atomically forward and notify router
    receive() external payable {
        if (router != address(0) && msg.value > 0) {
            (bool ok, ) = router.call{value: msg.value}(
                abi.encodeWithSignature("notifyUnstakeReturned()")
            );
            require(ok, "NOTIFY_UNSTAKE_FAILED");
        }
    }

    // Revert helper: bubble original revert data if present; fallback to a readable string
    function _bubbleRevert(
        bytes memory ret,
        string memory fallbackReason
    ) internal pure {
        if (ret.length > 0) {
            assembly {
                revert(add(ret, 0x20), mload(ret))
            }
        } else {
            revert(fallbackReason);
        }
    }
}
