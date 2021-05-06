import React, {Component} from 'react';
import './App.css';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
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
      winner: false,
      options: "initial",
      ptype: "",
      players: [],
      gameId: '',
      buzzed: [],
    }

    this.newGame = false;
    this.joinGame = false;

    this.handleBuzzerClick = this.handleBuzzerClick.bind(this);
    this.handleNewGame = this.handleNewGame.bind(this);
    this.handleJoinGame = this.handleJoinGame.bind(this);
    this.handleHostOrders = this.handleHostOrders.bind(this);
    this.handlePlayerDelete = this.handlePlayerDelete.bind(this);
    this.saveCurTime = this.saveCurTime.bind(this);
    this.convert = this.convert.bind(this);
    this.pnames = "Host";
    this.numberOfPlayers = 0;
    this.milis = 0;
    this.secs = 5;
    this.mins = 0;

    this.times = React.createRef();
    this.initialOptions = React.createRef();

    this.socket = socketIOClient(ENDPOINT);
    this.socket.on('connect', () => {
      console.log('Connected to Server');
    });

    this.socket.on('disconnect', () => {
      console.log("disconnected");
      this.setState({
        winner: false,
        options: "initial",
        ptype: "",
        players: [],
        gameId: '',
        buzzed: [],
       });

      this.initialOptions.current.startAgain();
    });

    this.socket.on('message', data => {
      console.log("Name: " + this.pnames + " message: " + data);
      // this.socket.send(data + ' received');

      if(data === 'timer_start' || data === 'timer_stop' || data === 'timer_reset') {
        console.log("received timer message: " + data);
        if(this.state.ptype === "player"){
          this.handleHostOrders(data);
          console.log("received timer message2: " + data);
        }
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

    this.socket.on('player_buzzed', data => {
      var temp = this.state.buzzed;

      this.times.current.getCurTime();

      let curTime = this.convert(this.mins, this.secs, this.milis);
      temp.push({pName: data.pName, time: curTime});
      console.log("received: " + data.pName);
      console.log(temp);

      this.setState({buzzed: temp});
    });
  }

  convert(mins, secs, milis) {
    let fixedText = ["", ":", ":"];
    
    fixedText[0] = mins < 10 ? "0" : "";
    fixedText[1] = secs < 10 ? ":0" : ":";
    fixedText[2] = milis < 10 ? ":0" : ":";
    
    return fixedText[0] + mins.toString() + fixedText[1] + secs.toString() + fixedText[2] + milis.toString();
  }

  saveCurTime(mins, secs, milis) {
    this.milis = milis;
    this.secs = secs;
    this.mins  = mins;
  }

  handleResetClick() {
    this.setState({buzzed: []});
  }

  handleHostOrders(order) {
    if (order === "timer_start" && this.state.buzzed.length === 0){
      this.times.current.handleStartClick();
    }
    else if (order === "timer_stop" && this.state.buzzed.length === 0) {
      this.times.current.handleStopClick();
      
    }
    else if (order === "timer_reset"){
      this.times.current.handleResetClick();
    }
  }

  handleBuzzerClick() {
    let status = this.times.current.handleStopClick();

    if(status === "Stopped") {
      let temp = this.pnames;
      console.log("sent details: " + this.pnames);
      this.setState({buzzed: [this.pnames]});
      this.socket.emit('player_buzzed', {pName: temp});
    }
  }

  handleNewGame() {
    this.setState({options: "game_created", ptype: "host"});

    this.socket.emit('request_gameId', {mins: this.mins, secs: this.secs, milis: this.milis});

    this.socket.on('new_gameId', (data) => {
     this.setState({gameId: data});
    }); 
  }

  handleJoinGame(p_name, game_Id) {
    this.socket.emit('join_room', {gameId: game_Id, pName: p_name});

    this.socket.on('join_room_response', (data) => {
      if(data === 'Successful'){
        this.pnames = p_name;
        this.setState({options: "game_joined", ptype: "player"});
        this.setState({gameId: game_Id});
        console.log("pnames: " + this.pnames);
      }
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
      hostSees =  <div className="host">
                    <div className="times">
                      <Times ref={this.times} onResetClick={() => this.handleResetClick()} saveTime={(mins, secs, milis) => this.saveCurTime(mins, secs, milis)} default={[this.mins, this.secs, this.milis]}
                      // onControlClick={(type) => this.handleControlsClick(type)} 
                      controls = {"on"} socket={this.socket}/>
                    </div>
                    <Grid container spacing={2} justify="space-evenly" alignItems="flex-start" alignContent="center">
                      <Grid item xs={5}>
                        <Paper elevation={2}  className="buzzedPaper">
                          <Typography variant="h5" gutterBottom>
                            Players Buzzed
                          </Typography>
                          <PlayersBuzzed buzzed={this.state.buzzed}/>
                        </Paper>
                      </Grid>
                      <Grid item xs={5}>
                        <Paper elevation={2} className="buzzedPaper">
                          <Typography variant="h5" gutterBottom>
                            Players Joined
                          </Typography>
                          <PlayersJoined players={this.state.players} onPlayerDelete={(pName) => this.handlePlayerDelete(pName)}/>
                        </Paper>
                      </Grid>
                    </Grid>
                  </div>

    }
    else if(this.state.options === "game_joined" && this.state.ptype === "player") {
      newClientSees = "";
      playerSees =  <div>
                      <div className="times">
                        <Times ref={this.times} onResetClick={() => this.handleResetClick()} saveTime={(mins, secs, milis) => this.saveCurTime(mins, secs, milis)} controls = {"off"} socket={this.socket} default={[this.mins, this.secs, this.milis]}/>
                      </div>
                      <div className="buzzer">
                        <CentreButton onClick={this.handleBuzzerClick}/>
                      </div>
                    </div>
    }
    else {
      newClientSees = <div>
                        <div className="times">
                          <Times ref={this.times} onResetClick={() => this.handleResetClick()} saveTime={(mins, secs, milis) => this.saveCurTime(mins, secs, milis)} controls = {"off"} socket={this.socket} default={[this.mins, this.secs, this.milis]}/>
                        </div>
                        <div className="buzzer">
                          <CentreButton onClick={this.handleBuzzerClick}/>
                        </div>
                      </div>
    }
    
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
        <InitialOptions ref={this.initialOptions} newGame={() => this.handleNewGame()} joinGame={() => this.setState({options: "join"})}/>
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
