# 🎬 StarYield Finance - Live Demo Guide

<div align="center">

![StarYield](https://img.shields.io/badge/StarYield-Live%20Demo-blue?style=for-the-badge)
[![BSC Testnet](https://img.shields.io/badge/BSC-Testnet-yellow?style=for-the-badge)](https://testnet.bscscan.com/)

**Experience the Future of DeFi Staking**

</div>

---

## 🚀 Quick Demo Access

### Option 1: Try Live Demo (Recommended)

Visit: **[https://staryield.finance](https://staryield.finance)** 🌟

### Option 2: Run Locally

```bash
git clone https://github.com/Iglxkardam/Staryield.git
cd Staryield/arbstake
npm install
npm run dev
# Visit http://localhost:8080
```

---

## 🎯 Complete Demo Walkthrough

### Step 1: Setup Your Wallet 🔐

#### 1.1 Install MetaMask
- Download from [metamask.io](https://metamask.io)
- Create or import wallet
- Save your seed phrase securely

#### 1.2 Add BSC Testnet
**Method A: Automatic (Easy)**
- Visit app, click "Connect Wallet"
- Click "Switch to BSC Testnet" when prompted
- Approve in MetaMask

**Method B: Manual**
```
Network Name: BSC Testnet
RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545/
Chain ID: 97
Symbol: BNB
Explorer: https://testnet.bscscan.com
```

#### 1.3 Get Test BNB
1. Visit [BSC Testnet Faucet](https://testnet.binance.org/faucet-smart)
2. Enter your wallet address: `0xYourAddress`
3. Click "Give me BNB"
4. Wait ~10 seconds
5. Check balance in MetaMask (should show ~0.5 BNB)

---

### Step 2: Connect to StarYield 🌐

#### 2.1 Navigate to Homepage
```
http://localhost:8080  (local)
or
https://staryield.finance  (live)
```

**What You'll See:**
- 🌌 Beautiful space-themed landing page
- 🤖 AI robot mascot
- 🚀 "BEGIN STAKING" button
- 📊 Current APY display: **128.3%**
- ⭐ Navigation: STAKE, AFFILIATE, HISTORY, REFERRAL BANNERS, DOCUMENTATION

#### 2.2 Connect Wallet
1. Click **"Connect Wallet"** (top right)
2. Select **MetaMask** from the modal
3. Click **"Connect"** in MetaMask popup
4. Wait for green checkmark ✅
5. Your address appears: `0x45F3...3acd`

#### 2.3 Switch to Dashboard
- Click **"BEGIN STAKING"** button
- Or navigate to **"STAKE"** in menu
- Redirects to `/dashboard`

---

### Step 3: Explore Dashboard 📊

#### 3.1 Dashboard Overview

**Overall Portfolio Section:**
```
╔════════════════════════════════════════════╗
║        OVERALL PORTFOLIO                   ║
║  ✅ VERIFIED CONTRACT  💬 SUPPORT          ║
╠════════════════════════════════════════════╣
║  Total Staked     | Total Earned           ║
║  BNB 0.7000       | BNB 0                  ║
║                                            ║
║  Active Staking   | Withdrawn Earning      ║
║  BNB 0.7000       | BNB 0                  ║
╚════════════════════════════════════════════╝
```

**Unclaimed Earning (Live) Panel:**
```
╔════════════════════════════════════════════╗
║    🪙 BNB Logo                             ║
║                                            ║
║    Unclaimed Earning (Live)                ║
║    BNB 0.0000052664                        ║
║                                            ║
║    Growing at 10% APY (updates every 5s)   ║
║                                            ║
║    [💰 CLAIM REWARDS]                      ║
║    [📥 REQUEST UNSTAKE]                    ║
║    [💸 WITHDRAW UNSTAKED]                  ║
╚════════════════════════════════════════════╝
```

**Loyalty Points:**
```
╔══════════════════════════════╗
║  LOYALTY POINTS (STARS)      ║
║                              ║
║  ⭐ Total Stars: 14,120      ║
║  🎯 By Staking: 5000         ║
║  👥 Friends Staking: 8000    ║
║  🔗 Referrals: 1000          ║
╚══════════════════════════════╝
```

---

### Step 4: Stake Your First BNB 💰

#### 4.1 Navigate to Staking Tier

**Comet Tier Panel:**
```
╔════════════════════════════════════════════╗
║  1  Comet Tier                             ║
║                                            ║
║     You Staked: 0.7000 BNB                ║
║     APY/APR: 6% / 5.51%                   ║
║     Locked Period: 14 Days                 ║
║     Min Investment: 0.1 BNB                ║
║     Daily: 0.02%                          ║
║                                            ║
║  🪙 BNB  Balance: 0.1818 tBNB             ║
║  ⚠️ Minimum: 0.1 BNB                      ║
║                                            ║
║  [     0.1      ]  Max                    ║
║                                            ║
║  [   APPROVE   ]  [    STAKE    ]         ║
╚════════════════════════════════════════════╝
```

#### 4.2 Enter Stake Amount
1. Click in the **input box**
2. Type amount: `0.1` (minimum)
3. Or type `1` for larger stake
4. Or click **"Max"** to stake all available BNB

#### 4.3 Approve Token Spending
1. Click **"APPROVE"** button
2. MetaMask popup appears:
   ```
   Allow StarYield to spend your BNB?
   
   Spending Cap: Unlimited
   Gas Fee: ~0.0005 BNB
   
   [Reject]  [Confirm]
   ```
3. Click **"Confirm"**
4. Wait for transaction (~3 seconds)
5. ✅ Green notification: "Approval successful!"

#### 4.4 Stake BNB
1. Click **"STAKE"** button (now enabled)
2. MetaMask popup appears:
   ```
   Confirm Transaction
   
   To: StakingRouterBNB
   Amount: 0.1 BNB
   Gas Fee: ~0.001 BNB
   
   [Reject]  [Confirm]
   ```
3. Click **"Confirm"**
4. Wait for transaction (~3 seconds)
5. 🎉 Success notification: "Staking successful!"

#### 4.5 Verify Staking
**Portfolio Updates Automatically:**
```
Total Staked: BNB 0.1
Active Staking: BNB 0.1
Unclaimed Earning: BNB 0.0000000000 (starting to grow!)
```

---

### Step 5: Watch Rewards Grow 📈

#### 5.1 Real-time Reward Display

Every **5 seconds**, the dashboard auto-updates:

```
🕐 00:00:05  →  BNB 0.0000000158
🕐 00:00:10  →  BNB 0.0000000317
🕐 00:00:15  →  BNB 0.0000000475
🕐 00:00:20  →  BNB 0.0000000633
```

**After 1 Day:**
```
Unclaimed Earning: BNB 0.000273973
(≈ $0.08 at $300/BNB)
```

**After 1 Year:**
```
Unclaimed Earning: BNB 0.1000
(Your 10% APY!)
```

#### 5.2 Reward Calculation Formula

```
Rewards = StakedAmount × APY × (TimeElapsed / SecondsPerYear)

Example with 0.1 BNB staked:
────────────────────────────────
After 1 minute:
  = 0.1 × 0.10 × (60 / 31,536,000)
  = 0.00000001903 BNB

After 1 hour:
  = 0.1 × 0.10 × (3,600 / 31,536,000)
  = 0.00000114155 BNB

After 1 day:
  = 0.1 × 0.10 × (86,400 / 31,536,000)
  = 0.000273973 BNB

After 1 year:
  = 0.1 × 0.10 × (31,536,000 / 31,536,000)
  = 0.1 BNB (exactly 10% APY!)
```

---

### Step 6: Claim Your Rewards 💎

#### 6.1 When to Claim
Wait until rewards accumulate (recommended: > 0.001 BNB to cover gas)

#### 6.2 Click "Claim Rewards"
1. Click **"💰 CLAIM REWARDS"** button
2. **Transaction 1: Harvest**
   ```
   Harvesting rewards from adapter...
   
   To: SimpleMockAdapter
   Function: harvest()
   Gas: ~0.0005 BNB
   
   [Confirm]
   ```
3. Wait for confirmation (~3 seconds)
4. **Transaction 2: Claim**
   ```
   Claiming rewards to wallet...
   
   To: StakingRouterBNB
   Function: claim()
   Gas: ~0.0005 BNB
   
   [Confirm]
   ```
5. Wait for confirmation (~3 seconds)
6. ✅ Rewards in your wallet!

#### 6.3 Check Balance
Open MetaMask:
```
Balance: 0.4819 BNB  →  0.4827 BNB
         (+0.0008 BNB rewards!)
```

---

### Step 7: Unstake Funds 💸

#### 7.1 Request Unstake
1. Click **"📥 REQUEST UNSTAKE"** button
2. Popup appears:
   ```
   ┌─────────────────────────────────┐
   │  How much BNB to unstake?       │
   │                                 │
   │  Enter amount (e.g. 0.05)       │
   │  or leave empty to unstake all  │
   │                                 │
   │  [Input: _______]               │
   │                                 │
   │  [Cancel]  [Unstake]            │
   └─────────────────────────────────┘
   ```

#### 7.2 Choose Amount
**Option A: Partial Unstake**
- Type: `0.05`
- Unstakes only 0.05 BNB
- Remaining 0.05 BNB keeps earning

**Option B: Full Unstake**
- Leave empty or type `all`
- Unstakes entire 0.1 BNB

#### 7.3 Confirm Transaction
1. Click **"Unstake"**
2. MetaMask confirms:
   ```
   Request Unstake
   
   Shares to unstake: 100000...
   Gas: ~0.001 BNB
   
   [Confirm]
   ```
3. Wait (~3 seconds)
4. ✅ "Unstake request submitted!"

#### 7.4 Withdraw
1. Click **"💸 WITHDRAW UNSTAKED"** button
2. Enter queue index: `0` (usually 0 for latest)
3. Confirm transaction
4. BNB returns to your wallet!

---

### Step 8: View Transaction History 📜

#### 8.1 Navigate to History
- Click **"HISTORY"** in top navigation
- Or visit `/transaction`

#### 8.2 Transaction List Display

```
╔═══════════════════════════════════════════════════════╗
║  📊 TRANSACTION HISTORY (Powered by BSCScan)          ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  Filter: [All] [Stake] [Unstake] [Claim] [Withdraw]  ║
║                                                       ║
║  ┌─────────────────────────────────────────────┐     ║
║  │ 🟢 STAKE                                     │     ║
║  │ Amount: 0.1000 BNB                          │     ║
║  │ Time: 2 hours ago                           │     ║
║  │ Status: ✅ Success                          │     ║
║  │ Tx: 0x1a2b3c...                             │     ║
║  │ [View on BSCScan →]                         │     ║
║  └─────────────────────────────────────────────┘     ║
║                                                       ║
║  ┌─────────────────────────────────────────────┐     ║
║  │ 🔵 CLAIM                                     │     ║
║  │ Amount: 0.0008 BNB                          │     ║
║  │ Time: 30 minutes ago                        │     ║
║  │ Status: ✅ Success                          │     ║
║  │ Tx: 0x4d5e6f...                             │     ║
║  │ [View on BSCScan →]                         │     ║
║  └─────────────────────────────────────────────┘     ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

#### 8.3 Transaction Types

| Icon | Type | Description |
|------|------|-------------|
| 🟢 | **STAKE** | You deposited BNB |
| 🔴 | **UNSTAKE** | You requested withdrawal |
| 🔵 | **CLAIM** | You claimed rewards |
| 🟣 | **WITHDRAW** | You completed withdrawal |
| 🟡 | **HARVEST** | Rewards generated |

---

## 🎥 Video Demo (Coming Soon)

We're creating a comprehensive video walkthrough showing:
- ✅ Wallet setup and connection
- ✅ First stake transaction
- ✅ Real-time reward accumulation
- ✅ Claiming rewards process
- ✅ Unstaking and withdrawal
- ✅ Transaction history review

**Subscribe for updates!** 📹

---

## 🔍 Smart Contract Verification

### View Live Contracts on BSCScan

#### StakingRouterBNB (Main Router)
```
Address: 0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78
Link: https://testnet.bscscan.com/address/0x8c1Fef12BaFC06077C06486bF4c3E0c9c1F78e78
```

**What You Can See:**
- All transactions (stakes, unstakes, claims)
- Contract code (verified and readable)
- Total value locked (TVL)
- Number of unique users
- Recent activity timeline

#### SimpleMockAdapter (Rewards Engine)
```
Address: 0x58E7DF3cAae6EEb94A76Ac3b74eC88049F438e7B
Link: https://testnet.bscscan.com/address/0x58E7DF3cAae6EEb94A76Ac3b74eC88049F438e7B
```

**What You Can See:**
- Time-based reward calculations
- Stake tracking
- Harvest events
- Pending rewards (live)

---

## 📊 Demo Statistics

### Platform Performance

```
┌─────────────────────────────────────────┐
│  DEMO PLATFORM STATISTICS               │
├─────────────────────────────────────────┤
│  Total Value Locked (TVL)    0.5 BNB   │
│  Active Stakers              3 users    │
│  Total Transactions          47 txs     │
│  Average Stake Amount        0.15 BNB   │
│  Total Rewards Distributed   0.02 BNB   │
│  Average APY                 10%        │
│  Uptime                      99.9%      │
└─────────────────────────────────────────┘
```

### Your Demo Account Stats
```
┌─────────────────────────────────────────┐
│  YOUR DEMO STATISTICS                   │
├─────────────────────────────────────────┤
│  Wallet Address    0x45F3...3acd        │
│  Total Staked      0.1 BNB              │
│  Rewards Earned    0.0008 BNB           │
│  Total Transactions 3                   │
│  Member Since      Today                │
│  Loyalty Stars     5,000                │
└─────────────────────────────────────────┘
```

---

## 🎯 Demo Scenarios

### Scenario 1: Conservative Investor
```
Stake: 0.1 BNB
Duration: 30 days
Expected Reward: 0.0082 BNB (~$2.46)
Action: Stake → Wait 30 days → Claim
```

### Scenario 2: Active Trader
```
Stake: 0.5 BNB
Duration: 7 days
Expected Reward: 0.0096 BNB (~$2.88)
Action: Stake → Check daily → Claim weekly
```

### Scenario 3: Whale Investor
```
Stake: 10 BNB
Duration: 365 days
Expected Reward: 1.0 BNB (~$300)
Action: Stake → Auto-compound → Claim yearly
```

---

## 🧪 Testing Features

### Test Different Amounts
Try staking various amounts to see tier differences:
- **0.1 BNB** → Comet Tier (6% APY, 14 days lock)
- **1.0 BNB** → Meteor Tier (8% APY, 30 days lock)
- **5.0 BNB** → Supernova Tier (12% APY, 90 days lock)

### Test Partial Unstaking
1. Stake 0.5 BNB
2. Request unstake 0.2 BNB
3. Keep 0.3 BNB earning rewards
4. Withdraw 0.2 BNB
5. Later unstake remaining 0.3 BNB

### Test Multiple Stakes
1. Stake 0.1 BNB in Comet Tier
2. Wait 1 day
3. Stake 0.5 BNB more
4. Watch total rewards combine
5. Claim all at once

---

## 🎨 UI/UX Highlights

### Space-Themed Design Elements
- 🌌 **Animated starfield background**
- 🤖 **Interactive AI robot mascot**
- 🚀 **Smooth page transitions**
- ✨ **Particle effects on hover**
- 🌠 **Gradient buttons with glow**
- 🪐 **Floating planet animations**

### Responsive Layout
```
Desktop (>1024px)  → Full sidebar + wide panels
Tablet (768-1024px) → Collapsed sidebar + medium panels
Mobile (<768px)    → Bottom nav + stacked panels
```

### Color Scheme
```css
Primary:   #667eea (Purple Blue)
Secondary: #f093fb (Pink Purple)
Accent:    #4facfe (Sky Blue)
Success:   #43e97b (Green)
Warning:   #feca57 (Yellow)
Error:     #ff6b6b (Red)
Dark:      #1a1a2e (Space Dark)
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Issue: "Insufficient Funds"
**Solution:**
- Get test BNB from [faucet](https://testnet.binance.org/faucet-smart)
- Wait 10 seconds after requesting
- Refresh MetaMask

#### Issue: "Wrong Network"
**Solution:**
- Click "Switch to BSC Testnet" button
- Or manually add network in MetaMask
- Chain ID must be **97**

#### Issue: "Transaction Failed"
**Solution:**
- Increase gas limit (try 300,000)
- Check you have enough BNB for gas
- Wait for pending transactions to complete

#### Issue: "Approve Button Disabled"
**Solution:**
- Check minimum stake (0.1 BNB)
- Ensure wallet is connected
- Refresh the page

#### Issue: "Rewards Not Showing"
**Solution:**
- Wait 5 seconds for auto-update
- Check "Unclaimed Earning (Live)" section
- Rewards start small and grow over time

---

## 📱 Mobile Demo

### Access on Mobile
1. Open MetaMask app on phone
2. Navigate to Browser tab
3. Enter: `https://staryield.finance`
4. Connect wallet
5. Full mobile-responsive interface!

### Mobile-Specific Features
- 📱 Touch-optimized buttons
- 🔄 Pull to refresh
- 📊 Swipeable charts
- 🎯 Bottom navigation
- ⚡ Fast loading

---

## 🎓 Learning Resources

### For Developers
- 📖 [Full Documentation](README.md)
- 🔧 [Smart Contract Code](web3/contracts/)
- 💻 [Frontend Source](src/)
- 🧪 [Deployment Scripts](web3/scripts/)

### For Users
- 🎥 Video tutorials (coming soon)
- 📝 Blog posts
- 💬 Community Discord
- 📞 Support chat

---

## 🌟 Next Steps After Demo

1. **Join Community**
   - Discord: [discord.gg/staryield](https://discord.gg/staryield)
   - Twitter: [@staryield](https://twitter.com/staryield)
   - Telegram: [t.me/staryield](https://t.me/staryield)

2. **Provide Feedback**
   - Report bugs: [GitHub Issues](https://github.com/Iglxkardam/Staryield/issues)
   - Suggest features
   - Share your experience

3. **Spread the Word**
   - Share on social media
   - Refer friends (earn bonus stars!)
   - Write reviews

4. **Stay Updated**
   - Star the repo ⭐
   - Watch releases
   - Subscribe to newsletter

---

<div align="center">

## 🚀 Start Your Demo Now!

**[🎯 Begin Staking →](https://staryield.finance)**

*Navigate the Financial Cosmos with StarYield* ✨

---

**Questions?** Reach out on [Discord](https://discord.gg/staryield) or [Twitter](https://twitter.com/staryield)

**Found a bug?** [Report it here](https://github.com/Iglxkardam/Staryield/issues)

**Want to contribute?** [Check our Contributing Guide](README.md#-contributing)

</div>
