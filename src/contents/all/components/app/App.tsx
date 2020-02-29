import React, {useState, useEffect} from 'react';
import { hot } from 'react-hot-loader/root';

import './App.scss';

const App = () => {
  const [shown, setShown] = useState(true);
  const toggleShown = () => setShown(!shown);

  useEffect(() => {
    console.log('Component mounted');
    return () => {
      console.log('Component will be unmount');
    }
  }, []);

  return (
    <div className="analogueApp">
      <div className={`sidebar ${shown ? "shown" : ""}`}>
        <div className="modal" onClick={toggleShown}>
          <h1 className="title">What uppp</h1>
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
