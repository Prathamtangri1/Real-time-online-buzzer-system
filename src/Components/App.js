import React, {Component} from 'react';
import './App.css';
import ButtonAppBar from './ButtonAppBar.js';
import CentreButton from './CentreButton.js';
import InitialOptions from './InitialOptions.js';
import JoinGameOptions from './JoinGameOptions.js';
import PlayersBuzzed from './PlayersBuzzed.js'
import Times from './Times';
import Typography from '@material-ui/core/Typography';
import PlayersJoined from './PlayersJoined.js'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      min: 0,
      secs: 0,
      milis: 0,
      winner: false,
      options: "initial",
      ptype: "host",
    }

    this.newGame = false;
    this.joinGame = false;

    this.handleBuzzerClick = this.handleBuzzerClick.bind(this);
    this.handleNewGame = this.handleNewGame.bind(this);
    this.saveTime = this.saveTime.bind(this);
    this.pnames = "Host";
    this.numberOfPlayers = 0;
    this.gameId = "";
  }

  handleBuzzerClick() {
    this.refs.times.handleStopClick();
  }

  saveTime(min, secs, milis) {
    this.setState({min: min, secs: secs, milis: milis});
  }

  handleNewGame() {
    this.gameId = "uwueop23";
    this.setState({options: "game_created", ptype: "host"});
  }

  render(){
    let jg="", hostSees="", playerSees="", newClientSees="";
    if(this.state.options === "game_created" && this.state.ptype === "host") {
      newClientSees = "";
      //ng = <NewGameOptions playerNames={(num) => {this.setState({options: "game_created"}); this.numberOfPlayers = num; this.pnames = [];}} gameId={(gameId) => this.gameId = gameId}/>
      hostSees =  <div className="host">
                    <div className="times">
                      <Times ref="times" saveTime={(min, secs, milis) => this.saveTime(min, secs, milis)} controls = {"on"}/>
                    </div>
                    <hr className="hr"/>
                    <div className="playersBuzzed">
                      <Typography variant="h5" gutterBottom>
                        Players Buzzed
                      </Typography>
                      <PlayersBuzzed />
                    </div>
                    <hr className="hr2"/>
                    <div className="playersBuzzed">
                      <Typography variant="h5" gutterBottom>
                        Players Joined
                      </Typography>
                      <PlayersJoined />
                    </div>
                  </div>

    }
    else if(this.state.options === "game_joined" && this.state.ptype === "player") {
      newClientSees = "";
      playerSees =  <div>
                      <div className="times">
                        <Times ref="times" saveTime={(min, secs, milis) => this.saveTime(min, secs, milis)} controls = {"off"} />
                      </div>
                      <div className="buzzer">
                        <CentreButton onClick={this.handleBuzzerClick}/>
                      </div>
                    </div>
    }
    else {
      newClientSees = <div>
                        <div className="times">
                          <Times ref="times" saveTime={(min, secs, milis) => this.saveTime(min, secs, milis)} controls = {"off"} />
                        </div>
                        <div className="buzzer">
                          <CentreButton onClick={this.handleBuzzerClick}/>
                        </div>
                      </div>
    }

    // if(this.state.options === "pnames") {
    //   pnames = <PlayerNameOptions numberOfPlayers={this.numberOfPlayers} pnames={(pnm) => {this.pnames = pnm; console.log(this.pnames);}} gameId={this.gameId}/>
    // }
    
    if(this.state.options === "join") {
      jg = <JoinGameOptions complete={() => this.setState({options: "game_joined", ptype: "player"})} playerInfo={(pname, gameId) => {this.gameId = gameId; this.pnames = pname; console.log(this.gameId); console.log(this.pnames);}}/>
    }

    return (
      <div>
        <InitialOptions newGame={() => this.handleNewGame()} joinGame={() => this.setState({options: "join"})}/>
        {/* {ng}
        {pnames} */}
        {jg}
        <div className="main">
          <div className="nav-bar">
            <ButtonAppBar pname={this.pnames}/>
          </div>
          {newClientSees}
          {hostSees}
          {playerSees}
        </div>
      </div>
    );
  }
}

export default App;
