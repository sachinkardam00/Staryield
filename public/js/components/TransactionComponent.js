// Transaction Component
class TransactionComponent {
    render() {
        return `
        <div class="admin-header">
            <div class="hesder-video">
                <video autoplay="" muted="" loop="">
                    <source src="images/galaxy-bg-2.mp4" type="video/mp4">
                </video>
            </div>
            <header>
                <div class="container">
                    <div class="header-container d-flex justify-content-between align-items-center">
                        <a href="#" data-route="/home" class="logo"><img src="images/logo.png"></a>
                        <ul class="main-menu clearfix">
                            <li><a href="#" data-route="/dashboard" class="link">Stake</a></li>
                            <li><a href="#" data-route="/referral" class="link">Affiliate</a></li>
                            <li class="active"><a href="#" data-route="/transaction" class="link">History</a></li>
                            <li><a href="#" class="link">Referral Banners</a></li>
                            <li><a href="#" class="link">Documentation</a></li>
                            <li class="menu-enter"><a href="#" data-route="/dashboard" class="btn btn-blue">Enter App</a></li>
                        </ul>
                        <ul class="header-buttons clearfix">
                            <li class="switch d-flex align-items-center">
                                <a class="active" href="#"><img src="images/bnb.png"/>BNB</a>
                                <a href="#"><img src="images/trx.png"/>TRX</a>
                                <a href="#"><img src="images/usdt-logo.png"/>USDT</a>
                            </li>
                            <li><button class="btn btn-green connect-wallet-btn">Connect Wallet</button></li>
                            <li class="menu-toggle"><a href="javascript:void(0);" id="menu-toggle" class="btn btn-skyblue"><i class="fas fa-bars"></i></a></li>
                        </ul>
                    </div>
                </div>
            </header>
        </div>

        <div class="top-stats">
            <div class="container">
                <div class="row">
                    <div class="col-lg-12">
                        <ul class="features-menu d-flex justify-content-center">
                            <li>
                                <a href="#">Cross-chain</a>
                                <div class="feature-pop">
                                    <h4>Interstellar Transfers (Coming Soon)</h4>
                                    <p>To maximize the potential of our platform, we are working towards facilitating operations across multiple blockchain networks. </p>
                                </div>
                            </li>
                            <li>
                                <a href="#">Governance</a>
                                <div class="feature-pop">
                                    <h4>Staryield Governance (Coming Soon)</h4>
                                    <p>In the spirit of decentralized finance, we plan to introduce a governance token. </p>
                                </div>
                            </li>
                            <li>
                                <a href="#">Star Art Vault</a>
                                <div class="feature-pop">
                                    <h4>NFT Staking(Coming Soon)</h4>
                                    <p>In keeping up with the explosive growth of Non-Fungible Tokens (NFTs), we aim to incorporate NFT staking into our platform. </p>
                                </div>
                            </li>
                            <li>
                                <a href="#">StarYieldSwap</a>
                                <div class="feature-pop">
                                    <h4>DEX(Coming Soon)</h4>
                                    <p>We envision establishing our own dedicated DeFi exchange, StarYieldSwap. This platform will facilitate seamless swaps between different cryptocurrencies, driving further utility and making asset management even more flexible for our users.</p>
                                </div>
                            </li>
                            <li>
                                <a href="#">Space Radar</a>
                                <div class="feature-pop">
                                    <h4>Advanced Portfolio Analytics (Coming Soon)</h4>
                                    <p>To provide our users with deep insights into their investments, we aim to develop an advanced portfolio analytics tool.</p>
                                </div>
                            </li>
                            <li>
                                <a href="#">Comet Club</a>
                                <div class="feature-pop">
                                    <h4>Loyalty and Rewards Program (Coming Soon)</h4>
                                    <p>Our plan includes the launch of a loyalty and rewards program to show appreciation for our loyal users. </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="dashboard-body">
            <div class="container">
                <div class="row">
                    <div class="col-lg-3">
                        <div class="filter-wrapper">
                            <h3>Filter</h3>
                            <ul class="filter-list clearfix">
                                <li>
                                    <div class="filter-box">
                                        <input type="radio" name="type" id="trans-1" checked="">
                                        <label for="trans-1"><span></span>All Transaction</label>
                                    </div>
                                </li>
                                <li>
                                    <div class="filter-box">
                                        <input type="radio" name="type" id="trans-2">
                                        <label for="trans-2"><span></span>Stake</label>
                                    </div>
                                </li>
                                <li>
                                    <div class="filter-box">
                                        <input type="radio" name="type" id="trans-3">
                                        <label for="trans-3"><span></span>Earnings</label>
                                    </div>
                                </li>
                                <li>
                                    <div class="filter-box">
                                        <input type="radio" name="type" id="trans-4">
                                        <label for="trans-4"><span></span>Claimed Earning</label>
                                    </div>
                                </li>
                                <li>
                                    <div class="filter-box">
                                        <input type="radio" name="type" id="trans-5">
                                        <label for="trans-5"><span></span>Referral Reward</label>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-lg-8 offset-lg-1">
                        <div class="transactions">
                            <h3>Your Transactions</h3>
                            <ul class="transaction-list">
                                <li>
                                    <div class="trans-item d-flex justify-content-between align-items-center">
                                        <div class="d-flex align-items-center">
                                            <img src="images/bnb.png" class="trans-icon"/>
                                            <div class="trans-amount green">+1.256 <span>BNB</span></div>
                                        </div>
                                        <div class="trans-type">Stake</div>
                                        <div class="trans-date">29th Feb, 2024</div>
                                    </div>
                                </li>
                                <li>
                                    <div class="trans-item d-flex justify-content-between align-items-center">
                                        <div class="d-flex align-items-center">
                                            <img src="images/bnb.png" class="trans-icon"/>
                                            <div class="trans-amount red">-1.256 <span>BNB</span></div>
                                        </div>
                                        <div class="trans-type">Unstake</div>
                                        <div class="trans-date">29th Feb, 2024</div>
                                    </div>
                                </li>
                                <li>
                                    <div class="trans-item d-flex justify-content-between align-items-center">
                                        <div class="d-flex align-items-center">
                                            <img src="images/bnb.png" class="trans-icon"/>
                                            <div class="trans-amount green">+1.256 <span>BNB</span></div>
                                        </div>
                                        <div class="trans-type">Referral Commission</div>
                                        <div class="trans-date">29th Feb, 2024</div>
                                    </div>
                                </li>
                                <li>
                                    <div class="trans-item d-flex justify-content-between align-items-center">
                                        <div class="d-flex align-items-center">
                                            <img src="images/bnb.png" class="trans-icon"/>
                                            <div class="trans-amount red">+1.256 <span>BNB</span></div>
                                        </div>
                                        <div class="trans-type">Withdrawal</div>
                                        <div class="trans-date">29th Feb, 2024</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    mount() {
        // Add admin class to body
        document.body.className = 'admin';
        
        // Initialize mobile menu toggle
        this.initMobileMenu();
        // Initialize filter functionality
        this.initFilters();
        // Initialize wallet functionality
        this.initWallet();
    }

    initWallet() {
        // Update wallet button
        this.updateWalletButton();
        
        // Add wallet connection listener
        if (window.walletManager) {
            window.walletManager.addListener(this.handleWalletChange.bind(this));
        }

        // Add click listener to connect button
        const connectBtn = document.querySelector('.connect-wallet-btn');
        if (connectBtn) {
            connectBtn.addEventListener('click', this.handleConnectClick.bind(this));
        }
    }

    async handleConnectClick() {
        if (window.walletManager) {
            if (window.walletManager.isConnected) {
                this.showWalletInfo();
            } else {
                const connected = await window.walletManager.connect();
                if (connected) {
                    console.log('Wallet connected successfully');
                }
            }
        }
    }

    handleWalletChange(walletState) {
        this.updateWalletButton(walletState);
    }

    updateWalletButton(walletState = null) {
        const connectBtn = document.querySelector('.connect-wallet-btn');
        if (!connectBtn) return;

        const state = walletState || (window.walletManager ? {
            isConnected: window.walletManager.isConnected,
            displayAddress: window.walletManager.getDisplayAddress(),
            isOnBSC: window.walletManager.isOnBSC()
        } : { isConnected: false });

        if (state.isConnected) {
            if (state.isOnBSC) {
                connectBtn.textContent = state.displayAddress || 'Connected';
                connectBtn.className = 'btn btn-green connect-wallet-btn';
            } else {
                connectBtn.textContent = 'Wrong Network';
                connectBtn.className = 'btn btn-red connect-wallet-btn';
            }
        } else {
            connectBtn.textContent = 'Connect Wallet';
            connectBtn.className = 'btn btn-green connect-wallet-btn';
        }
    }

    showWalletInfo() {
        if (window.walletManager && window.walletManager.isConnected) {
            alert(`Connected to: ${window.walletManager.account}\nNetwork: ${window.walletManager.getChainName()}`);
        }
    }

    initMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', function() {
                const mainMenu = document.querySelector('.main-menu');
                if (mainMenu) {
                    if (mainMenu.style.display === 'block') {
                        mainMenu.style.display = 'none';
                    } else {
                        mainMenu.style.display = 'block';
                    }
                    
                    const icon = this.querySelector('i');
                    if (icon.classList.contains('fa-bars')) {
                        icon.classList.remove('fa-bars');
                        icon.classList.add('fa-times');
                    } else {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        }
    }

    initFilters() {
        const filterInputs = document.querySelectorAll('input[name="type"]');
        filterInputs.forEach(input => {
            input.addEventListener('change', function() {
                if (this.checked) {
                    // Here you would implement the actual filtering logic
                    // For now, just log the selected filter
                    console.log('Filter selected:', this.nextElementSibling.textContent.trim());
                }
            });
        });
    }
}

export default new TransactionComponent();