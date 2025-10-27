# StarYield Finance - Staking DApp

A modern, secure staking platform built on Binance Smart Chain with Next.js and Wagmi.

## 🚀 Features

- **Clean Staking Flow**: Simple approve → stake workflow
- **Multi-Network Support**: BSC Mainnet and Testnet
- **Beautiful UI**: Modern, responsive design with space theme
- **RainbowKit Integration**: Premium wallet connection experience
- **Type-Safe**: Built with TypeScript for reliability
- **Real-time Updates**: Live balance and transaction status

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Web3**: Wagmi v2, Viem, RainbowKit
- **Styling**: CSS-in-JS with gradient themes
- **State Management**: TanStack Query (React Query)

## 🔧 Setup

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (get from https://cloud.walletconnect.com/)
   - Custom RPC endpoints (optional)

3. **Update contract addresses**:
   Edit `src/contracts/addresses.ts` with your:
   - Token contract addresses (BSC Mainnet & Testnet)
   - Staking contract addresses (BSC Mainnet & Testnet)

4. **Start development server**:
   ```bash
   npm run dev
   ```

Visit http://localhost:8080 to see your app!

## 📁 Project Structure

```
src/
├── app/
│   ├── staking/page.tsx          # Main staking interface
│   ├── layout.tsx                # App layout with providers
│   └── page.tsx                  # Landing page
├── components/                   # Reusable UI components
├── contracts/
│   └── addresses.ts              # Smart contract addresses
├── features/staking/
│   └── components/
│       └── ApproveStakeButton.tsx # Core staking logic
├── guards/
│   └── RequireChain.tsx          # Network validation
└── lib/
    └── wagmi.ts                  # Wagmi configuration
```

## 🎯 How to Use

1. **Connect Wallet**: Click "Connect Wallet" on the staking page
2. **Network Check**: Ensure you're on BSC or BSC Testnet
3. **Enter Amount**: Input the number of tokens to stake
4. **Approve**: First transaction approves token spending
5. **Stake**: Second transaction stakes your tokens
6. **Earn Rewards**: Start earning from your staked tokens!

## 🔒 Security Features

- **Smart Contract Simulation**: Transactions are simulated before execution
- **Network Validation**: Automatic network switching prompts
- **Balance Checks**: Prevents staking more than available balance
- **Error Handling**: Clear error messages for failed transactions

## 🚀 Going Live

1. **Deploy Contracts**: Deploy your staking contracts to BSC
2. **Update Addresses**: Set real contract addresses in `addresses.ts`
3. **Production Build**: Run `npm run build`
4. **Deploy**: Host on Vercel, Netlify, or your preferred platform

## 📋 Next Steps

- [ ] Add unstaking functionality
- [ ] Display current staked amount
- [ ] Show pending rewards
- [ ] Add staking history/analytics
- [ ] Implement reward claiming
- [ ] Add loading states and animations

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - see LICENSE file for details