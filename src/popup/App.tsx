import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { hot } from 'react-hot-loader/root';

import './App.scss';

const App = () => {

  const show = useSelector(state => state.show);
  const dispatch = useDispatch();

  useEffect(() => {
    // component mount
    dispatch({ type: 'TOGGLE_MODAL', show: true })
    return () => {
      // component unmount
    }
  }, []);

  return (
    <div className="app">
      <h1 className="title" onClick={() => dispatch({ type: 'TOGGLE_MODAL' })}>Popup: {show ? "show" : "hide"}</h1>
    </div>
  )
}

export default hot(App);
