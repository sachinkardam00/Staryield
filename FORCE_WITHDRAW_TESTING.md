# Force Withdraw Testing Guide

## 🚀 What's New

**Router v3** deployed at: `0xe80b3e256098edD086b2A9f9d70e2422b2671EEE`

### New Feature: Force Withdraw

- Function: `forceWithdrawUnbonded(uint256 index)`
- Purpose: **Bypass 14-day cooldown for testing**
- ⚠️ **TESTING ONLY** - Remove in production

## 📋 How It Works

### Normal Flow (Production):

1. Stake BNB → Locked
2. Request Unstake → Starts cooldown
3. Wait 14 days → Cooldown complete
4. Withdraw Unstaked → Get BNB back

### Test Flow (Current):

1. Stake BNB → Locked
2. Request Unstake → Starts cooldown
3. **Force Withdraw (Testing)** → ✅ Instant withdrawal!

## 🎮 Testing Instructions

### Step 1: Stake in New Router

```
1. Go to http://localhost:8080/dashboard
2. Make sure you're on BSC Testnet
3. Stake some BNB (e.g., 0.01 BNB for testing)
4. Transaction confirmed ✅
```

### Step 2: Request Unstake

```
1. Click "Request Unstake" button
2. Enter amount (in shares, usually same as BNB)
3. Set deadline: 9999999999
4. Confirm transaction
5. Note: Your unbond request is queued at index 0
```

### Step 3: Force Withdraw (Instant!)

```
1. Click "Force Withdraw (Testing)" button
2. Enter index: 0 (your first unstake request)
3. Confirm transaction
4. ✅ BNB returned instantly (no 14-day wait!)
```

## 🔍 Current System State

### Contract Addresses

- **New Router v3**: `0xe80b3e256098edD086b2A9f9d70e2422b2671EEE`
- **Old Router v2**: `0xc97cd673e68419247ff4c6f3da0Ef73F1AD84030`
- **Loyalty Points v2**: `0x0f37929e8E967083a88B30bFfF3B1CFF346b7Dc2`
- **Adapter**: `0xE62fcEDfE9f31d6B07B18f4cc62d2b6652E5E39C`
- **Referral System**: `0xF07320dAE7c42C4Ab6b066C9F55B775580B08B2f`

### Your Current Stakes

1. **Old Router**: 0.1 BNB (staked earlier)

   - Cannot use force withdraw (old contract doesn't have it)
   - Must wait 14 days OR leave it staked

2. **Loyalty System**: Tracking 0.1 BNB stake
   - Stars accumulating: ~41.67 per hour
   - Real-time updates every 10 seconds
   - Check dashboard to see stars growing!

## ⚡ Quick Test Scenario

**Goal**: Test instant unstake/withdraw

1. **Stake**: 0.01 BNB in new router
2. **Wait**: 10 seconds (to see some stars accumulate)
3. **Unstake**: Request unstake for 0.01 BNB
4. **Force Withdraw**: Use force withdraw (enter index 0)
5. **Result**: 0.01 BNB back in wallet instantly! ✅

**Time**: ~2 minutes total (vs 14 days with normal cooldown)

## 📊 What to Observe

### Stars (Loyalty Points)

- **Before Stake**: 0 stars
- **After 1 hour**: ~41.67 stars (for 0.1 BNB)
- **After 24 hours**: ~1,000 stars
- **Formula**: `(amount / 0.0001) × (hours / 24) = stars`

### Withdraw Comparison

| Action          | Normal Withdraw | Force Withdraw   |
| --------------- | --------------- | ---------------- |
| Request Unstake | ✅              | ✅               |
| Cooldown Wait   | 14 days         | **0 seconds**    |
| Can Withdraw    | After cooldown  | **Immediately**  |
| Use Case        | Production      | **Testing only** |

## 🛠️ Technical Details

### Contract Changes

```solidity
// New function in StakingRouterBNB v3
function forceWithdrawUnbonded(uint256 index) external nonReentrant {
    UnbondReq storage r = unbondQueue[index];
    require(r.user == msg.sender, "Not owner");
    require(!r.claimed, "Already claimed");
    // NOTE: Skip cooldown check
    // if (block.timestamp < r.readyAt) revert CooldownNotFinished();

    r.claimed = true;
    payable(msg.sender).transfer(r.bnbAmount);
}
```

### Frontend Integration

```tsx
// New button added to dashboard
<button onClick={handleForceWithdraw}>Force Withdraw (Testing)</button>;

// Handler function
const handleForceWithdraw = async () => {
  const index = prompt("Enter unbond index:");
  await writeContractAsync({
    functionName: "forceWithdrawUnbonded",
    args: [BigInt(index)],
  });
};
```

## ⚠️ Important Notes

### For Testing

- ✅ Use force withdraw to test quickly
- ✅ No need to wait 14 days
- ✅ Perfect for rapid iteration

### For Production

- ❌ **Remove** `forceWithdrawUnbonded` function
- ✅ Keep only `withdrawUnbonded` (with cooldown)
- ✅ Protect user funds with proper cooldown

### Security Consideration

The force withdraw function **bypasses security checks**. In production:

- Users might be surprised by no cooldown
- Protocol might need cooldown for liquidity management
- Always enforce cooldown in production!

## 🎯 Next Steps

1. **Test Now**:

   - Stake 0.01 BNB
   - Test force withdraw
   - Verify instant withdrawal

2. **Observe Stars**:

   - Watch stars grow on dashboard
   - Should update every 10 seconds
   - Verify calculation accuracy

3. **Before Production**:
   - Remove `forceWithdrawUnbonded` function
   - Test normal withdraw with cooldown
   - Deploy final version without force withdraw

## 📞 Troubleshooting

### "Transaction Failed"

- Check you have enough BNB for gas
- Verify you're on BSC Testnet
- Make sure index matches your unstake request

### "Wrong Index"

- First unstake = index 0
- Second unstake = index 1
- Check unbond queue length: `router.queueLength()`

### "Already Claimed"

- You can only withdraw once per unstake request
- Request new unstake if you want to test again

### "Stars Not Showing"

- Refresh page
- Check .env.local has correct loyalty address
- Stars update every 10 seconds

## ✅ Success Criteria

You know it's working when:

- ✅ Can stake BNB in new router
- ✅ Can request unstake
- ✅ Can force withdraw **immediately** (no wait)
- ✅ BNB returns to wallet instantly
- ✅ Stars accumulate in real-time
- ✅ Dashboard shows correct balances

Ready to test! 🚀
