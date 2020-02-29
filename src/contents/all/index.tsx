import * as React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import App from './components/app/App';
import './style.scss';

const anchor = document.createElement('div');
anchor.id = 'analogue-app';

document.body.appendChild(anchor);

ReactDOM.render(
    <HashRouter>
        <App />
    </HashRouter>,
    document.getElementById('analogue-app')
);

// import React from 'react';
// // import {render} from 'react-dom';
// // import {Provider} from 'react-redux';
// // import {Store} from 'webext-redux';
//
// import App from './components/app/App';
// import './style.scss';
//
// // const proxyStore = new Store();
//
// const anchor = document.createElement('div');
// anchor.id = 'rcr-anchor';
//
// document.body.insertBefore(anchor, document.body.childNodes[0]);
//
// proxyStore.ready().then(() => {
//   render(
//     <Provider store={proxyStore}>
//       <App/>
//     </Provider>
//    , document.getElementById('rcr-anchor'));
// });
