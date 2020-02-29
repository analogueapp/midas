import React, {Component} from 'react';
import { hot } from 'react-hot-loader/root';

import './App.scss';

class App extends Component {

  componentDidMount() {
    // chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    //   console.log(tabs)
    // });
  }

  render() {
    return (
      <div className="app">
        <h1 className="title">popup page component</h1>
      </div>
    )
  }
}

export default hot(App);
