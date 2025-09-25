import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoginForm } from './components/LoginForm';
import { TodosList } from './components/TodosList';
import { About } from './components/About';
import './style.css'
import 'bulma/css/bulma.css';
import { DataStoreService } from './services/DataStoreService';
import { TodosService } from './services/TodosService';
import { AuthService } from './services/AuthService';
import { RouterService } from './services/RouterService';

const app = document.getElementById('app');

// Initialize services - create empty object first
const services = {};

// Create service instances
services.DataStoreService = new DataStoreService(services);
services.TodosService = new TodosService(services);  
services.AuthService = new AuthService(services);
services.RouterService = new RouterService(services);

// Inject services into each service (for any late binding)
Object.values(services).forEach(service => {
  if (service.injectServices) {
    service.injectServices(services);
  }
});

// Current page component
let currentPageComponent = null;

// Register routes
services.RouterService.registerRoutes({
  '/': {
    component: TodosList,
    options: {
      requiresAuth: true,
      title: 'Lista zadań'
    }
  },
  '/about': {
    component: About,
    options: {
      requiresAuth: true,
      title: 'O aplikacji'
    }
  }
});

// Add authentication guard
services.RouterService.addGuard((newPath, currentPath) => {
  const route = services.RouterService.getRoute(newPath);
  
  if (route && route.requiresAuth && !services.AuthService.isAuthenticated()) {
    // User not authenticated but route requires auth - show login
    showLoginForm();
    return false; // Block navigation
  }
  
  return true; // Allow navigation
});

// Override onRouteChange to handle component rendering
services.RouterService.onRouteChange = (newPath, previousPath, route) => {
  if (services.AuthService.isAuthenticated()) {
    renderPageWithLayout(route.component);
  }
};

function renderPageWithLayout(PageComponent) {
  // Clear app content first
  app.innerHTML = '';
  
  // Create main app container
  const appContainer = document.createElement('div');
  appContainer.className = 'app';
  
  // Create header
  const header = new Header();
  header.injectServices(services);
  appContainer.appendChild(header.component);
  
  // Create page component
  if (currentPageComponent) {
    // Clean up previous component if needed
    currentPageComponent = null;
  }
  
  currentPageComponent = new PageComponent();
  currentPageComponent.injectServices(services);
  appContainer.appendChild(currentPageComponent.component);
  
  // Create footer
  const footer = new Footer();
  footer.injectServices(services);
  appContainer.appendChild(footer.component);
  
  // Append to app
  app.appendChild(appContainer);
}

function showLoginForm() {
  // Clear app content
  app.innerHTML = '';
  
  // Create login form with callback
  const loginForm = new LoginForm({
    onLoginSuccess: () => {
      // Force router to handle current route since user is now authenticated
      services.RouterService.handleHashChange();
    }
  });
  
  // Inject services
  loginForm.injectServices(services);
  
  // Append to app
  app.appendChild(loginForm.component);
}

// Initialize the application
function initApp() {
  if (services.AuthService.isAuthenticated()) {
    // User is authenticated, let router handle the route
    // Router will automatically handle current hash on initialization
  } else {
    // User is not authenticated, show login form
    showLoginForm();
  }
}

// Start the application
initApp();
