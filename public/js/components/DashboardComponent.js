// Dashboard Component
class DashboardComponent {
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
                            <li class="active"><a href="#" data-route="/dashboard" class="link">Stake</a></li>
                            <li><a href="#" data-route="/referral" class="link">Affiliate</a></li>
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
                                <h3>Overall Portfolio</h3>
                                <div>
                                    <a href="#" class="btn btn-green"><i class="fa-solid fa-square-arrow-up-right"></i> Verified Contract</a>
                                    <a href="#" class="btn btn-blue"><i class="fa-solid fa-headset"></i> Support</a>
                                </div>
                            </div>
                            <ul class="top-stats-ul clearfix">
                                <li>
                                    <h4>Total Staked</h4>
                                    <h3>BNB <span class="animate-number" data-value="1400">1400</span></h3>
                                </li>
                                <li>
                                    <h4>Total Earned</h4>
                                    <h3>BNB <span class="animate-number" data-value="1000">1000</span></h3>
                                </li>
                                <li>
                                    <h4>Active Staking</h4>
                                    <h3>BNB <span class="animate-number" data-value="15000">15,000</span></h3>
                                </li>
                                <li>
                                    <h4>Withdrawn Earning</h4>
                                    <h3>BNB <span class="animate-number" data-value="11000">11,000</span></h3>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="card-box">
                            <div class="claim-box d-flex align-items-center">
                                <div class="claim-logo"><img src="images/bnb.png"/></div>
                                <div class="claim-box-details">
                                    <h4>Unclaimed Earning</h4>
                                    <h3><b class="ticker">BNB</b> <span class="animate-number" data-value="11000">11,000</span></h3>
                                    <button class="btn btn-blue"><i class="fa-regular fa-hand-pointer"></i> Claim</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="dashboard-body">
            <div class="container">
                <div class="row">
                    <div class="col-lg-8">
                        <div class="staking-container">
                            <div class="staking-tabs tabs">
                                <ul class="tab-links clearfix">
                                    <li class="active"><a href="#tab1">Comet Tier</a></li>
                                    <li class="tab2"><a href="#tab2">Meteor Tier</a></li>
                                    <li class="tab3"><a href="#tab3">Supernova Tier</a></li>
                                </ul>
                                <div class="tab-content">
                                    <div class="tab active" id="tab1">
                                        <div class="staking-wrap">
                                            <div class="staking-top">
                                                <div class="s-title"><i>1</i><span>Comet Tier</span><b>Stake $BNB</b></div>
                                                <div class="s-data">
                                                    <h4>You Staked</h4>
                                                    <h5>0 <b>BNB</b></h5>
                                                </div>
                                                <div class="s-data">
                                                    <h4>APY/APR</h4>
                                                    <h5>1095%</h5>
                                                </div>
                                                <div class="s-data">
                                                    <h4>Locked Period</h4>
                                                    <h5>14 <b>Days</b></h5>
                                                </div>
                                                <div class="s-data">
                                                    <h4>Min Investment</h4>
                                                    <h5>0.1 <b>BNB</b></h5>
                                                </div>
                                                <div class="s-data">
                                                    <h4>Daily</h4>
                                                    <h5>3%</h5>
                                                </div>
                                            </div>
                                            <div class="staking-field">
                                                <div class="staking-form">
                                                    <div class="token-ticker"><img src="images/bnb.png">&nbsp; BNB</div>
                                                    <div class="input-box">
                                                        <input type="text" placeholder="0">
                                                        <span class="max">Max</span>
                                                    </div>
                                                </div>
                                                <div class="staking-titles">
                                                    <div id="balance">Balance: 100 BNB</div>
                                                    <div>Enter Amount Above</div>
                                                </div>
                                                <div class="staking-button half clearfix">
                                                    <div class="s-button">
                                                        <button class="btn btn-white normal full">Approve</button>
                                                    </div>
                                                    <div class="s-button">
                                                        <button class="btn btn-skyblue normal full">Stake</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab" id="tab2">
                                        <div class="staking-wrap">
                                            <div class="staking-top">
                                                <div class="s-title"><i>2</i><span>Meteor Tier</span><b>Stake $BNB</b></div>
                                                <div class="s-data">
                                                    <h4>You Staked</h4>
                                                    <h5>0 <b>BNB</b></h5>
                                                </div>
                                                <div class="s-data">
                                                    <h4>APY/APR</h4>
                                                    <h5>1825%</h5>
                                                </div>
                                                <div class="s-data">
                                                    <h4>Locked Period</h4>
                                                    <h5>21 <b>Days</b></h5>
                                                </div>
                                                <div class="s-data">
                                                    <h4>Min Investment</h4>
                                                    <h5>1 <b>BNB</b></h5>
                                                </div>
                                                <div class="s-data">
                                                    <h4>Daily</h4>
                                                    <h5>5%</h5>
                                                </div>
                                            </div>
                                            <div class="staking-field">
                                                <div class="staking-form">
                                                    <div class="token-ticker"><img src="images/bnb.png">&nbsp; BNB</div>
                                                    <div class="input-box">
                                                        <input type="text" placeholder="0">
                                                        <span class="max">Max</span>
                                                    </div>
                                                </div>
                                                <div class="staking-titles">
                                                    <div id="balance">Balance: 100 BNB</div>
                                                    <div>Enter Amount Above</div>
                                                </div>
                                                <div class="staking-button half clearfix">
                                                    <div class="s-button">
                                                        <button class="btn btn-white normal full">Approve</button>
                                                    </div>
                                                    <div class="s-button">
                                                        <button class="btn btn-skyblue normal full">Stake</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab" id="tab3">
                                        <div class="staking-wrap">
                                            <div class="staking-top">
                                                <div class="s-title"><i>3</i><span>Supernova Tier</span><b>Stake $BNB</b></div>
                                                <div class="s-data">
                                                    <h4>You Staked</h4>
                                                    <h5>0 <b>BNB</b></h5>
                                                </div>
                                                <div class="s-data">
                                                    <h4>APY/APR</h4>
                                                    <h5>2555%</h5>
                                                </div>
                                                <div class="s-data">
                                                    <h4>Locked Period</h4>
                                                    <h5>30 <b>Days</b></h5>
                                                </div>
                                                <div class="s-data">
                                                    <h4>Min Investment</h4>
                                                    <h5>5 <b>BNB</b></h5>
                                                </div>
                                                <div class="s-data">
                                                    <h4>Daily</h4>
                                                    <h5>7%</h5>
                                                </div>
                                            </div>
                                            <div class="staking-field">
                                                <div class="staking-form">
                                                    <div class="token-ticker"><img src="images/bnb.png">&nbsp; BNB</div>
                                                    <div class="input-box">
                                                        <input type="text" placeholder="0">
                                                        <span class="max">Max</span>
                                                    </div>
                                                </div>
                                                <div class="staking-titles">
                                                    <div id="balance">Balance: 100 BNB</div>
                                                    <div>Enter Amount Above</div>
                                                </div>
                                                <div class="staking-button half clearfix">
                                                    <div class="s-button">
                                                        <button class="btn btn-white normal full">Approve</button>
                                                    </div>
                                                    <div class="s-button">
                                                        <button class="btn btn-skyblue normal full">Stake</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <h3 class="box-o-title">Loyalty Points (Stars)</h3>
                        <div class="card-box point-1">
                            <ul class="stat-list">
                                <li class="d-flex align-items-center">
                                    <div class="stat-icon"><img src="images/stat-icon-1.png"/></div>
                                    <div class="stat-details">
                                        <h4>Total Stars</h4>
                                        <h3>14,120</h3>
                                    </div>
                                </li>
                                <li class="d-flex align-items-center">
                                    <div class="stat-icon"><img src="images/stat-icon-2.png"/></div>
                                    <div class="stat-details">
                                        <h4>Stars earned by staking</h4>
                                        <h3>5000</h3>
                                    </div>
                                </li>
                                <li class="d-flex align-items-center">
                                    <div class="stat-icon"><img src="images/stat-icon-3.png"/></div>
                                    <div class="stat-details">
                                        <h4>Stars earned by friend's staking</h4>
                                        <h3>8000</h3>
                                    </div>
                                </li>
                                <li class="d-flex align-items-center">
                                    <div class="stat-icon"><img src="images/stat-icon-4.png"/></div>
                                    <div class="stat-details">
                                        <h4>Referrals</h4>
                                        <h3>1800</h3>
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
        // Initialize number animations
        this.initNumberAnimations();
        // Initialize tabs
        this.initTabs();
        // Initialize wallet functionality
        this.initWallet();
    }

    initWallet() {
        // Update wallet button and balance
        this.updateWalletButton();
        this.updateBalance();
        
        // Add wallet connection listener
        if (window.walletManager) {
            window.walletManager.addListener(this.handleWalletChange.bind(this));
        }

        // Add click listener to connect button
        const connectBtn = document.querySelector('.connect-wallet-btn');
        if (connectBtn) {
            connectBtn.addEventListener('click', this.handleConnectClick.bind(this));
        }

        // Add click listeners to staking buttons
        this.initStakingButtons();
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
        this.updateBalance();
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

    async updateBalance() {
        const balanceElements = document.querySelectorAll('.wallet-balance, #balance');
        
        if (window.walletManager && window.walletManager.isConnected) {
            try {
                const balance = await window.walletManager.getBalance();
                const formattedBalance = parseFloat(balance).toFixed(4);
                balanceElements.forEach(element => {
                    element.textContent = `Balance: ${formattedBalance} BNB`;
                });
            } catch (error) {
                console.error('Error getting balance:', error);
                balanceElements.forEach(element => {
                    element.textContent = 'Balance: Error loading';
                });
            }
        } else {
            balanceElements.forEach(element => {
                element.textContent = 'Balance: Connect wallet';
            });
        }
    }

    initStakingButtons() {
        // Add event listeners to approve and stake buttons
        const approveButtons = document.querySelectorAll('.approve-btn');
        const stakeButtons = document.querySelectorAll('.stake-btn');

        approveButtons.forEach(btn => {
            btn.addEventListener('click', this.handleApprove.bind(this));
        });

        stakeButtons.forEach(btn => {
            btn.addEventListener('click', this.handleStake.bind(this));
        });
    }

    async handleApprove() {
        if (!window.walletManager || !window.walletManager.isConnected) {
            alert('Please connect your wallet first');
            return;
        }

        if (!window.walletManager.isOnBSC()) {
            alert('Please switch to BSC network');
            return;
        }

        // TODO: Implement approve functionality for smart contract
        alert('Approve functionality will be implemented with smart contract integration');
    }

    async handleStake() {
        if (!window.walletManager || !window.walletManager.isConnected) {
            alert('Please connect your wallet first');
            return;
        }

        if (!window.walletManager.isOnBSC()) {
            alert('Please switch to BSC network');
            return;
        }

        // TODO: Implement stake functionality for smart contract
        alert('Stake functionality will be implemented with smart contract integration');
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

    initNumberAnimations() {
        if (typeof jQuery !== 'undefined') {
            jQuery('.animate-number').each(function() {
                var $this = jQuery(this),
                    countTo = $this.attr('data-value'),
                    countFrom = 0,
                    duration = 3000;

                jQuery({ countNum: countFrom }).animate({
                    countNum: countTo
                }, {
                    duration: duration,
                    easing: 'linear',
                    step: function() {
                        $this.text(commaSeparateNumber(Math.floor(this.countNum)));
                    },
                    complete: function() {
                        $this.text(commaSeparateNumber(this.countNum));
                    }
                });
            });
        }

        function commaSeparateNumber(val) {
            while (/(\d+)(\d{3})/.test(val.toString())) {
                val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
            }
            return val;
        }
    }

    initTabs() {
        if (typeof jQuery !== 'undefined') {
            jQuery('.tabs .tab-links a').on('click', function(e) {
                var currentAttrValue = jQuery(this).attr('href');
                
                // Show/Hide Tabs
                jQuery('.tabs ' + currentAttrValue).slideDown(400).siblings().slideUp(400);
                
                // Change/remove current tab to active
                jQuery(this).parent('li').addClass('active').siblings().removeClass('active');
                
                e.preventDefault();
            });
        }
    }
}

export default new DashboardComponent();