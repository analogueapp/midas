/*global chrome*/

import { createStore } from 'redux';
import rootReducer from './reducers';

import { wrapStore } from 'webext-redux';

import agent from './agent';

import logo from './assets/img/logo_icon.png';

const store = createStore(rootReducer, {})

var stream = require('getstream');

const injectContentScript = (message) => {
  // first, query to see if content script already exists in active tab
  // https://stackoverflow.com/a/42377997
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];

    chrome.tabs.sendMessage(activeTab.id, { message: "content_script_loaded?" }, (msg) => {

      if (chrome.runtime.lastError) {
        // programatically inject content script to active tab
        // this gets triggered when content_script doesn't exist on page
        // https://stackoverflow.com/questions/51732125/using-activetab-permissions-vs-all-urls
        // https://developer.chrome.com/extensions/content_scripts#programmatic
        // chrome.tabs.insertCSS(activeTab.id, { file: "css/all.css" })
        chrome.tabs.executeScript(activeTab.id, { file: "js/all.js", runAt: "document_end" }, () => {
          if (message) {
            chrome.tabs.sendMessage(activeTab.id, message)
          }
        })
        return
      } else {
        // trigger message to the active tab since already injected
        // msg.status === true
        if (message) {
          chrome.tabs.sendMessage(activeTab.id, message)
        }
      }
    })
  })
}

chrome.contextMenus.create({
  title: 'Add to Analogue',
  contexts: ["all"],
  onclick: function(info, tab) {
    // info.selectionText get's selection
    injectContentScript({ message: "clicked_browser_action" })
  }
})

chrome.browserAction.onClicked.addListener(function() {
  injectContentScript({ message: "clicked_browser_action" })
})

chrome.tabs.onActivated.addListener(function(activeInfo) {
  injectContentScript()
})

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
  if (changeInfo.status === "complete") {
    injectContentScript()
  }
})

// TODO, check analogue auth on startup
// chrome.runtime.onStartup.addListener(() => {
//   console.log('onStartup....')
// })

// middleware, can only listen for external messages in background page:
// https://stackoverflow.com/questions/18835452/chrome-extension-onmessageexternal-undefined
const authListener = (request) => {
  const user = request.user
  console.log("AUTH LISTENER CALLED", user)
  agent.setToken(request.user.token)
  sessionStorage.setItem("analogue-jwt", user.token)
  // connect to realtime updates via stream
  const client = stream.connect(
    user.streamKey,
    user.streamToken,
    user.streamId,
  );
  const notificationFeed = client.feed('notification', user.id.toString())
  notificationFeed.subscribe(streamCallback).then(streamSuccessCallback, streamFailCallback)

  // Send a message to the active tab to trigger redux store of token
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0]
    // must use openerTabId to get original tab that opened analogue login
    chrome.tabs.sendMessage(activeTab.openerTabId, request);
  })
}
chrome.runtime.onMessageExternal.addListener(authListener)

const streamCallback = (data) => {
  console.log("STREAMCALLBACK NOTIFICATION", data )
  // only make data call on new notifications, not delete
  if (data.new && data.new.length > 0) {
    agent.Activity.notify(data.new).then(
      res => {
        console.log("RESPONSE FROM ACTIVITY", res)
        const activity = res.activities[0];

        // create notification using analogueUrl as id
        // ids must be unique to trigger new notifications, so have to add uid to front of URL in case url is the same
        const generatedUid = [...Array(10)].map(i=>(~~(Math.random()*36)).toString(36)).join('')
        const analogueUrl = "https://www.analogue.app";
        var options = {
          type: "basic",
          iconUrl: logo,
          title: "Activity on Analogue",
          message: 'Rosemarie Tang (@rj) just liked your note "hey there I love joel here is a longer note, see how long it truncates for what is up gangs"',
        }

        chrome.notifications.create(generatedUid + analogueUrl, options, (notificationId) => {
          console.log("notification id", notificationId)
          console.log("Last error:", chrome.runtime.lastError);
        })
      }
    )
  }
}
const streamSuccessCallback = () => console.log('now listening to changes in realtime')
const streamFailCallback = data => console.log('realtime connnection failed', data)

// create a on Click listener for notifications
chrome.notifications.onClicked.addListener((notificationId) => {
  // remove uid from id to get analogue url
  chrome.tabs.create({url: notificationId.substring(10)})
});

// for avoid CORB call, use background and communicate with content script
// https://stackoverflow.com/questions/54786635/how-to-avoid-cross-origin-read-blockingcorb-in-a-chrome-web-extension
const messageListener = (request) => {
  if (request.message === "parse_content") {
    agent.setToken(sessionStorage.getItem("analogue-jwt"))
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      // Send a message to the active tab with server response
      agent.Contents.parse(activeTab.url).then(response => {
        chrome.tabs.sendMessage(activeTab.id, {message: "parse_content_response", body: response });
      })
    })
  }

  if (request.message === "log_update") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]

      // Send a message to the active tab
      agent.Logs.update(request.log).then(response => {
        chrome.tabs.sendMessage(activeTab.id, {message: "log_update_response", body: response });
      })
    })
  }

  if (request.message === "create_knot") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]

      // Send a message to the active tab
      agent.Knots.create(request.knot, request.log).then(response => {
        chrome.tabs.sendMessage(activeTab.id, {message: "create_knot_response", body: response });
      })
    })
  }

  if (request.message === "get_primers") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]

      // Send a message to the active tab
      agent.Auth.primers().then(response => {
        chrome.tabs.sendMessage(activeTab.id, {message: "get_primers_response", body: response });
      })
    })
  }

  if (request.message === "create_primer") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]

      // Send a message to the active tab
      agent.Primers.create({ title: request.title }).then(response => {
        chrome.tabs.sendMessage(activeTab.id, {message: "create_primer_response", body: response });
      })
    })
  }

  if (request.message === "update_primer") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]

      // Send a message to the active tab
      agent.Primers.updateLogs(request.primer.slug, request.log.id, request.remove).then(response => {
        chrome.tabs.sendMessage(activeTab.id, {message: "update_primer_response", body: response });
      })
    })
  }
}
chrome.runtime.onMessage.addListener(messageListener)

wrapStore(store);
