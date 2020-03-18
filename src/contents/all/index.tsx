import * as React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';

import { Store } from 'webext-redux';
import { Provider } from 'react-redux';

import App from './components/app/App';

const proxyStore = new Store()

const anchor = document.createElement('div')
anchor.id = 'analogue-app'
anchor.setAttribute("style", "z-index: 2147483647; text-align: center; position: relative;")

document.body.appendChild(anchor)

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: "https://2254b974e6bb4177b281594f2df42553@sentry.io/5091616",
    // truncate the path manually before sending the event to make sure that sentry recognizes the files for the sourcemaps.
    // https://www.granderath.tech/sentry-browser-extension/
    beforeSend(event, hint) {
      if (event.exception) {
        event.exception.values[0].stacktrace.frames.forEach((frame) => {
          frame.filename = frame.filename.substring(frame.filename.lastIndexOf("/"))
        });
      }
      return event;
    }
  })

  // https://www.granderath.tech/sentry-browser-extension/
  // have to wrap it in a try catch
  try {
    ReactDOM.render(
      <Provider store={proxyStore}><App /></Provider>,
      document.getElementById('analogue-app')
    )
  } catch (e) {
    Sentry.captureEvent(e)
  }
} else {
  ReactDOM.render(
    <Provider store={proxyStore}><App /></Provider>,
    document.getElementById('analogue-app')
  )
}
