/*global chrome*/

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { hot } from 'react-hot-loader/root';

import {
  CloseOutlined
} from '@ant-design/icons';

import './App.scss';

const App = () => {

  const [show, setShow] = useState(false);

  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const messageListener = (request) => {
    // sender.id is id of chrome extension
    if (request.message === "clicked_browser_action") {
      if (!user) {
        window.open("http://localhost:3000/login", "_blank");
      } else {
        setShow(true)
      }
    }

    if (request.message === "auth_user") {
      dispatch({ type: 'SET_USER_TOKEN', token: request.token })
      sessionStorage.setItem("analogue-jwt", request.token)
    }
  }

  // detect icon click and auth
  useEffect(() => {
    chrome.runtime.onMessage.addListener(messageListener)
    const token = sessionStorage.getItem("analogue-jwt")

    if (token) {
      dispatch({ type: 'SET_USER_TOKEN', token: token })
      sessionStorage.setItem("analogue-jwt", token)
    }

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
    }
  }, [user])

  return (
    <div
      className={`analogue-mask ${show ? "shown" : ""}`}
      onClick={() => setShow(false)}
    >
      <div className="analogue-sidebar">
        <div className="analogue-modal" onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}>
          <CloseOutlined
            className="close"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShow(false)
            }}
          />
          <p className="message">Load URL: {user ? user.token : "no token"}</p>
        </div>
      </div>
    </div>
  )
}

export default hot(App);
