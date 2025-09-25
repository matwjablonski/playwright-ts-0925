import { Component } from '../lib/Component';
import { Nav } from './Nav';

export class Header extends Component {
  constructor() {
    super();
  }

  render() {
    return this.createElement('header', {}, [
      new Nav()
    ]);
  }
}
