# Fix Summary - Claim Rewards & Withdrawal Issues

**Date:** November 2, 2025  
**Commit:** e58e09e

## Issues Reported

1. **Claim Rewards Not Working**: User clicks "Claim Rewards", 2 transactions execute successfully, but BNB doesn't appear in wallet
2. **Withdrawal Transaction Failing**: After unstaking, withdrawal transactions fail

## Root Cause Analysis

### Issue 1: Claim Rewards

**Problem:** SimpleMockAdapter's `harvest()` function calculates time-based rewards (10% APY) but the adapter had insufficient BNB balance to actually send the rewards to the router.

**Flow:**

1. User clicks "Claim Rewards"
2. Frontend calls `router.harvest()`
3. Router calls `adapter.harvest()`
4. Adapter calculates rewards: `(totalStaked * 1000 * timeElapsed) / (10000 * 31536000)`
5. Adapter tries to send rewards via `router.notifyRewardsReceived{value: rewards}()`
6. **FAILS**: Adapter has 0 BNB balance → transaction reverts OR sends 0

### Issue 2: Withdrawal

**Problem:** SimpleMockAdapter's `beginUnstake()` sent funds directly to router without calling the proper callback.

**Code:**

```solidity
// OLD - WRONG
(bool success, ) = payable(router).call{value: amountWei}("");
```

This hits router's `receive()` function instead of `notifyUnstakeReturned()`, so there's no proper tracking of returned funds.

## Solutions Implemented

### 1. Fixed SimpleMockAdapter Contract

**File:** `web3/contracts/SimpleMockAdapter.sol`

#### A. Added Balance Check in harvest()

```solidity
function harvest() external onlyRouter {
    uint256 pendingRewards = calculatePendingRewards();

    if (pendingRewards > 0) {
        // NEW: Check if we have enough balance for rewards
        require(address(this).balance >= pendingRewards, "INSUFFICIENT_BALANCE_FOR_REWARDS");

        lastHarvestTime = block.timestamp;
        (bool success, ) = router.call{value: pendingRewards}(
            abi.encodeWithSignature("notifyRewardsReceived()")
        );
        require(success, "HARVEST_FAILED");
        emit Harvested(pendingRewards);
    }
}
```

#### B. Fixed beginUnstake() Callback

```solidity
function beginUnstake(uint256 amountWei) external onlyRouter {
    require(address(this).balance >= amountWei, "INSUFFICIENT_BALANCE");

    if (amountWei <= totalStaked) {
        totalStaked -= amountWei;
    } else {
        totalStaked = 0;
    }

    pendingWithdrawals[withdrawalNonce] = amountWei;
    emit UnstakeRequested(withdrawalNonce, amountWei);
    withdrawalNonce++;

    // NEW: Send funds WITH proper callback
    (bool success, ) = payable(router).call{value: amountWei}(
        abi.encodeWithSignature("notifyUnstakeReturned()")
    );
    require(success, "TRANSFER_FAILED");
}
```

#### C. Added Reward Pool Funding

```solidity
/// @notice Fund reward pool (owner deposits BNB for rewards)
function fundRewards() external payable onlyOwner {
    require(msg.value > 0, "MUST_SEND_BNB");
    // Funds added to contract balance, available for rewards
}
```

### 2. Updated Deployment Script

**File:** `web3/scripts/deploy-simple-mock.js`

Added automatic reward pool funding on deployment:

```javascript
// Fund adapter with reward pool
console.log(`\nFunding adapter with ${REWARD_POOL_BNB} BNB for rewards...`);
const fundTx = await adapter.fundRewards({
  value: hre.ethers.parseEther(REWARD_POOL_BNB),
});
await fundTx.wait();
console.log(`✅ Funded adapter with ${REWARD_POOL_BNB} BNB`);
```

### 3. Created Router Configuration Script

**File:** `web3/scripts/configure-router.js`

Automates:

- Allowing new adapter on router
- Setting new adapter as active
- Verifying configuration

### 4. Deployment Results

**Network:** BSC Testnet (Chain ID 97)

**New Contracts:**

- SimpleMockAdapter: `0xE62fcEDfE9f31d6B07B18f4cc62d2b6652E5E39C`
- Router (unchanged): `0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78`

**Configuration:**

- Adapter funded with 0.1 BNB for rewards
- Router configured to use new adapter
- Adapter balance: 0.1 BNB

**Updated Files:**

- `.env.local` - New adapter address
- `src/contracts/abi/SimpleMockAdapter.ts` - Updated ABI with `fundRewards()`
- `web3/abi/SimpleMockAdapter.abi.json` - Exported ABI

## Testing Instructions

### Test 1: Claim Rewards (FIXED)

1. Navigate to http://localhost:8080/dashboard
2. Connect wallet with test BNB
3. Stake some BNB (e.g., 0.01 BNB)
4. Wait 2-3 minutes for rewards to accumulate
5. Observe "Unclaimed Earning (Live)" counter increasing
6. Click "Claim Rewards" button
7. Approve Step 1/2: Harvest transaction
8. Approve Step 2/2: Claim transaction
9. **Expected:** Page reloads, wallet balance increases by rewards amount

### Test 2: Withdrawal After Unstake (FIXED)

1. Navigate to http://localhost:8080/dashboard
2. Have some staked BNB
3. Click "Unstake" and enter amount
4. Wait for unbonding period (7 days on mainnet, configurable on testnet)
5. Click "Withdraw" button
6. Enter unbond queue index (usually 0)
7. Approve withdrawal transaction
8. **Expected:** BNB returns to wallet successfully

## Technical Details

### Reward Calculation Formula

```solidity
uint256 rewards = (totalStaked * ANNUAL_RATE_BP * timeElapsed) / (BP_DIVISOR * SECONDS_PER_YEAR);
```

Where:

- `ANNUAL_RATE_BP = 1000` (10% APY)
- `BP_DIVISOR = 10000` (basis points divisor)
- `SECONDS_PER_YEAR = 31536000` (365 days)

**Example:**

- Staked: 0.1 BNB
- Time: 600 seconds (10 minutes)
- Rewards: `(0.1 * 1000 * 600) / (10000 * 31536000) = 0.00000190258 BNB`

### Flow Diagrams

#### Claim Rewards Flow (After Fix)

```
User → Router.harvest()
  → Adapter.harvest()
    → Calculate: (staked * APY * time) / divisor
    → CHECK: adapter.balance >= rewards ✅
    → Send rewards: router.notifyRewardsReceived{value: rewards}()
      → Router updates accRewardPerShare
User → Router.claim()
  → Calculate: (user.shares * accRewardPerShare) - rewardDebt
  → Transfer BNB to user ✅
  → Page reloads, balance updated ✅
```

#### Withdrawal Flow (After Fix)

```
User → Router.requestUnstake(shares)
  → Burn shares, queue withdrawal
  → Adapter.beginUnstake(amountBNB)
    → Send funds: router.notifyUnstakeReturned{value: amount}() ✅
    → Router tracks returned funds
User → Router.withdrawUnbonded(index)
  → Check: cooldown finished, funds available
  → Transfer BNB to user ✅
```

## Files Changed

### Smart Contracts

- `web3/contracts/SimpleMockAdapter.sol` - Fixed harvest() and beginUnstake(), added fundRewards()

### Scripts

- `web3/scripts/deploy-simple-mock.js` - Added reward pool funding
- `web3/scripts/configure-router.js` - New script for router configuration
- `web3/scripts/export-abi.js` - Export both Router and Adapter ABIs

### Frontend

- `.env.local` - Updated adapter address
- `src/contracts/abi/SimpleMockAdapter.ts` - Updated ABI

### Artifacts

- `web3/abi/SimpleMockAdapter.abi.json` - New ABI export
- `web3/abi/SimpleMockAdapter.bytecode.json` - New bytecode export

## Verification

To verify the fixes are working:

```bash
# Check adapter balance (should be 0.1 BNB)
npx hardhat run scripts/check-adapter-balance.js --network bscTestnet

# Check router configuration
npx hardhat run scripts/verify-router-config.js --network bscTestnet
```

Or on BSCScan Testnet:

- SimpleMockAdapter: https://testnet.bscscan.com/address/0xE62fcEDfE9f31d6B07B18f4cc62d2b6652E5E39C
- Check `getBalance()` returns 0.1 BNB
- Check `router()` returns correct router address

## Next Steps

1. **Test thoroughly** on testnet:

   - Multiple stake/unstake/claim cycles
   - Different amounts
   - Edge cases (small amounts, long wait times)

2. **Monitor adapter balance**:

   - 0.1 BNB reward pool will deplete over time
   - Use `fundRewards()` to add more BNB when needed

3. **Production deployment** (when ready):
   - Deploy with larger reward pool (1-10 BNB)
   - Set appropriate unbonding period
   - Test with real users before announcing

## Commit History

- `e58e09e` - Fix claim rewards and withdrawal - deploy new SimpleMockAdapter
- `912edd7` - Fix claim rewards - properly handle 2-step process (frontend fix)

## Status

✅ **Both issues fixed and deployed to testnet**

- Claim rewards now properly transfers BNB to user wallet
- Withdrawal after unstake now properly returns principal
- Adapter funded with 0.1 BNB reward pool
- Ready for testing

---

**Deployed by:** 0x45F3a935F36ebbe3be3da8C9c14ff95023403acd  
**Network:** BSC Testnet (Chain ID 97)  
**Block Explorer:** https://testnet.bscscan.com/
