// Wallet Connection Manager
class WalletManager {
    constructor() {
        this.isConnected = false;
        this.account = null;
        this.chainId = null;
        this.provider = null;
        this.signer = null;
        this.listeners = [];
        this.init();
    }

    async init() {
        // Check if wallet is already connected
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    await this.handleAccountsChanged(accounts);
                }
                
                // Set up event listeners
                window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
                window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));
                window.ethereum.on('disconnect', this.handleDisconnect.bind(this));
            } catch (error) {
                console.error('Error initializing wallet:', error);
            }
        }
    }

    async connect() {
        if (!window.ethereum) {
            alert('Please install MetaMask or another Web3 wallet');
            return false;
        }

        try {
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            if (accounts.length > 0) {
                await this.handleAccountsChanged(accounts);
                
                // Check if we're on BSC network
                const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                await this.handleChainChanged(chainId);
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error connecting wallet:', error);
            return false;
        }
    }

    async disconnect() {
        this.isConnected = false;
        this.account = null;
        this.chainId = null;
        this.provider = null;
        this.signer = null;
        this.notifyListeners();
    }

    async handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            await this.disconnect();
        } else {
            this.account = accounts[0];
            this.isConnected = true;
            
            // Initialize ethers provider
            if (window.ethereum) {
                this.provider = new ethers.providers.Web3Provider(window.ethereum);
                this.signer = this.provider.getSigner();
            }
            
            this.notifyListeners();
        }
    }

    async handleChainChanged(chainId) {
        this.chainId = chainId;
        
        // Convert hex to decimal
        const chainIdDecimal = parseInt(chainId, 16);
        
        // Check if we're on BSC (56) or BSC Testnet (97)
        if (chainIdDecimal !== 56 && chainIdDecimal !== 97) {
            await this.switchToBSC();
        }
        
        this.notifyListeners();
    }

    async handleDisconnect() {
        await this.disconnect();
    }

    async switchToBSC() {
        if (!window.ethereum) return;

        try {
            // Try to switch to BSC Mainnet
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x38' }], // BSC Mainnet (56 in hex)
            });
        } catch (switchError) {
            // If the chain hasn't been added to the user's wallet, add it
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x38',
                            chainName: 'BNB Smart Chain',
                            nativeCurrency: {
                                name: 'BNB',
                                symbol: 'BNB',
                                decimals: 18,
                            },
                            rpcUrls: ['https://bsc-dataseed1.binance.org'],
                            blockExplorerUrls: ['https://bscscan.com'],
                        }],
                    });
                } catch (addError) {
                    console.error('Error adding BSC network:', addError);
                }
            }
        }
    }

    getDisplayAddress() {
        if (!this.account) return '';
        return `${this.account.slice(0, 6)}...${this.account.slice(-4)}`;
    }

    getChainName() {
        if (!this.chainId) return '';
        const chainIdDecimal = parseInt(this.chainId, 16);
        switch (chainIdDecimal) {
            case 56:
                return 'BSC Mainnet';
            case 97:
                return 'BSC Testnet';
            default:
                return 'Unknown Network';
        }
    }

    isOnBSC() {
        if (!this.chainId) return false;
        const chainIdDecimal = parseInt(this.chainId, 16);
        return chainIdDecimal === 56 || chainIdDecimal === 97;
    }

    // Event listener management
    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        this.listeners = this.listeners.filter(listener => listener !== callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback({
                    isConnected: this.isConnected,
                    account: this.account,
                    chainId: this.chainId,
                    displayAddress: this.getDisplayAddress(),
                    chainName: this.getChainName(),
                    isOnBSC: this.isOnBSC()
                });
            } catch (error) {
                console.error('Error in wallet listener:', error);
            }
        });
    }

    // Get balance
    async getBalance() {
        if (!this.provider || !this.account) return '0';
        
        try {
            const balance = await this.provider.getBalance(this.account);
            return ethers.utils.formatEther(balance);
        } catch (error) {
            console.error('Error getting balance:', error);
            return '0';
        }
    }

    // Contract interaction helper
    async getContract(address, abi) {
        if (!this.signer) {
            throw new Error('Wallet not connected');
        }
        return new ethers.Contract(address, abi, this.signer);
    }
}

// Create global wallet manager instance
window.walletManager = new WalletManager();

export default window.walletManager;