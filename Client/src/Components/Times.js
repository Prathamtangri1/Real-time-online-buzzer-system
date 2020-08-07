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

        this.intervalId = null;

        this.incrementTime = this.incrementTime.bind(this);
    }

    handleStartClick() {
        if(this.intervalId == null) {
            this.intervalId = setInterval(this.incrementTime, 10);
        }

        this.props.onControlsClick("start");
    }

    handleStopClick() {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.props.saveTime(this.state.min, this.state.secs, this.state.milis);

        this.props.onControlsClick("stop");
    }

    handleResetClick() {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.props.saveTime(this.state.min, this.state.secs, this.state.milis);
        this.setState({min: 0, secs: 0, milis: 0});

        this.props.onControlsClick("reset");
    }

    incrementTime() {
        let {min, secs, milis} = this.state;
        milis = milis + 1;
        if(milis > 99) {
            secs = secs + 1;
            milis = 0;
            if(secs > 59) {
                min++;
                secs = 0;
            }
        }

        this.setState({min: min, secs: secs, milis: milis});
    }

    render() {
        return (
            <StyleDisplay min={this.state.min} secs={this.state.secs} milis={this.state.milis} onStartClick={() => this.handleStartClick()} onStopClick={() => this.handleStopClick()}  onResetClick={() => this.handleResetClick()} controls={this.props.controls}/>
        );
    }
}

export default Times;