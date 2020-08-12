import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        marginTop: 20,
    },
    topGrid: {
        marginTop: 10,
        textAlign: "center",
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
}));

function StyleDisplay(props) {
    const classes = useStyles();
    let buttonDisplay = "";
    if(props.controls === "on") {
        buttonDisplay = <Grid container spacing={3} className={classes.topGrid} justify="center" alignItems="center">
                            <Button variant="contained" size="large" color="primary" className={classes.button} onClick={props.onStartClick}>
                                <Typography variant="h6">
                                    Start
                                </Typography>
                            </Button>
                            <Button variant="contained" size="large" color="primary" className={classes.button} onClick={props.onStopClick}>
                                <Typography variant="h6">
                                    Stop
                                </Typography>
                            </Button>
                            <Button variant="contained" size="large" color="primary" className={classes.button} onClick={props.onResetClick}>
                                <Typography variant="h6">
                                    Reset
                                </Typography>
                            </Button>
                        </Grid>
    }

    return(
        <div className={classes.root}>
            {buttonDisplay}
            <Grid container spacing={1} className={classes.topGrid} justify="center"
            alignItems="center" alignContent="center">
                <Grid item xs alignContent="center">
                    <Typography variant="h1">
                        {props.min > 9 ? "" + props.min : "0" + props.min}:{props.secs > 9 ? "" + props.secs : "0" + props.secs}:{props.milis > 9 ? "" + props.milis : "0" + props.milis}
                    </Typography>
                    {/* <Typography variant="h3">
                        {props.milis < 10 ? "00"+props.milis : (props.milis < 100 ? "0"+props.milis : ""+props.milis)}
                    </Typography> */}
                </Grid>
            </Grid>
        </div>
    );
}

class Times extends Component {
    constructor(props) {
        super(props);

        this.state = {
            min: 0,
            secs: 0,
            milis: 0,
        }

        this.gap = 10;
        this.timeoutId = null;
        this.incrementTime = this.incrementTime.bind(this);
        this.changeTimeDisplay = this.changeTimeDisplay.bind(this);
        this.getCurTime = this.getCurTime.bind(this);
    }

    getCurTime() {
        this.props.saveTime(this.state.min, this.state.secs, this.state.milis);
    }

    handleStartClick() {
        if(this.timeoutId == null) {
            let nextAt = new Date().getTime() + this.gap;
            this.timeoutId = setTimeout(this.incrementTime(this.gap, nextAt), nextAt - new Date().getTime());
        }

        if(this.props.socket)
            this.props.socket.send('timer_start');
    }

    handleStopClick() {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
        this.props.saveTime(this.state.min, this.state.secs, this.state.milis);

        if(this.props.socket)
            this.props.socket.send('timer_stop');
    }

    handleResetClick() {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
        this.props.saveTime(this.state.min, this.state.secs, this.state.milis);
        this.setState({min: 0, secs: 0, milis: 0});
        this.props.onResetClick();

        if(this.props.socket)
            this.props.socket.send('timer_reset');
    }

    changeTimeDisplay(gap_milis) {
        let {min, secs, milis} = this.state;
        milis = milis + gap_milis;
        if(milis > 99) {
            secs = secs + Math.floor(milis/100);
            milis = milis % 100;
            if(secs > 59) {
                min = min + Math.floor(secs/60);
                secs = secs % 60;
            }
        }

        this.setState({min: min, secs: secs, milis: milis});
    }

    incrementTime(gap, nextAt) {
        nextAt += gap;
        let interval = Date.now() - nextAt;
        let change_milis = 1;

        if(interval > gap) {
            let passes = Math.floor(interval/gap);
            nextAt = nextAt + (passes+1)*gap;
            change_milis = change_milis + passes + 1;
        }

        this.changeTimeDisplay(change_milis);
        

        this.timeoutId = setTimeout(() => this.incrementTime(gap, nextAt), nextAt - new Date().getTime());
    }

    render() {
        return (
            <StyleDisplay min={this.state.min} secs={this.state.secs} milis={this.state.milis} onStartClick={() => this.handleStartClick()} onStopClick={() => this.handleStopClick()}  onResetClick={() => this.handleResetClick()} controls={this.props.controls}/>
        ); 
    }
}

export default Times;