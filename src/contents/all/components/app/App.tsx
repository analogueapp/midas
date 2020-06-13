/*global chrome*/

import React, { useEffect, useState } from 'react';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import { useDispatch, useSelector } from "react-redux";
import { hot } from 'react-hot-loader/root';
import * as Sentry from '@sentry/browser';

import ContentPreview from '../content/ContentPreview/ContentPreview';
import Knots from '../knot/Knots/Knots';
import PrimerSelect from '../primer/PrimerSelect/PrimerSelect';

import { Menu, Dropdown } from 'antd';
import { CloseOutlined, DownOutlined } from '@ant-design/icons';

import logo from '../../assets/img/logo_icon.png';
import './App.scss';

const statusMessage = {
  pub: "Added",
  saved: "Saved for later",
  priv: "Added privately"
}

const App = () => {

  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const [content, setContent] = useState(null)
  const [log, setLog] = useState(null)

  const [message, setMessage] = useState("Loading...");

  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [primersHeight, setPrimersHeight] = useState(0)
  const updatePrimersHeight = (height: number) => setPrimersHeight(height)

  // set message listener when component mounts
  useEffect(() => {
    chrome.runtime.onMessage.addListener(messageListener)

    if (user && process.env.NODE_ENV === 'production') {
      // set sentry scope
      Sentry.configureScope((scope) => {
        scope.setUser({
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          username: user.username
        });
      });
    }

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
    }
  }, [user, content, log])


  useEffect(() => {
    if (user && show && !content) {
      chrome.runtime.sendMessage({ message: "parse_content" })
    }
    return
  }, [show])


  const updateLogStatus = target => {
    const newLog = { ...log, status: target.key }
    setLog(newLog)
    setMessage(statusMessage[target.key])
    chrome.runtime.sendMessage({ message: "log_update", log: newLog })
  }

  const createKnot = (bodyHtml, bodyText) => {
    setLoading(true)
    chrome.runtime.sendMessage({
      message: "create_knot",
      log: log,
      knot: {
        body: bodyHtml,
        bodyText: bodyText
      }
    })
  }

  const messageListener = (request, sender, sendResponse) => {
    // sender.id is id of chrome extension

    if (request.message === "content_script_loaded?") {
      sendResponse({ status: true }) // respond to background page
    }

    if (request.message === "auth_user") {
      dispatch({ type: 'SET_USER', user: request.user })
    }

    if (request.message === "clicked_browser_action") {
      if (user) {
        setTimeout(() => {
          setShow(true)
        }, 111)
      } else {
        window.open(process.env.NODE_ENV === 'production' ? 'https://www.analogue.app/login' : 'http://localhost:3000/login', "_blank");
      }
    }

    if (request.message === "parse_content_response") {
      if (request.body.errors) {
        setMessage(request.body.message ? request.body.message : "We're having trouble with that URL . . . ")
      } else {
        setMessage(request.body.log && request.body.log.status
          ? statusMessage[request.body.log.status]
          : "Added"
        )
        setContent(request.body.content)
        setLog(request.body.log)
      }
    }

    // optional for response from log_update
    // if (request.message === "log_update_response") {
    //   setMessage(request.body.log && request.body.log.status
    //     ? statusMessage[request.body.log.status]
    //     : "Added"
    //   )
    //   setLog(request.body.log)
    // }

    if (request.message === "create_knot_response") {
      setLoading(false)
      setLog({
        ...log,
        knots: [request.body, ...log.knots]
      })
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        width: "400px",
        right: "21px",
        top: "21px",
        zIndex: 2147483647,
        willChange: "transform",
        transform: show ? "translateX(0)" : "translateX(421px)",
        transition: "transform 0.21s ease-in-out",
      }}
    >
      <Frame
        style={{
          width: "100%",
          height: "100vh",
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
              <div className={`analogueModal ${content ? "loaded" : ""}`} onClick={(e) => {
                e.stopPropagation()
              }}>

                <div className="analogueModalHeader">

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

                  <CloseOutlined
                    className="closeBtn"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setShow(false)
                    }}
                  />
                </div>

                <ContentPreview content={content} />

                <Knots
                  show={show}
                  loading={loading}
                  log={log}
                  knots={log ? log.knots : []}
                  createKnot={createKnot}
                  primersHeight={primersHeight}
                />

                {log &&
                  <PrimerSelect
                    log={log}
                    content={content}
                    updatePrimersHeight={updatePrimersHeight}
                  />
                }
              </div>
            )
          }
        }
        </FrameContextConsumer>
      </Frame>
    </div>
  )
}

export default hot(App);
