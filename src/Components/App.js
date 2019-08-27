import React, {Component} from 'react';
import './App.css';
import ButtonAppBar from './ButtonAppBar.js';
import CentreButton from './CentreButton.js';
import Times from './Times';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      end: 0,
      time: 0,
      winner: false
    }
  }

  render(){
    return (
      <div>
        <div className="main">
          <div className="nav-bar">
            <ButtonAppBar />
          </div>
          <div className="times">
            <Times />
          </div>
          <div className="buzzer">
            <CentreButton />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
