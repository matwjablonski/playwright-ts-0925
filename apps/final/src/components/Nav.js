import { Component } from '../lib/Component';
import { NavItem } from './NavItem';

export class Nav extends Component {
  constructor() {
    super();
    
    this.handleLogout = this.handleLogout.bind(this);
    this.handleNavigation = this.handleNavigation.bind(this);
  }

  afterServicesInjected() {
    // Component is ready after services are injected
  }

  handleLogout() {
    if (confirm('Czy na pewno chcesz się wylogować?')) {
      this.services.AuthService.logout();
      // Navigate to login instead of reload
      this.services.RouterService.navigate('/', true);
      window.location.reload();
    }
  }

  handleNavigation(path) {
    if (this.services.RouterService) {
      this.services.RouterService.navigate(path);
    } else {
      window.location.hash = path;
    }
  }

  render() {
    return this.createElement(
      'div',
      { class: 'container mb-4' },
      [
        this.createElement('nav', { class: 'navbar'}, [
          this.createElement('div', { class: 'navbar-menu' }, [
            this.createElement('div', { class: 'navbar-start' }, [
              // Create navigation links manually to use router
              this.createElement(
                'a',
                { 
                  class: 'navbar-item',
                  href: '#/',
                  onClick: (event) => {
                    event.preventDefault();
                    this.handleNavigation('/');
                  }
                },
                ['📋 Todo App']
              ),
              this.createElement(
                'a',
                { 
                  class: 'navbar-item',
                  href: '#/',
                  onClick: (event) => {
                    event.preventDefault();
                    this.handleNavigation('/');
                  }
                },
                ['Strona główna']
              ),
              this.createElement(
                'a',
                { 
                  class: 'navbar-item',
                  href: '#/about',
                  onClick: (event) => {
                    event.preventDefault();
                    this.handleNavigation('/about');
                  }
                },
                ['O aplikacji']
              ),
            ]),
            this.createElement('div', { class: 'navbar-end' }, [
              this.createElement('div', { class: 'navbar-item' }, [
                this.createElement(
                  'button',
                  {
                    class: 'button is-light is-small',
                    onClick: this.handleLogout,
                    title: 'Wyloguj się'
                  },
                  ['🚪 Wyloguj']
                )
              ])
            ])
          ])
        ])
      ]
    );
  }
}
