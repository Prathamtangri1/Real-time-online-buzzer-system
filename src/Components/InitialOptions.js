import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';


const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1),
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function InitialOptions(props) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(true);

  function handleClose() {
    setOpen(false);
  }

  function newGame() {
    props.newGame();
    handleClose();
  }

  function joinGame() {
    props.joinGame();
    handleClose();
  }


  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" TransitionComponent={Transition}>
        <DialogTitle id="form-dialog-title">Online Buzzer <span role="img" aria-label="joystick emoji">️🕹️</span></DialogTitle>
        <DialogActions>
          <Button variant="contained" size="large" onClick={newGame} color="primary" className={classes.margin}>
            New Game
          </Button>
          <Button variant="contained" size="large" onClick={joinGame} color="primary" className={classes.margin}>
            Join Game
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
