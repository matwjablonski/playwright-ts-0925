import { Component } from '../lib/Component';

export class Footer extends Component {
  constructor() {
    super();
  }

  render() {
    return this.createElement(
      'footer', 
      {
        class: 'footer',
      },
      [
        '<div class="container"><p>© 2025 Todo App</p></div>'
      ]);
  }
}
