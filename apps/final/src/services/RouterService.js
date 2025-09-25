import { Service } from '../lib/Service';

export class RouterService extends Service {
  constructor(services) {
    super(services);
    
    this.routes = new Map();
    this.currentRoute = null;
    this.guards = [];
    this.defaultRoute = '/';
    
    // Bind methods
    this.handleHashChange = this.handleHashChange.bind(this);
    
    // Listen for hash changes
    window.addEventListener('hashchange', this.handleHashChange);
    
    // Handle initial load
    this.handleHashChange();
  }

  /**
   * Register a route with its component and optional configuration
   * @param {string} path - Route path (e.g., '/', '/about', '/todos')
   * @param {Function} component - Component class to render
   * @param {Object} options - Route options (requiresAuth, title, etc.)
   */
  registerRoute(path, component, options = {}) {
    this.routes.set(path, {
      component,
      requiresAuth: options.requiresAuth || false,
      title: options.title || '',
      beforeEnter: options.beforeEnter || null
    });
  }

  /**
   * Register multiple routes at once
   * @param {Object} routesConfig - Object with path: {component, options} mapping
   */
  registerRoutes(routesConfig) {
    Object.keys(routesConfig).forEach(path => {
      const config = routesConfig[path];
      this.registerRoute(path, config.component, config.options || {});
    });
  }

  /**
   * Add a global route guard
   * @param {Function} guard - Function that returns true/false or redirect path
   */
  addGuard(guard) {
    this.guards.push(guard);
  }

  /**
   * Navigate to a specific route
   * @param {string} path - Target path
   * @param {boolean} replace - Replace current history entry instead of pushing new one
   */
  navigate(path, replace = false) {
    if (replace) {
      window.location.replace(`${window.location.pathname}#${path}`);
    } else {
      window.location.hash = path;
    }
  }

  /**
   * Get current route path from hash
   * @returns {string} Current route path
   */
  getCurrentPath() {
    const hash = window.location.hash.slice(1); // Remove #
    return hash || this.defaultRoute;
  }

  /**
   * Handle hash change events
   */
  handleHashChange() {
    const newPath = this.getCurrentPath();
    
    // Run global guards
    for (const guard of this.guards) {
      const guardResult = guard(newPath, this.currentRoute);
      
      if (guardResult === false) {
        // Guard blocked navigation, stay on current route
        return;
      }
      
      if (typeof guardResult === 'string') {
        // Guard redirected to different route
        this.navigate(guardResult, true);
        return;
      }
    }
    
    // Check if route exists
    const route = this.routes.get(newPath);
    
    if (!route) {
      this.navigate(this.defaultRoute, true);
      return;
    }

    // Check route-specific auth requirement
    if (route.requiresAuth && !this.isAuthenticated()) {
      this.navigate('/', true);
      return;
    }

    // Run route-specific beforeEnter guard
    if (route.beforeEnter) {
      const result = route.beforeEnter(newPath, this.currentRoute);
      
      if (result === false) {
        return;
      }
      
      if (typeof result === 'string') {
        this.navigate(result, true);
        return;
      }
    }

    // Update current route
    const previousRoute = this.currentRoute;
    this.currentRoute = newPath;

    // Update page title if specified
    if (route.title) {
      document.title = `Todo App - ${route.title}`;
    }

    // Notify subscribers about route change
    this.onRouteChange(newPath, previousRoute, route);
  }

  /**
   * Check if user is authenticated (uses AuthService if available)
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.AuthService ? this.AuthService.isAuthenticated() : true;
  }

  /**
   * Override this method to handle route changes
   * @param {string} newPath - New route path
   * @param {string} previousPath - Previous route path
   * @param {Object} route - Route configuration object
   */
  onRouteChange(newPath, previousPath, route) {
    // This should be overridden or handled via events
  }

  /**
   * Set the default route
   * @param {string} path - Default route path
   */
  setDefaultRoute(path) {
    this.defaultRoute = path;
  }

  /**
   * Get route configuration for a path
   * @param {string} path - Route path
   * @returns {Object|null} Route configuration or null if not found
   */
  getRoute(path) {
    return this.routes.get(path) || null;
  }

  /**
   * Get all registered routes
   * @returns {Map} All routes map
   */
  getAllRoutes() {
    return new Map(this.routes);
  }

  /**
   * Check if a route exists
   * @param {string} path - Route path
   * @returns {boolean}
   */
  routeExists(path) {
    return this.routes.has(path);
  }

  /**
   * Cleanup - remove event listeners
   */
  destroy() {
    window.removeEventListener('hashchange', this.handleHashChange);
  }
};