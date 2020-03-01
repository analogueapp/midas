/*global chrome*/

import { createStore } from 'redux';
import rootReducer from './reducers';

import { wrapStore } from 'webext-redux';

const store = createStore(rootReducer, {});

chrome.browserAction.onClicked.addListener(function() {
  // Send a message to the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {message: "clicked_browser_action"});
  });
});

// middleware, can only listen for external messages in background page:
// https://stackoverflow.com/questions/18835452/chrome-extension-onmessageexternal-undefined
const authListener = (request) => {
  // Send a message to the active tab to trigger redux store of token
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, request);
  })
}
chrome.runtime.onMessageExternal.addListener(authListener)

wrapStore(store);
