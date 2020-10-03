import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';


const useStyles = theme => ({
  margin: {
    margin: theme.spacing(1),
  }
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class InitialOptions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
      oldGameRemoved: false
    }

    this.handleClose = this.handleClose.bind(this);
    this.newGame = this.newGame.bind(this);
    this.joinGame = this.joinGame.bind(this);
    this.startAgain = this.startAgain.bind(this);
  }

  handleClose() {
    this.setState({open: false, oldGameRemoved: false});
  }

  newGame() {
    this.props.newGame();
    this.handleClose();
  }

  joinGame() {
    this.props.joinGame();
    this.handleClose();
  }

  startAgain() {
    this.setState({open: true, oldGameRemoved: true});
  }

  render() {
    const { classes } = this.props;
    var displayInBox;

    if(this.state.oldGameRemoved === true) {
      displayInBox = <DialogContent>
                            <DialogContentText>
                              You were removed from the previous game. Reload this page
                            </DialogContentText>
                          </DialogContent>
    }
    else {
      displayInBox = <DialogActions>
                      <Button variant="contained" size="large" onClick={this.newGame} color="primary" className={classes.margin}>
                        New Game
                      </Button>
                      <Button variant="contained" size="large" onClick={this.joinGame} color="primary" className={classes.margin}>
                        Join Game
                      </Button>
                    </DialogActions>

    }
    return (
      <div>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title" TransitionComponent={Transition}>
          <DialogTitle id="form-dialog-title">Online Buzzer<span role="img" aria-label="joystick emoji">️🕹️</span></DialogTitle>
          {displayInBox}
        </Dialog>
      </div>
    );
  }
}

export default withStyles(useStyles)(InitialOptions);
