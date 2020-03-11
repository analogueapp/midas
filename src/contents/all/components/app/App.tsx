/*global chrome*/

import React, { useEffect, useState } from 'react';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import { useDispatch, useSelector } from "react-redux";
import { hot } from 'react-hot-loader/root';

import ContentPreview from '../content/ContentPreview/ContentPreview';

import { Menu, Dropdown } from 'antd';
import { DownOutlined, CloseOutlined, CheckCircleOutlined, ClockCircleOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';

import './App.scss';

const statusMap = {
  pub: { message: "Added", icon: <CheckCircleOutlined /> },
  saved: { message: "Saved for later", icon: <ClockCircleOutlined /> },
  priv: { message: "Added (private)", icon: <LockOutlined /> }
}

const App = () => {

  const [show, setShow] = useState(false);
  const [content, setContent] = useState(null)
  const [message, setMessage] = useState("Adding");

  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

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
          ? statusMap[request.body.content.log.status].message
          : "Added"
        )
        setContent(request.body.content)
      }
    }
  }

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

                      <Dropdown
                        disabled={!content}
                        align={{offset: [0, 10]}}
                        overlayClassName="dropdownStatusOverlay"
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        overlay={
                          <Menu>
                            {content && content.log && content.log.status !== "pub" &&
                              <Menu.Item>
                                <CheckCircleOutlined /> Add to library
                              </Menu.Item>
                            }
                            {content && content.log && content.log.status !== "saved" &&
                              <Menu.Item>
                                <ClockCircleOutlined /> Save for later
                              </Menu.Item>
                            }
                            {content && content.log && content.log.status !== "priv" &&
                              <Menu.Item>
                                <LockOutlined /> Make private
                              </Menu.Item>
                            }
                          </Menu>
                        }
                      >
                        <div className="dropdownStatus">
                          {content && content.log && content.log.status
                            ? statusMap[content.log.status].icon
                            : <LoadingOutlined />
                          }
                          {message}
                          {content && content.log && <DownOutlined /> }
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
