/*global chrome*/

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { hot } from 'react-hot-loader/root';

import {
  CloseOutlined
} from '@ant-design/icons';

import './App.scss';

const App = () => {

  const show = useSelector(state => state.show);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const browserActionListener = (request, sender) => {
    // sender.id is id of chrome extension
    console.log("BROWSER ACTION LISTENER CALLED", request)
    console.log("USER", user)
    console.log('ext id', sender.id)
    if (request.message === "clicked_browser_action") {
      if (!user && !user.token) {
        window.open("http://localhost:3000/login", "_blank");
      }
      dispatch({ type: 'TOGGLE_MODAL', show: true })
    }
  }

  const authListener = (request) => {
    console.log("AUTH LISTENER CALLED", request)
    if (request.message === "auth_user") {
      dispatch({ type: 'SET_USER_TOKEN', token: request.token })
    }
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener(browserActionListener)
    chrome.runtime.onMessage.addListener(authListener)

    return () => {
      chrome.runtime.onMessage.removeListener(browserActionListener)
      chrome.runtime.onMessage.removeListener(authListener)
    }
  }, [user]);

  return (
    <div
      className={`analogue-mask ${show ? "shown" : ""}`}
      onClick={show ? () => dispatch({ type: 'TOGGLE_MODAL' }) : () => {}}
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
              dispatch({ type: 'TOGGLE_MODAL' })
            }}
          />
          <p className="message">Load URL: {user ? user.token : "no token"}</p>
        </div>
      </div>
    </div>
  )
}

export default hot(App);
