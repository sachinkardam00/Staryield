// Main Application Module
import router from './router.js';
import HomeComponent from './components/HomeComponent.js';
import DashboardComponent from './components/DashboardComponent.js';
import ReferralComponent from './components/ReferralComponent.js';
import TransactionComponent from './components/TransactionComponent.js';

class App {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupRoutes();
                this.startApp();
            });
        } else {
            this.setupRoutes();
            this.startApp();
        }
    }

    setupRoutes() {
        // Register all routes with their components
        router.addRoute('/home', HomeComponent);
        router.addRoute('/dashboard', DashboardComponent);
        router.addRoute('/referral', ReferralComponent);
        router.addRoute('/transaction', TransactionComponent);
        
        // Default route
        router.addRoute('/', HomeComponent);
    }

    startApp() {
        // Reset body class
        document.body.className = '';
        
        // Start the router
        router.start();
        
        console.log('StarYield App initialized successfully!');
    }
}

// Initialize the application
new App();