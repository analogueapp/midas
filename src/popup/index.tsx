import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import './App.scss';

import { Store } from 'webext-redux';
import { Provider } from 'react-redux';

const proxyStore = new Store();

ReactDOM.render(
  <Provider store={proxyStore}><App /></Provider>,
  document.getElementById('root')
)
