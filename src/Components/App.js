import React, {Component} from 'react';
import './App.css';
import ButtonAppBar from './ButtonAppBar.js';
import CentreButton from './CentreButton.js';
import InitialOptions from './InitialOptions.js';
import JoinGameOptions from './JoinGameOptions.js';
import NewGameOptions from './NewGameOptions.js';
import PlayerNameOptions from './PlayerNameOptions.js';
import Times from './Times';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      min: 0,
      secs: 0,
      milis: 0,
      winner: false,
      options: "initial",
    }

    this.newGame = false;
    this.joinGame = false;

    this.handleBuzzerClick = this.handleBuzzerClick.bind(this);
    this.saveTime = this.saveTime.bind(this);
    this.pnames = [];
    this.numberOfPlayers = 0;
  }

  handleBuzzerClick() {
    this.refs.times.handleStopClick();
  }

  saveTime(min, secs, milis) {
    this.setState({min: min, secs: secs, milis: milis});
  }



  render(){
    let ng= "", jg="", pnames="";
    if(this.state.options === "new") {
      ng = <NewGameOptions playerNames={(num) => {this.setState({options: "pnames"}); this.numberOfPlayers = num}} />
    }

    if(this.state.options === "pnames") {
      pnames = <PlayerNameOptions numberOfPlayers={this.numberOfPlayers} pnames={(pnm) => this.pnames = pnm}/>
    }
    
    if(this.state.options === "join") {
      jg = <JoinGameOptions />
    }

    return (
      <div>
        <InitialOptions newGame={() => this.setState({options: "new"})} joinGame={() => this.setState({options: "join"})}/>
        {ng}
        {pnames}
        {jg}
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
