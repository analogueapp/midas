/*global chrome*/

import React, { useEffect, useState } from 'react';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import { useDispatch, useSelector } from "react-redux";
import { hot } from 'react-hot-loader/root';
import * as Sentry from '@sentry/browser';

import ContentPreview from '../content/ContentPreview/ContentPreview';
import Knots from '../knot/Knots/Knots';
import PrimerSelect from '../primer/PrimerSelect/PrimerSelect';
import LoginForm from './LoginForm';

import { Menu, Dropdown } from 'antd';
import { CloseOutlined, DownOutlined } from '@ant-design/icons';

import logo from '../../assets/img/logo.png';
import logoIcon from '../../assets/img/logo_icon.png';
import './App.scss';

const statusMessage = {
  pub: "Added",
  saved: "Saved for later",
  priv: "Added privately"
}

const App = () => {

  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [login, setLogin] = useState(false)

  const [content, setContent] = useState(null)
  const [log, setLog] = useState(null)
  const [knots, setKnots] = useState(null)

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
  }, [user, content, log, knots])


  useEffect(() => {
    if (user && show && !content) {
      chrome.runtime.sendMessage({ message: "parse_content" })
    }
    if (!show && content) {
      setContent(null)
    }
  }, [show])


  const updateLogStatus = target => {
    if (target.key == "delete") {
	      chrome.runtime.sendMessage({ message: "delete_log", id: log.id })
      setShow(false)
      setLog(null)
      setContent(null)
    }
    else {
      const newLog = { ...log, status: target.key }
      setLog(newLog)
      setMessage(statusMessage[target.key])
      chrome.runtime.sendMessage({ message: "log_update", log: newLog })
    }
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

    if (request.message === "auth_user_response") {
      dispatch({ type: 'SET_USER', user: request.body.user })
      setLogin(false)
      chrome.runtime.sendMessage({ message: "parse_content" })
    }

    if (request.message === "clicked_browser_action") {
      if (user) {
        setTimeout(() => {
          setShow(true)
        }, 111)
      } else {
        setLogin(true)
        setShow(true)
      }
    }

    if (request.message === "selection_to_knot") {
      createKnot(request.text.toString("html"), request.text)
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

    if (request.message === "get_knots_response") {
      setKnots(request.body.knots)
    }

    if (request.message === "create_knot_response") {
      setLoading(false)
      setKnots([request.body, ...knots])
    }

    if (request.message === "delete_knot_response") {
      setKnots(knots.filter(knot => knot.id !== request.body.id))
    }

    if (request.message === "edit_knot_response") {
      setKnots(knots.map(knot => {
        if (knot.id === request.body.id) {
          return {
            ...knot,
            ...request.body
          }
        }
        return knot;
      }))
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
              <>
                <div className={`analogueModal ${content ? "loaded" : ""}`} onClick={(e) => {
                  e.stopPropagation()
                }}>
                  {login
                    ? (
                      <>
                        <div className="analogueModalHeader login">

                        <a
                          target="_blank"
                          href={`${process.env.NODE_ENV === 'production' ? 'https://www.analogue.app' : 'http://localhost:3000'}`}
                        >
                          <img src={logo} className="logo" alt="Analogue"/>
                        </a>

                          <CloseOutlined
                            className="closeBtn"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setShow(false)
                            }}
                          />
                        </div>
                        <div className="loginForm">
                          <LoginForm />
                        </div>
                      </>
                    )
                    : (
                      <>
                        <div className="analogueModalHeader" id='analogueHeader'>

                          <img src={logoIcon} className="logo icon" alt="Analogue" />

                          <Dropdown
                            disabled={!log}
                            align={{offset: [-14, 15]}}
                            overlayClassName="dropdownStatusOverlay"
                            getPopupContainer={() => document.getElementById("analogueHeader")}
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
                                {log &&
                                  <Menu.Item key="delete">
                                    Delete
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

                        <ContentPreview content={content} user={user} />

                        <Knots
                          loading={loading}
                          log={log}
                          knots={knots}
                          primersHeight={primersHeight}
                          createKnot={createKnot}
                        />

                        {log &&
                          <PrimerSelect
                            log={log}
                            content={content}
                            updatePrimersHeight={updatePrimersHeight}
                          />
                        }
                      </>
                    )
                  }
                </div>
              </>
            )
          }
        }
        </FrameContextConsumer>
      </Frame>
    </div>
  )
}

export default hot(App);
