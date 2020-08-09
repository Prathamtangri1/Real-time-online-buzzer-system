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
      players: [],
      gameId: '',
    }

    this.newGame = false;
    this.joinGame = false;

    this.handleBuzzerClick = this.handleBuzzerClick.bind(this);
    this.handleNewGame = this.handleNewGame.bind(this);
    this.handleJoinGame = this.handleJoinGame.bind(this);
    this.handleHostOrders = this.handleHostOrders.bind(this);
    this.handlePlayerDelete = this.handlePlayerDelete.bind(this);
    this.saveTime = this.saveTime.bind(this);
    this.pnames = "Host";
    this.numberOfPlayers = 0;
    this.times = React.createRef();

    this.socket = socketIOClient(ENDPOINT);
    this.socket.on('connect', () => {
      console.log('Connected to Server');
    });

    this.socket.on('message', data => {
      console.log("Name: " + this.pnames + " message: " + data);
      // this.socket.send(data + ' received');

      if(data === 'timer_start' || data === 'timer_stop' || data === 'timer_reset') {
        this.handleHostOrders(data);
      }
    });

    this.socket.on('new_player', data => {
      let temp = this.state.players;
      temp.push(data);
      this.setState({players: temp});
    });

    this.socket.on('player_disconnected', (pName) => {
      let temp = this.state.players;
      console.log("to be deleted: " + pName);

      temp.splice(temp.indexOf(pName), 1);

      this.setState({players: temp});
    });

    this.socket.on("player_delete_response", (msg) => {
      console.log(msg);
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
     this.setState({gameId: data});
    }); 
  }

  handleJoinGame(p_name, game_Id) {
    this.setState({gameId: game_Id});
    this.pnames = p_name;

    this.socket.emit('join_room', {gameId: game_Id, pName: p_name});


    this.socket.on('join_room_response', (data) => {
      if(data === 'Successful')
        this.setState({options: "game_joined", ptype: "player"});
      else if (data === 'pName_repeat')
        this.setState({options: "join_error_pName"});
      else if (data === 'gameId doesn\'t exist')
        this.setState({options: "join_error_gameId"});
    });  
  }

  handlePlayerDelete(pName) {
    this.socket.emit('player_delete', pName);
  }



  render(){
    let jg="", hostSees="", playerSees="", newClientSees="";
    if(this.state.options === "game_created" && this.state.ptype === "host") {
      newClientSees = "";
      //ng = <NewGameOptions playerNames={(num) => {this.setState({options: "game_created"}); this.numberOfPlayers = num; this.pnames = [];}} gameId={(gameId) => this.setState({gameId: gameId});}/>
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
                      <PlayersJoined players={this.state.players} onPlayerDelete={(pName) => this.handlePlayerDelete(pName)}/>
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
    //   pnames = <PlayerNameOptions numberOfPlayers={this.numberOfPlayers} pnames={(pnm) => {this.pnames = pnm; console.log(this.pnames);}} gameId={this.state.gameId}/>
    // }
    
    if(this.state.options === "join") {
      jg = <JoinGameOptions complete={() => this.setState({options: "game_joined", ptype: "player"})} playerInfo={(p_name, game_Id) => {this.handleJoinGame(p_name, game_Id)}} error={""}/>
    }
    else if(this.state.options === "join_error_pName") {
      jg = <JoinGameOptions complete={() => this.setState({options: "game_joined", ptype: "player"})} playerInfo={(p_name, game_Id) => {this.handleJoinGame(p_name, game_Id)}} error={"pName_repeat"}/>
    }
    else if(this.state.options === "join_error_gameId") {
      jg = <JoinGameOptions complete={() => this.setState({options: "game_joined", ptype: "player"})} playerInfo={(p_name, game_Id) => {this.handleJoinGame(p_name, game_Id)}} error={"gameId doesn't exist"}/>
    }

    return (
      <div>
        <InitialOptions newGame={() => this.handleNewGame()} joinGame={() => this.setState({options: "join"})}/>
        {/* {ng}
        {pnames} */}
        {jg}
        <div className="main">
          <div className="nav-bar">
            <ButtonAppBar pname={this.pnames} gameId={this.state.gameId}/>
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
