// Simple client-side router
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        this.init();
    }

    // Add a route
    addRoute(path, component) {
        this.routes[path] = component;
    }

    // Navigate to a route
    navigate(path) {
        // Update URL without page reload
        window.history.pushState({}, '', path);
        this.loadRoute(path);
    }

    // Load the current route
    loadRoute(path = window.location.pathname) {
        // Default to home if no path
        if (path === '/' || path === '') {
            path = '/home';
        }

        const component = this.routes[path];
        if (component) {
            this.currentRoute = path;
            const appContainer = document.getElementById('app');
            if (appContainer) {
                appContainer.innerHTML = component.render();
                // Call component's mount method if it exists
                if (component.mount) {
                    component.mount();
                }
            }
        } else {
            // 404 - default to home
            this.navigate('/home');
        }
    }

    // Initialize router
    init() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.loadRoute();
        });

        // Handle clicks on navigation links
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-route]')) {
                e.preventDefault();
                const route = e.target.getAttribute('data-route');
                this.navigate(route);
            }
        });
    }

    // Start the router
    start() {
        this.loadRoute();
    }
}

// Export router instance
window.router = new Router();
export default window.router;