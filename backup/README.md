# StarYield Frontend - JavaScript SPA

A modern JavaScript Single Page Application (SPA) for the StarYield DEX aggregator platform. This frontend is designed to be compatible with smart contracts and wallet integrations.

## 🚀 Features

- **Single Page Application**: Pure JavaScript implementation with client-side routing
- **Modular Architecture**: Component-based structure for easy maintenance
- **Smart Contract Ready**: Designed for easy integration with Web3 wallets
- **Responsive Design**: Maintains original design while being mobile-friendly
- **Fast Development**: Hot reload and simple local development setup

## 📁 Project Structure

```
/
├── index.html              # Main entry point
├── package.json           # Dependencies and scripts
├── server.js             # Express server for local development
├── css/                  # Stylesheets (unchanged)
├── js/                   # JavaScript modules
│   ├── app.js           # Main application initialization
│   ├── router.js        # Client-side routing
│   └── components/      # Page components
│       ├── HomeComponent.js
│       ├── DashboardComponent.js
│       ├── ReferralComponent.js
│       └── TransactionComponent.js
├── images/              # Assets (unchanged)
└── fonts/               # Font files (unchanged)
```

## 🛠 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🔗 Navigation

The application includes the following routes:

- `/` or `/home` - Landing page
- `/dashboard` - Staking dashboard
- `/referral` - Referral program page
- `/transaction` - Transaction history

## 🔧 Development

### Adding New Components

1. Create a new component file in `/js/components/`
2. Export a component object with `render()` and optional `mount()` methods
3. Register the route in `/js/app.js`

### Component Structure

```javascript
class MyComponent {
  render() {
    return `<div>Your HTML here</div>`;
  }

  mount() {
    // Initialize any event listeners or functionality
  }
}

export default new MyComponent();
```

## 🌟 Features Ready for Integration

### Wallet Connection

- Connect buttons are present on all pages
- Ready for Web3 wallet integration (MetaMask, WalletConnect, etc.)

### Smart Contract Integration

- Component structure supports easy state management
- Event handlers ready for blockchain interactions
- Modular design allows easy addition of Web3 libraries

### Dynamic Data

- Number animations for displaying real-time data
- Component mounting system for initializing blockchain data
- Easy to extend with API calls or Web3 queries

## 🎨 Design

The frontend maintains the exact same visual design as the original HTML version:

- All CSS files remain unchanged
- Visual elements and animations preserved
- Responsive layout maintained
- Font Awesome icons and custom fonts included

## 📝 Next Steps for Web3 Integration

1. **Install Web3 libraries:**

   ```bash
   npm install ethers web3modal @walletconnect/web3-provider
   ```

2. **Add wallet connection logic to components**
3. **Integrate smart contract calls**
4. **Add state management for blockchain data**
5. **Implement transaction handling**

## 🚨 Important Notes

- The server serves all routes through `index.html` to support client-side routing
- Original design and functionality are preserved
- Ready for production deployment
- Optimized for smart contract integration

## 📞 Support

For questions or issues, refer to the original project documentation or contact the development team.

---

**Ready to integrate with your smart contracts! 🌟**
