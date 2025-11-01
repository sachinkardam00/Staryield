# 📸 Screenshot Guide for README

To complete the visual README, take these screenshots of your running application:

## 🎯 Required Screenshots

### 1. Home Page (`home.png`)
**URL:** `http://localhost:8080/`

**What to capture:**
- Full landing page with space background
- AI robot mascot visible
- "NAVIGATE THE FINANCIAL COSMOS WITH STARYIELD STAKING" heading
- "BEGIN STAKING" and "READ DOCUMENT" buttons
- Current APY display (128.3%)
- Navigation menu (STAKE, AFFILIATE, HISTORY, etc.)

**Screenshot dimensions:** 1920x1080 (Full HD)

**How to take:**
1. Open app in browser
2. Press `F11` for fullscreen (optional)
3. Press `Win + Shift + S` (Windows) or `Cmd + Shift + 4` (Mac)
4. Select the entire visible area
5. Save as `home.png` in `public/images/demo/`

---

### 2. Dashboard (`dashboard.png`)
**URL:** `http://localhost:8080/dashboard`

**What to capture:**
- Overall Portfolio section showing:
  - Total Staked: BNB 0.7000
  - Total Earned: BNB 0
  - Active Staking: BNB 0.7000
- Unclaimed Earning (Live) panel with:
  - BNB amount (growing)
  - "Growing at 10% APY" message
  - CLAIM REWARDS button
  - REQUEST UNSTAKE button
  - WITHDRAW UNSTAKED button
- Loyalty Points section showing stars earned

**Screenshot dimensions:** 1920x1080 (Full HD)

**Tips:**
- Make sure rewards are visible (wait a few seconds after staking)
- Show the live update indicator
- Capture the BNB logo prominently

---

### 3. Staking Interface (`staking.png`)
**URL:** `http://localhost:8080/dashboard` (scroll to Comet Tier section)

**What to capture:**
- Comet Tier card showing:
  - Tier number and name
  - "You Staked" amount
  - APY/APR percentages (6% / 5.51%)
  - Locked Period (14 Days)
  - Min Investment (0.1 BNB)
  - Daily rate (0.02%)
- BNB balance display
- Input field with amount
- Max button
- APPROVE and STAKE buttons

**Screenshot dimensions:** 1200x800 (focused on the card)

**Tips:**
- Fill in the input field with an amount (e.g., 0.1)
- Show both APPROVE and STAKE buttons clearly
- Include the BNB logo and balance

---

### 4. Transaction History (`transactions.png`)
**URL:** `http://localhost:8080/transaction`

**What to capture:**
- "TRANSACTION HISTORY" heading
- Filter buttons (All, Stake, Unstake, Claim, Withdraw)
- At least 2-3 transaction cards showing:
  - Transaction type (STAKE, CLAIM, etc.)
  - Amount in BNB
  - Timestamp ("2 hours ago")
  - Status (✅ Success)
  - Transaction hash
  - "View on BSCScan" link
- BSCScan API powered indicator

**Screenshot dimensions:** 1920x1080 (Full HD)

**Tips:**
- Make sure you have some transactions first (stake, claim)
- Show different transaction types
- Capture the clean card layout

---

## 🖼️ Screenshot Checklist

Before taking screenshots, ensure:

- [ ] App is running (`npm run dev`)
- [ ] Browser is full screen or maximized
- [ ] Wallet is connected (shows your address)
- [ ] You have staked some BNB (so data is visible)
- [ ] You have some transaction history
- [ ] Dark mode / theme is consistent
- [ ] No browser dev tools visible
- [ ] Zoom level is 100%

---

## 🎨 Post-Processing (Optional)

For professional screenshots, you can:

1. **Add annotations** (using tools like:
   - [Snagit](https://www.techsmith.com/screen-capture.html)
   - [Lightshot](https://app.prntscr.com/)
   - [ShareX](https://getsharex.com/)

2. **Optimize file size**:
   ```bash
   # Using ImageOptim (Mac)
   # Or TinyPNG.com (online)
   ```

3. **Consistent dimensions**:
   - All screenshots should be same width (1920px recommended)
   - Crop to remove unnecessary browser chrome
   - Keep aspect ratio consistent

---

## 📂 File Organization

Save screenshots in this structure:
```
public/images/demo/
├── home.png          (Landing page)
├── dashboard.png     (Staking dashboard)
├── staking.png       (Staking interface)
└── transactions.png  (Transaction history)
```

---

## 🚀 After Taking Screenshots

1. **Verify images exist**:
   ```bash
   ls public/images/demo/
   ```

2. **Check file sizes** (should be < 500KB each):
   ```bash
   du -h public/images/demo/*.png
   ```

3. **Commit and push**:
   ```bash
   git add public/images/demo/*.png
   git commit -m "📸 Add application screenshots for README"
   git push origin main
   ```

4. **Verify on GitHub**:
   - Visit: https://github.com/Iglxkardam/Staryield
   - Check that README.md displays images correctly
   - Images should be visible inline

---

## 🎥 Alternative: GIF Demos

For animated demos, create GIFs showing:

### Staking Flow GIF (`staking-flow.gif`)
1. Connect wallet
2. Enter amount
3. Click APPROVE
4. Wait for confirmation
5. Click STAKE
6. Show success message

**Tools:**
- [ScreenToGif](https://www.screentogif.com/) (Windows)
- [GIPHY Capture](https://giphy.com/apps/giphycapture) (Mac)
- [Peek](https://github.com/phw/peek) (Linux)

### Rewards Growth GIF (`rewards-growth.gif`)
1. Show current reward: 0.0000000001 BNB
2. Wait 10 seconds
3. Show updated reward: 0.0000000033 BNB
4. Highlight "Growing at 10% APY"

---

## 🖼️ Image Guidelines

### Format
- **PNG** for screenshots (lossless)
- **GIF** for animations (< 5MB)
- **WEBP** for optimized versions

### Dimensions
- **Desktop:** 1920x1080 (Full HD)
- **Tablet:** 1200x800
- **Mobile:** 750x1334 (iPhone)

### Quality
- No blurry text
- Clear UI elements
- Readable numbers
- Proper contrast

---

## ✅ Final Checklist

- [ ] All 4 screenshots taken
- [ ] Files saved in correct location
- [ ] File names match README references
- [ ] Images are clear and high quality
- [ ] Consistent styling across all images
- [ ] Committed and pushed to GitHub
- [ ] Verified display on GitHub README

---

## 🆘 Need Help?

If you have issues taking screenshots:

1. **Windows:** Use `Win + Shift + S` (Snipping Tool)
2. **Mac:** Use `Cmd + Shift + 4` (Screenshot tool)
3. **Linux:** Use `gnome-screenshot` or Spectacle

Or use browser extensions:
- [Nimbus Screenshot](https://nimbusweb.me/screenshot.php)
- [Awesome Screenshot](https://www.awesomescreenshot.com/)
- [Fireshot](https://getfireshot.com/)

---

**Ready?** Start the app and take your screenshots! 📸

```bash
npm run dev
# Visit http://localhost:8080
# Take screenshots
# Save to public/images/demo/
```
