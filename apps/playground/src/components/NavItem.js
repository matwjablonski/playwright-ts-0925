import { Component } from '../lib/Component';

export class NavItem extends Component {
  constructor(args) {
    super(args);
  }

  render() {
    return this.createElement(
      'a',
      { href: this.href, class: 'navbar-item' },
      [
        this.createElement(
          'span',
          {},
          [this.label]
        )
      ]
    );
  }
}
