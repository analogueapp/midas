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
    console.log('Component mounted');
    return () => {
      console.log('Component will be unmount');
    }
  }, []);

  return (
    <div className="analogueApp">
      <div className={`sidebar ${shown ? "shown" : ""}`}>
        <div className="modal" onClick={() => {
          dispatch({ type: 'ADD_COUNT' })
          toggleShown()
        }}>
          <h1 className="title">What uppp: {count}</h1>
        </div>
      </div>
    </div>
  )
}

export default hot(App);


// import React, {Component} from 'react';
// import {connect} from 'react-redux';
//
// class App extends Component {
//   constructor(props) {
//     super(props);
//   }
//
//   componentDidMount() {
//     document.addEventListener('click', () => {
//       this.props.dispatch({
//         type: 'ADD_COUNT'
//       });
//     });
//   }
//
//   render() {
//     return (
//       <div>
//         Count: {this.props.count}
//       </div>
//     );
//   }
// }
//
// const mapStateToProps = (state) => {
//   return {
//     count: state.count
//   };
// };
//
// export default connect(mapStateToProps)(App);
