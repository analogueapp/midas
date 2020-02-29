import React, {useState, useEffect} from 'react';
import { hot } from 'react-hot-loader/root';

import './App.scss';

const App = () => {
  const [shown, setShown] = useState(true);
  const toggleShown = () => setShown(!shown);

  useEffect(() => {
    console.log('popup mounted');
    return () => {
      console.log('Component will be unmount');
    }
  }, []);

  return (
    <div className="app">
      <h1 className="title" onClick={toggleShown}>popup page component: {shown ? "shown" : "hidden"}</h1>
    </div>
  )
}

export default hot(App);
