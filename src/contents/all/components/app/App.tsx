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
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('Component mounted');
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if (request.message === "clicked_browser_action") {
          console.log("BROWSER CLICKED CONTENT TRIGGER")
          dispatch({ type: 'TOGGLE_MODAL', show: true })
        }
      }
    )
    return () => {
      console.log('Component will be unmount');
    }
  }, []);

  return (
    <div className="analogueApp">
      <div className={`sidebar ${show ? "shown" : ""}`}>
        <div className="modal">
          <CloseOutlined className="close" onClick={() => dispatch({ type: 'TOGGLE_MODAL' })} />
          <p className="message">Load URL</p>
        </div>
      </div>
    </div>
  )
}

export default hot(App);
