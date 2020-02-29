import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { hot } from 'react-hot-loader/root';

import './App.scss';

const App = () => {

  const show = useSelector(state => state.show);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   console.log('Component mounted');
  //   return () => {
  //     console.log('Component will be unmount');
  //   }
  // }, []);

  return (
    <div className="analogueApp">
      <div className={`sidebar ${show ? "shown" : ""}`}>
        <div className="modal" onClick={() => dispatch({ type: 'TOGGLE_MODAL' })}>
          <h1 className="title">What up: {show ? "show" : "hide"}</h1>
        </div>
      </div>
    </div>
  )
}

export default hot(App);
