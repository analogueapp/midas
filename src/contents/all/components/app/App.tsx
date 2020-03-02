/*global chrome*/

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { hot } from 'react-hot-loader/root';

import ContentPreview from '../content/ContentPreview/ContentPreview';

import {
  CloseOutlined
} from '@ant-design/icons';

import logo from './logo.png';

import './App.scss';

const App = () => {

  const [show, setShow] = useState(false);
  const [content, setContent] = useState(null)
  const [message, setMessage] = useState("Adding...");

  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const messageListener = (request) => {
    // sender.id is id of chrome extension
    if (request.message === "clicked_browser_action") {
      if (!user) {
        window.open(process.env.NODE_ENV === 'production' ? 'https://www.analogue.app/login' : 'http://localhost:3000/login', "_blank");
      } else {
        setShow(true)
      }
    }

    if (request.message === "auth_user") {
      dispatch({ type: 'SET_USER_TOKEN', token: request.token })
      sessionStorage.setItem("analogue-jwt", request.token)
    }

    if (request.message === "parse_content_response") {
      if (request.body.errors) {
        setMessage(request.body.message ? request.body.message : "We're having trouble with that URL . . . ")
      } else {
        setMessage("Added")
        setContent(request.body.content)
      }
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


  useEffect(() => {
    if (user && show && !content) {
      chrome.runtime.sendMessage({
        message: "parse_content",
        token: user,
        url: window.location.href,
      })
    }
    return
  }, [show])

  return (
    <div
      className={`analogue-mask ${show ? "shown" : ""}`}
      onClick={() => setShow(false)}
    >
      <div className="analogue-sidebar">
        <div className="analogue-modal" onClick={(e) => {
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
          <img src={logo} className="logo" alt="Analogue Icon" />
          <p className="message">{message}</p>
          <ContentPreview content={content} />
        </div>
      </div>
    </div>
  )
}

export default hot(App);
