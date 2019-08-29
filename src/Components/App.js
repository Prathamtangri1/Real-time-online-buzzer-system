import React, {Component} from 'react';
import './App.css';
import ButtonAppBar from './ButtonAppBar.js';
import CentreButton from './CentreButton.js';
import Times from './Times';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      min: 0,
      secs: 0,
      milis: 0,
      winner: false
    }

    this.handleBuzzerClick = this.handleBuzzerClick.bind(this);
    this.saveTime = this.saveTime.bind(this);
  }

  handleBuzzerClick() {
    this.refs.times.handleStopClick();
  }

  saveTime(min, secs, milis) {
    this.setState({min: min, secs: secs, milis: milis});
  }

  render(){
    return (
      <div>
        <div className="main">
          <div className="nav-bar">
            <ButtonAppBar />
          </div>
          <div className="times">
            <Times ref="times" saveTime={(min, secs, milis) => this.saveTime(min, secs, milis)}/>
          </div>
          <div className="buzzer">
            <CentreButton onClick={this.handleBuzzerClick}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
