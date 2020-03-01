import * as React from 'react';
import ReactDOM from 'react-dom';

import { Store } from 'webext-redux';
import { Provider } from 'react-redux';

import App from './components/app/App';
import './index.scss';

const proxyStore = new Store();

const anchor = document.createElement('div');
anchor.id = 'analogue-app';

document.body.appendChild(anchor);

ReactDOM.render(
  <Provider store={proxyStore}><App /></Provider>,
  document.getElementById('analogue-app')
)
