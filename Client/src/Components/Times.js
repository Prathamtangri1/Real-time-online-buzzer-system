import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TimerSet from './TimerSet';
import TimerIcon from '@material-ui/icons/Timer';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import StopIcon from '@material-ui/icons/Stop';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        marginTop: 20,
        alignContent: "center",
        justify: "center",
        textAlign: "center",
    },
    topGrid: {
        textAlign: "center",
        marginBottom: 10,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    button: {
        margin: theme.spacing(1),
        height: 80,
        width: 150,
    },
    setTimerButton: {
        margin: theme.spacing(1),
        marginBottom: 50
    },
    TimerInvisible: {
        color: '#f5f5f5',
    },
    timerPaper: {
        width: "80%",
    }
}));

function StyleDisplay(props) {
    const classes = useStyles();
    let buttonDisplay = "";
    let timer = "";

    let buttonDisable = [false, true, false];
    let button2 = '';

    if(props.curStatus === "timer_started") {
        buttonDisable = [true, false, true];
        button2 = <Button variant="contained" size="large" color="primary" className={classes.button} onClick={props.onStopClick} endIcon={<StopIcon />} disabled={buttonDisable[1]}>
                    <Typography variant="h6">
                        Stop
                    </Typography>
                </Button>
    }
    else if (props.curStatus === "timer_stopped") {
        buttonDisable = [false, false, true];
        button2 = <Button variant="contained" size="large" color="primary" className={classes.button} onClick={props.onResetClick} endIcon={<RotateLeftIcon />} disabled={buttonDisable[1]}>
                    <Typography variant="h6">
                        Reset
                    </Typography>
                </Button>
    }
    else if (props.curStatus === "timer_reset") {
        buttonDisable = [false, true, false];
        button2 = <Button variant="contained" size="large" color="primary" className={classes.button} onClick={props.onStopClick} endIcon={<StopIcon />} disabled={buttonDisable[1]}>
                    <Typography variant="h6">
                        Stop
                    </Typography>
                </Button>
    }
    else if (props.curStatus === "timer_zero") {
        buttonDisable = [true, false, false];
        button2 = <Button variant="contained" size="large" color="primary" className={classes.button} onClick={props.onResetClick} endIcon={<RotateLeftIcon />} disabled={buttonDisable[1]}>
                    <Typography variant="h6">
                        Reset
                    </Typography>
                </Button>
    }
    else if (props.curStatus === "timer_initial") {
        buttonDisable = [false, false, false];
        button2 = <Button variant="contained" size="large" color="primary" className={classes.button} onClick={props.onResetClick} endIcon={<RotateLeftIcon />} disabled={buttonDisable[1]}>
                    <Typography variant="h6">
                        Reset
                    </Typography>
                </Button>
    }

    if(props.timerVisible === true) {
        timer = <Grid item xs alignContent="center">
                        <Typography variant="h1">
                            {props.mins > 9 ? "" + props.mins : "0" + props.mins}:{props.secs > 9 ? "" + props.secs : "0" + props.secs}:{props.milis > 9 ? "" + props.milis : "0" + props.milis}
                        </Typography>
                    </Grid>
    }
    else if (props.timerVisible === false) {
        timer = <Grid item xs alignContent="center">
                    <Typography variant="h1" className={classes.TimerInvisible}>
                        {props.mins > 9 ? "" + props.mins : "0" + props.mins}:{props.secs > 9 ? "" + props.secs : "0" + props.secs}:{props.milis > 9 ? "" + props.milis : "0" + props.milis}
                    </Typography>
                </Grid>
    }

    if(props.controls === "on") {
        buttonDisplay = <Grid container spacing={3} className={classes.topGrid} justify="center" alignItems="center">
                            <Button variant="contained" size="large" color="primary" className={classes.button} onClick={props.onStartClick} endIcon={<KeyboardArrowRightIcon />} disabled={buttonDisable[0]}>
                                <Typography variant="h6">
                                    Start
                                </Typography>
                            </Button>
                            {button2}
                            <Button variant="contained" size="large" color="primary" className={classes.button} onClick={props.onSetTimer} endIcon={<TimerIcon />} disabled={buttonDisable[2]}>
                                    <Typography variant="h6">
                                        Set Timer
                                    </Typography>
                            </Button>
                        </Grid>
    }

    return(
        <div className={classes.root}>
            <Grid container spacing={1}  justify="center"
                alignItems="center" alignContent="center">
                {/* <Paper elevation={3} className={classes.timerPaper} > */}
                    <Grid container spacing={1} className={classes.topGrid} justify="center"
                    alignItems="center" alignContent="center">
                        {timer}
                    </Grid>
                    {buttonDisplay}
                {/* </Paper> */}
            </Grid>
        </div>
    );
}

class Times extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mins: this.props.default[0],
            secs: this.props.default[1],
            milis: this.props.default[2],
            status: "timer_initial",
            over: true,
            timerVisible: true,
            setTimerDialogVisible: false,
        }

        this.userValuesTimer = [this.props.default[0], this.props.default[1], this.props.default[2]];
        this.gap = 10;
        this.timeoutId = null;
        this.incrementTime = this.decrementTime.bind(this);
        this.changeTimeDisplay = this.changeTimeDisplay.bind(this);
        this.getCurTime = this.getCurTime.bind(this);
        this.blink = this.blink.bind(this);
        this.handleSetTimer = this.handleSetTimer.bind(this);
        this.handleSetTimerValues = this.handleSetTimerValues.bind(this);
        this.handleStopClick = this.handleStopClick.bind(this);

        if(this.props.socket) {
            this.props.socket.on("timer_change", (data) => {
                console.log("timer_changed_caught");
                console.log(data);
                this.handleSetTimerValues(data.mins, data.secs, data.milis);
            });
        }

    }

    async blink() {
        for(let i = 0; i < 2; i++) {
            this.setState({timerVisible: false});
            await new Promise(r => setTimeout(r, 200));
            
            this.setState({timerVisible: true});
            await new Promise(r => setTimeout(r, 200));
        }
    }

    getCurTime() {
        this.props.saveTime(this.state.mins, this.state.secs, this.state.milis);
    }

    handleStartClick() {
        if(this.timeoutId == null) {
            let nextAt = new Date().getTime() + this.gap;
            this.setState({over: false, status: "timer_started"});
            this.timeoutId = setTimeout(this.decrementTime(this.gap, nextAt), nextAt - new Date().getTime());
        }

        if(this.props.socket && this.props.controls === "on")
            this.props.socket.send('timer_start');
    }

    handleStopClick() {
        if(this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
            this.setState({over: true, status: "timer_stopped"});

            if(this.props.socket && this.props.controls === "on")
            this.props.socket.send('timer_stop');

            return "Stopped";
        }
        else {
            this.setState({over: true, status: "timer_zero"});
            return "Already stopped";
        }   
    }

    handleResetClick() {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
        this.setState({over: true, status: "timer_reset"});
        this.setState({mins: this.userValuesTimer[0], secs: this.userValuesTimer[1], milis: this.userValuesTimer[2]});
        this.props.onResetClick();

        if(this.props.socket && this.props.controls === "on")
            this.props.socket.send('timer_reset');
    }

    changeTimeDisplay(gap_milis) {
        let {mins, secs, milis} = this.state;
        milis = milis - gap_milis;
        if(milis < 0) {
            secs = secs + Math.floor(milis / 100);
            milis = (100 - Math.abs(milis % 100))%100;
            if(secs < 0) {
                mins = mins + Math.floor(secs / 60);
                secs = (60 - Math.abs(secs % 60))%60;
         
              	if(mins <= 0) {
                    console.log("Over!");
                    this.blink();
                    return "countdown_over";
                }
            }
        }

        this.setState({mins: mins, secs: secs, milis: milis});
        return "successful";
    }

    decrementTime(gap, nextAt) {
        nextAt += gap;
        let interval = Date.now() - nextAt;
        let change_milis = 1;

        if(interval > gap) {
            let passes = Math.floor(interval/gap);
            nextAt = nextAt + (passes+1)*gap;
            change_milis = change_milis + passes + 1;
        }

        let changed = this.changeTimeDisplay(change_milis);

        if(changed === "countdown_over") {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
            this.handleStopClick();
        }
        else if(changed === "successful"){
            this.timeoutId = setTimeout(() => this.decrementTime(gap, nextAt), nextAt - new Date().getTime());
        }
    }

    handleSetTimer() {
        this.setState({setTimerDialogVisible: true});
        // this.userValuesTimer = [mins, secs, milis];
        // this.setState({mins: mins, secs: secs, milis: milis});
    }

    handleSetTimerValues(mins, secs, milis) {
        this.userValuesTimer = [mins, secs, milis];
        this.setState({mins: mins, secs: secs, milis: milis});
        this.setState({setTimerDialogVisible: false});
        this.props.saveTime(this.state.mins, this.state.secs, this.state.milis);

        if(this.props.controls === "on"){
            console.log("timer_changed_Sent");
            this.props.socket.emit("timer_change", {mins: mins, secs: secs, milis: milis});
        }
    }

    render() {
        let setTimerDialog = '';
        if(this.state.setTimerDialogVisible === true) {
            setTimerDialog = <TimerSet timerInfo={(mins, secs, milis) => {this.handleSetTimerValues(mins, secs, milis)}} default={[this.state.mins, this.state.secs, this.state.milis]}></TimerSet>
        }
        return (
            <Grid container spacing={1}  justify="center" alignItems="center" alignContent="center">
                <StyleDisplay mins={this.state.mins} secs={this.state.secs} milis={this.state.milis} onStartClick={() => this.handleStartClick()} onStopClick={() => this.handleStopClick()}  onResetClick={() => this.handleResetClick()} controls={this.props.controls} timerVisible={this.state.timerVisible} onSetTimer={() => this.handleSetTimer()} curStatus={this.state.status}/>
                {setTimerDialog}
            </Grid>
        ); 
    }
}

export default Times;