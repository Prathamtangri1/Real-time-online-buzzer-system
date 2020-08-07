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
    this.handleNewGame = this.handleNewGame.bind(this);
    this.handleJoinGame = this.handleJoinGame.bind(this);
    this.handleHostOrders = this.handleHostOrders.bind(this);
    this.saveTime = this.saveTime.bind(this);
    this.pnames = "Host";
    this.numberOfPlayers = 0;
    this.gameId = "";
    this.times = React.createRef();

    this.socket = socketIOClient(ENDPOINT);
    this.socket.on('connect', () => {
      this.socket.send('Booyah!');
    });

    this.socket.on('message', data => {
      console.log("Name: " + this.pnames + " message: " + data);
      // this.socket.send(data + ' received');

      if(data === 'timer_start' || data === 'timer_stop' || data === 'timer_reset') {
        this.handleHostOrders(data);
      }
    });
  }

  handleHostOrders(order) {
    if (order === "timer_start"){
      this.times.current.handleStartClick();
    }
    else if (order === "timer_stop") {
      this.times.current.handleStopClick();
    }
    else if (order === "timer_reset"){
      this.times.current.handleResetClick();
    }
  }

  handleBuzzerClick() {
    this.times.current.handleStopClick();
  }

  saveTime(min, secs, milis) {
    this.setState({min: min, secs: secs, milis: milis});
  }

  handleNewGame() {
    this.setState({options: "game_created", ptype: "host"});

    this.socket.emit('request_gameId');

    this.socket.on('new_gameId', (data) => {
     this.gameId = data;
     this.socket.emit('join_room', this.gameId);
    }); 
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
                      <Times ref={this.times} saveTime={(min, secs, milis) => this.saveTime(min, secs, milis)} 
                      // onControlClick={(type) => this.handleControlsClick(type)} 
                      controls = {"on"} socket={this.socket}/>
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
                        <Times ref={this.times} saveTime={(min, secs, milis) => this.saveTime(min, secs, milis)} controls = {"off"} />
                      </div>
                      <div className="buzzer">
                        <CentreButton onClick={this.handleBuzzerClick}/>
                      </div>
                    </div>
    }
    else {
      newClientSees = <div>
                        <div className="times">
                          <Times ref={this.times} saveTime={(min, secs, milis) => this.saveTime(min, secs, milis)} controls = {"off"} />
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
