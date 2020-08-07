import React, {Component} from 'react';
import './App.css';
import ButtonAppBar from './ButtonAppBar.js';
import CentreButton from './CentreButton.js';
import InitialOptions from './InitialOptions.js';
import JoinGameOptions from './JoinGameOptions.js';
import PlayersBuzzed from './PlayersBuzzed.js'
import Times from './Times';
import Typography from '@material-ui/core/Typography';
import PlayersJoined from './PlayersJoined.js';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      min: 0,
      secs: 0,
      milis: 0,
      winner: false,
      options: "initial",
      ptype: "",
    }

    this.newGame = false;
    this.joinGame = false;

    this.handleBuzzerClick = this.handleBuzzerClick.bind(this);
    this.handleControlsClick = this.handleControlsClick.bind(this);
    this.handleNewGame = this.handleNewGame.bind(this);
    this.handleJoinGame = this.handleJoinGame.bind(this);
    this.saveTime = this.saveTime.bind(this);
    this.pnames = "Host";
    this.numberOfPlayers = 0;
    this.gameId = "";

    this.socket = socketIOClient(ENDPOINT);
    this.socket.on('connect', () => {
      this.socket.send('Booyah!');
    });

    this.socket.on('message', data => {
      console.log("Name: " + this.pnames + " message: " + data);
      this.socket.send(data + ' received');
    });

    this.socket.on('new_gameId', (data) => {
      this.gameId = data;
    });

  }

  handleControlsClick(type) {
    if (type === "start"){
      this.socket.send('timer_start');
    }
    else if (type === "stop") {
      this.socket.send('timer_stop');
    }
    else if (type === "reset"){
      this.socket.send('timer_reset');
    }
  }

  handleBuzzerClick() {
    this.refs.times.handleStopClick();
  }

  saveTime(min, secs, milis) {
    this.setState({min: min, secs: secs, milis: milis});
  }

  handleNewGame() {
    this.setState({options: "game_created", ptype: "host"});

    this.socket.emit('request_gameId');

    this.socket.on('new_gameId', (data) => {
     this.gameId = data;
    });

    this.socket.emit('join_room', this.gameId);
  }

  handleJoinGame(p_name, game_Id) {
    this.gameId = game_Id;
    this.pnames = p_name;
    this.setState({options: "join", ptype: "player"});
    this.socket.emit('join_room', this.gameId);
  }

  render(){
    let jg="", hostSees="", playerSees="", newClientSees="";
    if(this.state.options === "game_created" && this.state.ptype === "host") {
      newClientSees = "";
      //ng = <NewGameOptions playerNames={(num) => {this.setState({options: "game_created"}); this.numberOfPlayers = num; this.pnames = [];}} gameId={(gameId) => this.gameId = gameId}/>
      hostSees =  <div className="host">
                    <div className="times">
                      <Times ref="times" saveTime={(min, secs, milis) => this.saveTime(min, secs, milis)} onControlsClick={(type) => this.handleControlsClick(type)} controls = {"on"}/>
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
      jg = <JoinGameOptions complete={() => this.setState({options: "game_joined", ptype: "player"})} playerInfo={(p_name, game_Id) => {this.handleJoinGame(p_name, game_Id)}}/>
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
