// Referral Component
class ReferralComponent {
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
                            <li class="active"><a href="#" data-route="/referral" class="link">Affiliate</a></li>
                            <li><a href="#" data-route="/transaction" class="link">History</a></li>
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
                    <div class="col-lg-8">
                        <div class="card-box">
                            <div class="card-box-title d-flex align-items-center justify-content-between">
                                <h3>Referral Stats</h3>
                                <div>
                                    <a href="#" class="btn btn-green"><i class="fa-solid fa-square-arrow-up-right"></i> Verified Contract</a>
                                    <a href="#" class="btn btn-blue"><i class="fa-solid fa-headset"></i> Support</a>
                                </div>
                            </div>
                            <ul class="top-stats-ul clearfix">
                                <li>
                                    <h4>Your Referrals</h4>
                                    <h3>78</h3>
                                </li>
                                <li>
                                    <h4>Total Commision</h4>
                                    <h3>BNB <span>0.587</span></h3>
                                </li>
                                <li>
                                    <h4>Withdrawn Commission</h4>
                                    <h3>BNB <span>0.145</span></h3>
                                </li>
                                <li>
                                    <h4>Earned XPs</h4>
                                    <h3>1000 <span>XP</span></h3>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="card-box">
                            <div class="claim-box d-flex align-items-center">
                                <div class="claim-logo"><img src="images/bnb.png"/></div>
                                <div class="claim-box-details">
                                    <h4>Unclaimed Commission</h4>
                                    <h3><b class="ticker">BNB</b> <span>0.5</span></h3>
                                    <button class="btn btn-blue"><i class="fa-regular fa-hand-pointer"></i> Claim</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-8">
                        <div class="referral-link card-box">
                            <div class="card-box-title d-flex align-items-center justify-content-between">
                                <h3>Your StarPath Link</h3>
                                <p>Invite Explorers, Harvest Rewards</p>
                            </div>
                            <div class="link-box d-flex align-items-center">
                                <div class="link-title"><i class="fa-solid fa-link"></i> Referal Link</div>
                                <div class="r-link referral-link-text">https://staryield.com/refer/0x000000000000000000000000</div>
                                <button class="btn btn-skyblue copy-btn">Copy</button>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="card-box current-level">
                            <div class="claim-box d-flex align-items-center">
                                <div class="claim-logo"><img src="images/users.png"></div>
                                <div class="claim-box-details">
                                    <h4>Current Level</h4>
                                    <h3><b class="ticker">Bronze Tier</b></h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="dashboard-body">
            <div class="container">
                <ul class="level-list clearfix">
                    <li>
                        <div class="level-box finished">
                            <h3>5<span>%</span><b>Commission</b></h3>
                            <div class="turnover">1-10 Referrals</div>
                            <div class="level">Starter</div>
                            <div class="ref-status"><div class="finished-badge"><i class="fa-regular fa-circle-check"></i> Done</div></div>
                        </div>
                    </li>
                    <li>
                        <div class="level-box active">
                            <h3>7<span>%</span><b>Commission</b></h3>
                            <div class="turnover">11-25 Referrals</div>
                            <div class="level bronze">Bronze</div>
                            <div class="ref-status"><div class="finished-badge active"><i class="fa-regular fa-clock"></i> Current</div></div>
                        </div>
                    </li>
                    <li>
                        <div class="level-box locked">
                            <h3>10<span>%</span><b>Commission</b></h3>
                            <div class="turnover">26-50 Referrals</div>
                            <div class="level silver">Silver</div>
                            <div class="ref-status"><div class="finished-badge locked"><i class="fa-solid fa-lock"></i> Locked</div></div>
                        </div>
                    </li>
                    <li>
                        <div class="level-box locked">
                            <h3>12<span>%</span><b>Commission</b></h3>
                            <div class="turnover">51-100 Referrals</div>
                            <div class="level gold">Gold</div>
                            <div class="ref-status"><div class="finished-badge locked"><i class="fa-solid fa-lock"></i> Locked</div></div>
                        </div>
                    </li>
                    <li>
                        <div class="level-box locked">
                            <h3>15<span>%</span><b>Commission</b></h3>
                            <div class="turnover">100+ Referrals</div>
                            <div class="level platinum">Platinum</div>
                            <div class="ref-status"><div class="finished-badge locked"><i class="fa-solid fa-lock"></i> Locked</div></div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        `;
    }

    mount() {
        // Add admin class to body
        document.body.className = 'admin';
        
        // Initialize mobile menu toggle
        this.initMobileMenu();
        // Initialize copy functionality
        this.initCopyLink();
        // Initialize wallet functionality
        this.initWallet();
    }

    initWallet() {
        // Update wallet button and referral link
        this.updateWalletButton();
        this.updateReferralLink();
        
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
        this.updateReferralLink();
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

    updateReferralLink() {
        const linkElement = document.querySelector('.referral-link-text');
        if (!linkElement) return;

        if (window.walletManager && window.walletManager.isConnected) {
            linkElement.textContent = `https://staryield.com/refer/${window.walletManager.account}`;
        } else {
            linkElement.textContent = 'https://staryield.com/refer/0x000000000000000000000000';
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

    initCopyLink() {
        const copyBtn = document.querySelector('.copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', function() {
                const linkText = document.querySelector('.referral-link-text').textContent;
                navigator.clipboard.writeText(linkText).then(function() {
                    // Temporarily change button text
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyBtn.textContent = originalText;
                    }, 2000);
                }).catch(function(err) {
                    console.error('Could not copy text: ', err);
                });
            });
        }
    }
}

export default new ReferralComponent();