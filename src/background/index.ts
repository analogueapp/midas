/*global chrome*/

import { createStore } from 'redux';
import rootReducer from './reducers';

import { wrapStore } from 'webext-redux';

import agent from './agent';

const store = createStore(rootReducer, {});

chrome.browserAction.onClicked.addListener(function() {
  // Send a message to the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {message: "clicked_browser_action"});
  })
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

// for avoid CORB call, use background and communicate with content script
// https://stackoverflow.com/questions/54786635/how-to-avoid-cross-origin-read-blockingcorb-in-a-chrome-web-extension
const messageListener = (request) => {
  if (request.message === "parse_content") {
    agent.Contents.parse(request.url).then(response => {
      
      // Send a message to the active tab
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {message: "parse_content_response", body: response });
      })

    })
  }
}
chrome.runtime.onMessage.addListener(messageListener)

wrapStore(store);
