export class Service {
  constructor(services = {}) {
    if (services && typeof services === 'object') {
      Object.keys(services).forEach(serviceName => {
        this[serviceName] = services[serviceName];
      });
    }
  }
  
  injectServices(services) {
    if (services && typeof services === 'object') {
      Object.keys(services).forEach(serviceName => {
        this[serviceName] = services[serviceName];
      });
    }
  }
}
