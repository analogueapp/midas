/*global chrome*/

import React, { useEffect, useState } from 'react';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import { useDispatch, useSelector } from "react-redux";
import { hot } from 'react-hot-loader/root';

import ContentPreview from '../content/ContentPreview/ContentPreview';

import { Menu, Dropdown } from 'antd';
import { DownOutlined, CloseOutlined } from '@ant-design/icons';

import logo from './logo.png';
import './App.scss';

const statusMessage = {
  pub: "Added",
  saved: "Saved for later",
  priv: "Added privately"
}

const App = () => {

  const [show, setShow] = useState(false);
  const [content, setContent] = useState(null)
  const [log, setLog] = useState(null)
  const [message, setMessage] = useState("Adding...");

  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  // set message listener when component mounts
  useEffect(() => {
    chrome.runtime.onMessage.addListener(messageListener)

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
    }
  }, [user])


  useEffect(() => {
    if (user && show && !content) {
      chrome.runtime.sendMessage({ message: "parse_content" })
    }
    return
  }, [show])


  const updateLogStatus = target => {
    const newLog = Object.assign({}, content.log, { status: target.key })
    setLog(newLog)
    setMessage(statusMessage[target.key])
    chrome.runtime.sendMessage({ message: "log_update", log: newLog })
  }

  const messageListener = (request, sender, sendResponse) => {
    // sender.id is id of chrome extension

    if (request.message === "content_script_loaded?") {
      sendResponse({ status: true }) // respond to background page
    }

    if (request.message === "auth_user") {
      dispatch({ type: 'SET_USER_TOKEN', token: request.token })
    }

    if (request.message === "clicked_browser_action") {
      if (user) {
        setShow(true)
      } else {
        window.open(process.env.NODE_ENV === 'production' ? 'https://www.analogue.app/login' : 'http://localhost:3000/login', "_blank");
      }
    }

    if (request.message === "parse_content_response") {
      if (request.body.errors) {
        setMessage(request.body.message ? request.body.message : "We're having trouble with that URL . . . ")
      } else {
        setMessage(request.body.content.log && request.body.content.log.status
          ? statusMessage[request.body.content.log.status]
          : "Added"
        )
        setContent(request.body.content)
        setLog(request.body.content.log)
      }
    }


    if (request.message === "log_update_response") {
      setMessage(request.body.log && request.body.log.status
        ? statusMessage[request.body.log.status]
        : "Added"
      )
      setLog(request.body.log)
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        width: "0",
        height: "0",
        top: "0",
        right: "0",
        zIndex: 2147483647,
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "0",
          right: "0",
          bottom: "0",
          left: "0",
          zIndex: 2147483647,
          transition: "transform 100ms cubic-bezier(0, 0, 0, 1) 0s, visibility 100ms ease 0s",
          willChange: "transform, visibility",
          visibility: show ? "visible" : "hidden",
          transform: show ? "translateX(0)" : "translateX(464px)",
          opacity: show ? "1" : "0",
        }}
      >
        <Frame
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            border: "none"
          }}
          head={[<link type="text/css" rel="stylesheet" href={chrome.runtime.getURL("/css/all.css")}></link>]}
        >
         <FrameContextConsumer>
         {
           // Callback is invoked with iframe's window and document instances
           ({document, window}) => {
              // Render Children
              return (
                <div className="analogue-mask" onClick={() => setShow(false)}>
                  <div className="analogue-fixed-sidebar">
                    <div className="analogue-modal" onClick={(e) => {
                      e.stopPropagation()
                    }}>
                      <CloseOutlined
                        className="closeBtn"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setShow(false)
                        }}
                      />

                      <img src={logo} className="logo" alt="Analogue Icon" />

                      <Dropdown
                        disabled={!log}
                        align={{offset: [-14, 15]}}
                        overlayClassName="dropdownStatusOverlay"
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        overlay={
                          <Menu onClick={updateLogStatus}>
                            {log && log.status !== "pub" &&
                              <Menu.Item key="pub">
                                Add to library
                              </Menu.Item>
                            }
                            {log && log.status !== "saved" &&
                              <Menu.Item key="saved">
                                Save for later
                              </Menu.Item>
                            }
                            {log && log.status !== "priv" &&
                              <Menu.Item key="priv">
                                Add privately
                              </Menu.Item>
                            }
                          </Menu>
                        }
                      >
                        <div className="dropdownStatus">
                          {message}
                          {log && <DownOutlined /> }
                        </div>
                      </Dropdown>

                      <ContentPreview content={content} />

                      <div className="addNote">
                        Add a note
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          }
          </FrameContextConsumer>
        </Frame>
      </div>
    </div>
  )
}

export default hot(App);
