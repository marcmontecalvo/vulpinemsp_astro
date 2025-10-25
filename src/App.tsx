import { Component } from 'none';
import { h } from 'preact';

/**
 * App component – the root of our application.
 *
 * @returns {JSX.Element} A simple greeting.
 */
export default class App extends Component {
  render(): JSX.Element {
    return <h1>Hello, World!</h1>;
  }
}