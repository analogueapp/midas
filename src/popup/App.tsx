import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { hot } from 'react-hot-loader/root';

import './App.scss';

const App = () => {
  const [shown, setShown] = useState(true);
  const toggleShown = () => setShown(!shown);

  const count = useSelector(state => state.count);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('popup mounted');
    return () => {
      console.log('Component will be unmount');
    }
  }, []);

  return (
    <div className="app">
      <h1 className="title" onClick={() => {
        dispatch({ type: 'ADD_COUNT' })
        toggleShown()
      }}>popup page component: {shown ? "shown" : "hidden"} {count}</h1>
    </div>
  )
}

export default hot(App);
