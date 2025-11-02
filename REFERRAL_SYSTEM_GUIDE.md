# Referral System Integration Guide

## 🎯 Overview

The referral system tracks users who invite friends and rewards them with:

1. **Loyalty Points (Stars)**: Bonus stars when referred users stake
2. **Commission Rewards**: Percentage of rewards based on tier (5%-15%)

## 📋 System Architecture

### Contracts

1. **LoyaltyPoints** (`0x3DB1d7D660d8b8A86d9eBDA20078b55b920433b0`)

   - Tracks stars earned from staking and referrals
   - Awards 1 star per 0.0001 BNB staked per 24 hours
   - Bonus stars to referrers when their referrals stake

2. **ReferralSystem** (`0xF07320dAE7c42C4Ab6b066C9F55B775580B08B2f`)

   - Manages referral relationships and tiers
   - Tracks commission rates (5%, 7%, 10%, 12%, 15%)
   - Stores claimable commissions for referrers

3. **StakingRouterBNB** (`0xc97cd673e68419247ff4c6f3da0Ef73F1AD84030`)
   - Main staking contract
   - Calls `LoyaltyPoints.recordStake()` when users stake
   - ⚠️ **NEEDS UPDATE**: Must call `ReferralSystem.recordCommission()` when distributing rewards

## 🔄 How It Works (Current State)

### ✅ What's Working:

1. **Referral Registration**:

   ```
   User A → Shares link: https://yoursite.com?ref=0xUserA_Address
   User B → Visits link
   Frontend → Captures ?ref= parameter
   Frontend → Stores in localStorage
   User B → Connects wallet
   Frontend → Auto-registers: ReferralSystem.registerReferral(0xUserA_Address)
   ```

2. **Staking & Loyalty Tracking**:

   ```
   User B → Stakes 0.1 BNB
   StakingRouter → Calls LoyaltyPoints.recordStake(userB, 0.1 BNB, userA)
   LoyaltyPoints → Records:
      - Staking stars for User B
      - Referral stars for User A
      - Increments User A's referral count
   ```

3. **Frontend Display**:
   - Dashboard shows loyalty stats (Total Stars, Staking Stars, Referral Stars, Referral Count)
   - Referral page shows real-time data from ReferralSystem
   - Auto-registration happens when user connects wallet

### ⚠️ What's NOT Working:

**Commission Distribution** - This is the missing piece!

Currently:

```solidity
// When User B claims rewards
function claim() external {
    uint256 rewards = pendingRewards(msg.sender);
    // ❌ MISSING: No call to ReferralSystem.recordCommission()
    transfer rewards to User B
}
```

Should be:

```solidity
function claim() external {
    uint256 rewards = pendingRewards(msg.sender);

    // ✅ Record commission for referrer
    if (address(referralSystem) != address(0)) {
        uint256 commission = calculateCommission(msg.sender, rewards);
        if (commission > 0) {
            referralSystem.recordCommission{value: commission}(msg.sender, rewards);
            rewards -= commission; // Deduct commission
        }
    }

    transfer rewards to User B
}
```

## 🛠️ Testing Steps

### Test 1: Referral Registration

1. Open browser (User A)
2. Connect wallet with address: `0x45F3a935F36ebbe3be3da8C9c14ff95023403acd`
3. Go to Referral page
4. Copy your referral link
5. Open incognito/another browser (User B)
6. Paste referral link
7. Connect different wallet
8. **Expected**: User B should auto-register with User A as referrer
9. **Verify**: Check ReferralSystem contract:
   ```javascript
   await referralSystem.users(userB_address);
   // Should return: { isRegistered: true, referrer: userA_address, ... }
   ```

### Test 2: Staking & Loyalty Points

1. User B stakes 0.1 BNB
2. Wait 1 hour
3. **Expected User B Dashboard**:
   - Staking Stars: ~4.17 stars (0.1/0.0001 × 1/24 = 4.17)
   - Referral Stars: 0
4. **Expected User A Dashboard**:
   - Staking Stars: (from own stakes)
   - Referral Stars: ~4.17 stars (bonus from User B's stake)
   - Referral Count: 1
5. **Verify Contract**:
   ```javascript
   await loyaltyPoints.getUserStats(userA_address);
   // referralCount should be 1
   // referralStars should be > 0
   ```

### Test 3: Commission Distribution (⚠️ Currently Broken)

1. User B waits for rewards to accumulate
2. User B claims rewards
3. **Current Behavior**:
   - User B receives full rewards
   - User A receives NO commission
4. **Expected Behavior** (after fix):
   - User B receives 95% of rewards (if User A is Starter tier)
   - User A's claimable commission increases by 5%
5. **Verify**:
   ```javascript
   await referralSystem.users(userA_address);
   // claimableCommission should increase
   ```

### Test 4: Tier Upgrades

1. User A refers 5 more users (total 6 referrals)
2. **Expected**: User A upgrades to Bronze tier (7% commission)
3. Future commissions should be calculated at 7%
4. **Verify**:
   ```javascript
   await referralSystem.users(userA_address);
   // tier should be 1 (Bronze)
   // referralCount should be 6
   ```

## 🔧 Required Fix

### Step 1: Update StakingBNB.sol

Add ReferralSystem integration:

```solidity
// Add interface
interface IReferralSystem {
    function recordCommission(address referee, uint256 rewardAmount) external payable;
    function getCommissionRate(address user) external view returns (uint256);
}

// Add state variable
IReferralSystem public referralSystem;

// Add setter
function setReferralSystem(address _referralSystem) external onlyOwner {
    referralSystem = IReferralSystem(_referralSystem);
}

// Modify claim() function
function claim() external whenNotPaused nonReentrant returns (uint256 amount) {
    amount = pendingRewards(msg.sender);
    if (amount == 0) return 0;

    // NEW: Calculate and record commission
    if (address(referralSystem) != address(0)) {
        try referralSystem.recordCommission{value: 0}(msg.sender, amount) {
            // Commission recorded successfully
            // The referral system will calculate the commission internally
        } catch {
            // Continue even if commission recording fails
        }
    }

    rewardDebt[msg.sender] = (sharesOf[msg.sender] * accRewardPerShare) / 1e18;
    (bool ok, ) = payable(msg.sender).call{value: amount}("");
    if (!ok) revert NativeTransferFailed();
    emit Claimed(msg.sender, amount);
}
```

### Step 2: Redeploy Router

```bash
cd web3
npx hardhat run scripts/deploy-router-v3.js --network bscTestnet
```

### Step 3: Configure New Router

```bash
# Update adapter
await adapter.setRouter(newRouterAddress)

# Update loyalty points
await loyaltyPoints.setStakingRouter(newRouterAddress)

# Set referral system in new router
await newRouter.setReferralSystem('0xF07320dAE7c42C4Ab6b066C9F55B775580B08B2f')

# Set loyalty points in new router
await newRouter.setLoyaltyPoints('0x3DB1d7D660d8b8A86d9eBDA20078b55b920433b0')
```

### Step 4: Update Frontend

Update `.env.local`:

```
NEXT_PUBLIC_ROUTER_ADDRESS=<new_router_v3_address>
```

### Step 5: Add Commission Claim UI

Add to referral page:

```typescript
// Read claimable commission
const { data: userData } = useReadContract({
  address: referralAddress,
  abi: ReferralSystemABI,
  functionName: "users",
  args: [address],
});

const claimableCommission = userData ? userData.claimableCommission : 0n;

// Claim button
<button
  onClick={() =>
    writeContract({
      address: referralAddress,
      abi: ReferralSystemABI,
      functionName: "claimCommission",
    })
  }
>
  Claim {formatEther(claimableCommission)} BNB Commission
</button>;
```

## 📊 Referral Tiers

| Tier     | Referrals Required | Commission Rate |
| -------- | ------------------ | --------------- |
| Starter  | 0-4                | 5%              |
| Bronze   | 5-14               | 7%              |
| Silver   | 15-29              | 10%             |
| Gold     | 30-49              | 12%             |
| Platinum | 50+                | 15%             |

## 🚀 Frontend Features

### Dashboard (`/dashboard`)

- Auto-captures `?ref=` parameter from URL
- Stores referrer address in localStorage
- Auto-registers with ReferralSystem when wallet connects
- Displays loyalty stats:
  - Total Stars (staking + referral + pending)
  - Stars from own staking
  - Stars from referrals
  - Number of referrals

### Referral Page (`/referral`)

- Shows user's referral link
- Displays current tier and commission rate
- Lists all referrals
- Shows claimable commission (once fixed)
- Claim commission button (once fixed)

## 📝 Contract Addresses (BSC Testnet)

```javascript
StakingRouter: 0xc97cd673e68419247ff4c6f3da0ef73f1ad84030;
Adapter: 0xe62fcedfe9f31d6b07b18f4cc62d2b6652e5e39c;
LoyaltyPoints: 0x3db1d7d660d8b8a86d9ebda20078b55b920433b0;
ReferralSystem: 0xf07320dae7c42c4ab6b066c9f55b775580b08b2f;
```

## ⚠️ Current Status

**Working**:

- ✅ Referral registration via URL
- ✅ Loyalty points tracking
- ✅ Referral star bonuses
- ✅ Tier progression
- ✅ Frontend displays

**Broken**:

- ❌ Commission distribution (router doesn't call recordCommission)
- ❌ Commission claiming (no commissions to claim yet)

**Next Steps**:

1. Update StakingRouter with ReferralSystem integration
2. Redeploy router v3
3. Configure all contracts
4. Add commission claim UI
5. Test full flow end-to-end

## 🎓 Example Flow (After Fix)

```
Day 1:
- User A shares: https://site.com?ref=0xUserA
- User B visits, connects wallet
- Auto-registered: User B → referred by User A

Day 2:
- User B stakes 1 BNB
- LoyaltyPoints records:
  * User B: 100 staking stars pending (1/0.0001 = 10,000 stars over 24h)
  * User A: 100 referral stars pending

Day 3:
- User B's rewards: 0.01 BNB
- User B claims
- StakingRouter calls:
  * recordCommission(UserB, 0.01 BNB)
- ReferralSystem calculates:
  * User A tier: Starter (5%)
  * Commission: 0.0005 BNB
  * User A's claimableCommission += 0.0005 BNB
- User B receives: 0.0095 BNB (95%)

Day 4:
- User A visits referral page
- Sees: "0.0005 BNB commission available"
- Clicks "Claim Commission"
- Receives: 0.0005 BNB
```

## 🐛 Troubleshooting

### "No referral rewards showing"

- Check if referee actually staked (check LoyaltyPoints.getUserStats)
- Verify referee is registered (check ReferralSystem.users)
- Wait 24 hours for stars to accumulate
- Check if router has loyalty integration (current router v2 does)

### "No commission showing"

- This is EXPECTED - commission distribution not implemented yet
- Router needs to be updated to call recordCommission()
- Follow fix steps above

### "Can't register referral"

- Clear browser localStorage
- Make sure referrer address is valid (starts with 0x)
- Check if user is already registered
- Verify ReferralSystem contract is accessible

### "Stars not updating"

- Frontend refreshes every 10 seconds
- Check if you're using the NEW router (0xc97c...)
- Verify stake was successful on-chain
- Check LoyaltyPoints contract directly

## 📞 Support

If issues persist after following this guide:

1. Check contract addresses in `.env.local`
2. Verify wallet is on BSC Testnet
3. Check browser console for errors
4. Test contracts directly with hardhat scripts
