// Home Component
class HomeComponent {
    render() {
        return `
        <header>
            <div class="container">
                <div class="header-container d-flex justify-content-between align-items-center">
                    <a href="#" class="logo"><img src="images/logo.svg"/></a>
                    <ul class="main-menu clearfix">
                        <li><a href="#" class="link">Stake</a></li>
                        <li><a href="#" class="link">Affiliate</a></li>
                        <li><a href="#" class="link">Guide</a></li>
                        <li><a href="#" class="link">Roadmap</a></li>
                        <li><a href="#" class="link">Documentation</a></li>
                        <li class="menu-enter"><a href="#" data-route="/dashboard" class="btn btn-blue">Enter App</a></li>
                    </ul>
                    <ul class="header-buttons clearfix">
                        <li><button class="btn btn-green connect-wallet-btn">Connect Wallet</button></li>
                        <li class="enter-app"><a href="#" data-route="/dashboard" class="btn btn-blue">Enter App</a></li>
                        <li class="menu-toggle"><a href="javascript:void(0);" id="menu-toggle" class="btn btn-skyblue"><i class="fas fa-bars"></i></a></li>
                    </ul>
                </div>
            </div>
        </header>
        
        <div class="main-wrapper">
            <div class="container">
                <div class="inner-wrapper d-flex align-items-center justify-content-center">
                    <div class="main-caption text-center">
                        <h1>Navigate the Financial Cosmos <br/>with StarYield Staking</h1>
                        <p>Journey through the financial galaxy with StarYield's premier staking experience. Unlock the potential of your digital assets as you traverse through a universe of rewards. With StarYield, your crypto ventures beyond the ordinary, charting a course through the stars of DeFi space. Secure. </p>
                        <div class="button-set text-center">
                            <a href="#" data-route="/dashboard" class="btn btn-skyblue normal">Begin Staking</a>
                            <a href="#" class="btn btn-green normal" style="margin-left:10px;">read Document</a>
                        </div>
                    </div>
                    <div class="arb-stats">
                        <ul class="clearfix">
                            <li>
                                <h4>Total value locked</h4>
                                <h3>$<span class="animate-number" data-value="1425422">1,425,422</span></h3>
                            </li>
                            <li>
                                <h4>Total stakers</h4>
                                <h3><span class="animate-number" data-value="6254">6254</span></h3>
                            </li>
                            <li>
                                <h4>Total payouts</h4>
                                <h3>$<span class="animate-number" data-value="3425422">3,425,422</span></h3>
                            </li>
                        </ul>
                    </div>
                    <div class="arb-socials">
                        <ul class="clearfix">
                            <li><a href="#" target="_blank" class="btn btn-social"><i class="fab fa-twitter"></i> Twitter</a></li>
                            <li><a href="#" target="_blank" class="btn btn-social"><i class="fas fa-paper-plane"></i> Telegram</a></li>
                            <li><a href="#" target="_blank" class="btn btn-social"><i class="fab fa-discord"></i> Discord</a></li>
                        </ul>
                    </div>
                    
                    <div class="blue-globe"><video autoplay loop muted> <source src="images/blue-globe.mp4" type="video/mp4"></video></div>
                    <div class="ai"><video autoplay loop muted> <source src="images/ai.mp4" type="video/mp4"></video></div>
                    <div class="ship"><video autoplay loop muted> <source src="images/ship.mp4" type="video/mp4"></video></div>
                    <div class="white-globe"><img src="images/white-globe.png" class="fluid-img"/></div>
                </div>
            </div>
        </div>
        `;
    }

    mount() {
        // Initialize mobile menu toggle
        this.initMobileMenu();
        // Initialize number animations
        this.initNumberAnimations();
        // Initialize wallet functionality
        this.initWallet();
    }

    initWallet() {
        // Update wallet button based on connection status
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
                // If connected, show wallet info or disconnect
                this.showWalletInfo();
            } else {
                // If not connected, try to connect
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
}

export default new HomeComponent();