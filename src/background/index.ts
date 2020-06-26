/*global chrome*/
import { createStore } from 'redux';
import rootReducer from './reducers';

import { wrapStore } from 'webext-redux';

import agent from './agent';
import { verbWords, objectWords, getDataUri } from './utils/activity';

import * as logo from './assets/img/logo_icon.png';

const rootUrl = process.env.NODE_ENV === 'production' ? 'https://www.analogue.app' : 'http://localhost:3000'

const store = createStore(rootReducer, {})

var stream = require('getstream');

const injectContentScript = (message = null) => {
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

//keyboard shortcut: triggers browser action

chrome.commands.onCommand.addListener(function(command) {
  injectContentScript({ message: "clicked_browser_action" })
});

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
  console.log("newAuth")
  const user = request.user
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

// chrome.runtime.onMessageExternal.addListener(authListener)

if (!sessionStorage.getItem("analogue-jwt")) {
  console.log("!session")
  chrome.runtime.onMessageExternal.addListener(authListener)
}

const streamCallback = (data) => {

  // only make data call on new notifications, not delete
  if (data.new && data.new.length > 0) {

    agent.Activity.notify(data.new).then(
      res => {

        const activity = res.activities[0];

        // create notification object from activity
        const title = `${activity.user.name} (@${activity.user.username}) ${activity.activity.notify_owner
                  ? "replied in your note"
                  : `${verbWords[activity.activity.verb]} ${activity.activity.verb === "Mention" ? objectWords["Mention"] : activity.activity.verb === "Add" ? activity.primer.title : objectWords[activity.objectType]}` }`

        const message = activity.response
          ? activity.response.body
          : activity.activity.verb === "Like" && activity.objectType === "Response"
            ? activity.object.body
            : activity.activity.verb === "Like" && activity.objectType === "Knot"
              ? activity.object.bodyText
              : activity.activity.verb === "Add" || activity.activity.verb === "Log" && activity.log && activity.log.content
                ? activity.log.content.title
                : "View their profile on Analogue"

        const notificationUrl = activity.log && activity.log.content
          ? `/${activity.log.content.formSlug}/${activity.log.content.slug}/@${activity.log.user.username}`
          : `/@${activity.user.username}`

        // url is id of notification for onClick anchor
        // ids must be unique to trigger new notifications, so have to add uid to front of URL in case url is the same
        const generatedUid = [...Array(10)].map(i=>(~~(Math.random()*36)).toString(36)).join('')

        // if not follow, fetch data URI of image
        // can only accept dataUri or local resources
        // https://stackoverflow.com/a/44487435

        if (activity.log && activity.log.content && activity.log.content.imageUrl) {

          getDataUri(`${activity.log.content.imageUrl}`, function(dataUri) {
            var options = {
              type: "basic",
              title: title,
              message: message,
              iconUrl: dataUri,
            }

            chrome.notifications.create(generatedUid + rootUrl + notificationUrl, options, (notificationId) => {

            })
          })
        } else {
          var options = {
            type: "basic",
            title: title,
            message: message,
            iconUrl: logo,
          }
          chrome.notifications.create(generatedUid + rootUrl + notificationUrl, options, (notificationId) => {

          })
        }
      }
    )
  }
}
const streamSuccessCallback = () => console.log('now listening to changes in realtime')
const streamFailCallback = data => console.log('realtime connnection failed', data)

// create a onClick listener for notifications
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

  if (request.message === "delete_log") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]

      // Send a message to the active tab
      agent.Logs.delete(request.log).then(response => {
        chrome.tabs.sendMessage(activeTab.id, {message: "delete_log_response", body: response });
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
