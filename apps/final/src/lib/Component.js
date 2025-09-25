export class Component {
  component;
  asyncActions = [];

  constructor(args = {}) {
    this.assignArguments(args);

    this.component = this.render();

    const asyncActions = this.getAsyncActions();

    Promise.all(asyncActions.map(fn => fn.call(this))).then(() => {
      this.#rerender();
    });
  }

  injectServices(services) {
    this.services = services;

    this.afterServicesInjected?.();
  }

  subscribeStore(keyInStore, keyInComponent = keyInStore, defaultValue = []) {
    this.services.DataStoreService.subscribe(keyInStore, () => {
      this[keyInComponent] = this.services.DataStoreService.get(keyInStore);
      this.onArgChange('data', this[keyInComponent]);
    });

    if (this.services.DataStoreService.has(keyInStore)) {
      this[keyInComponent] = this.services.DataStoreService.get(keyInStore);
    } else {
      this[keyInComponent] = defaultValue;
    }
  }

  #rerender() {
    const oldComponent = this.component;
    const parent = oldComponent?.parentNode;
    const nextSibling = oldComponent?.nextSibling;

    if (oldComponent) {
      oldComponent.remove();
    };

    this.component = this.render();

    if (parent) {
      if (nextSibling) {
        parent.insertBefore(this.component, nextSibling);
      } else {
        parent.appendChild(this.component);
      }
    }
  }

  getAsyncActions() {
    return [];
  }

  createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);

    Object.keys(attributes).forEach(key => {
      const value = attributes[key];

      if (key.startsWith('on')) {
        const eventHandler = typeof attributes[key] === 'function' ? attributes[key] : attributes[key].bind(this);
        element.addEventListener(key.substring(2).toLowerCase(), eventHandler);
      } else if (value === null || value === undefined) {
        // Skip setting attributes that are null or undefined
      } else if (value === true) {
        element.setAttribute(key, '');
      } else if (key === 'value' && (tag === 'select' || tag === 'input' || tag === 'textarea')) {
        // Set value as DOM property for form elements
        element.value = attributes[key];
      } else {
        element.setAttribute(key, attributes[key]);
      }
    });

    if (Array.isArray(children)) {
      children.forEach(child => {
        if (child instanceof Component) {
          if (this.services && typeof child.injectServices === 'function') {
            child.injectServices(this.services);
          }

          element.appendChild(child.component);
        } else if (typeof child === 'string') {
          element.innerHTML += child;
        } else if (child instanceof HTMLElement) {
          element.appendChild(child);
        } else if (child === undefined) {
          // Skip undefined children
        } else {
          console.warn('Child is not a valid Component or string:', child);
        }
      });
    }

    // Set value for select elements after children are added
    if (tag === 'select' && attributes.value !== undefined) {
      element.value = attributes.value;
    }

    return element;
  }

  assignArguments(args) {
    Object.keys(args).forEach(key => {
      this[key] = args[key];
    });
  }

  onArgChange(key, newValue) {
    // If key is a function (callback), call it with newValue
    if (typeof this[key] === 'function') {
      this[key](newValue);
    } else {
      // Otherwise set as property and rerender
      this[key] = newValue;
      this.#rerender();
    }
  }

  rerender() {
    this.#rerender();
  }

  render() {
    const element = document.createElement('div');
    element.className = 'component';
    element.innerHTML = '<p>Default Component</p>';
    
    return element;
  }
}
