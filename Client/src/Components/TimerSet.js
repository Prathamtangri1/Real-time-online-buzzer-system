import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(2),
  },
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },

}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export default function TimerSet(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    open: true,
    setOpen: true,
    mins: props.default[0],
    secs: props.default[1],
    milis:props.default[2],
    minsError: false,
    secsError: false,
    milisError: false,
  });

  const handleChange = name => event => {
    if(name === 'mins') {
      if(parseInt(event.target.value) > 99){
        setState({ ...state, [name]: parseInt(event.target.value), minsError: true });
      }
      else {
        setState({ ...state, [name]: parseInt(event.target.value), minsError: false });
      }
    }
    else if(name === 'secs') {
      if(parseInt(event.target.value) > 59){
        setState({ ...state, [name]: parseInt(event.target.value), secsError: true });
      }
      else {
        setState({ ...state, [name]: parseInt(event.target.value), secsError: false });
      }
    }
    else if(name === 'milis') {
      if(parseInt(event.target.value) > 99){
        setState({ ...state, [name]: parseInt(event.target.value), milisError: true });
      }
      else {
        setState({ ...state, [name]: parseInt(event.target.value), milisError: false });
      }
    }
  };

  let tfs = ['', '', ''];

  if(state.minsError === true) {
    tfs[0] = <TextField
              id="outlined-min"
              label="Mins"
              className={classes.textField}
              value={state.mins}
              onChange={handleChange('mins')}
              margin="normal"
              variant="outlined"
              error
              helperText="Minutes should be less than 100"
              type="number"
            />;
  }
  else {
    tfs[0] = <TextField
              id="outlined-min"
              label="Mins"
              className={classes.textField}
              value={state.mins}
              onChange={handleChange('mins')}
              margin="normal"
              variant="outlined"
              type="number"
            />;
  }

  if(state.secsError === true) {
    tfs[1] = <TextField
              id="outlined-secs"
              label="Secs"
              className={classes.textField}
              value={state.secs}
              onChange={handleChange('secs')}
              margin="normal"
              variant="outlined"
              type="number"
              error
              helperText="Seconsds should be less than 60"
            />;
  }
  else {
    tfs[1] = <TextField
              id="outlined-secs"
              label="Secs"
              className={classes.textField}
              value={state.secs}
              onChange={handleChange('secs')}
              margin="normal"
              variant="outlined"
              type="number"
            />;
  }

  if(state.milisError === true) {
    tfs[2] = <TextField
              id="outlined-milis"
              label="Milis"
              className={classes.textField}
              value={state.milis}
              onChange={handleChange('milis')}
              margin="normal"
              variant="outlined"
              type="number"
              error
              helperText="Milis should be less than 100"
            />;
  }
  else {
    tfs[2] = <TextField
              id="outlined-milis"
              label="Milis"
              className={classes.textField}
              value={state.milis}
              onChange={handleChange('milis')}
              margin="normal"
              variant="outlined"
              type="number"
            />;
  }


  function handleClose() {
    setState({setOpen: false});
    // props.complete();
  }

  function handleSubmit() {
    if(state.minsError === false && state.secsError === false && state.milisError === false){
      props.timerInfo(state.mins, state.secs, state.milis);
      handleClose();
    }
    console.log(tfs);
  }

  return (
    <div>
      <Dialog open={state.open} onClose={handleClose} aria-labelledby="form-dialog-title"  TransitionComponent={Transition}>
        <DialogTitle id="form-dialog-title">Set Timer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {tfs[0]}
            {tfs[1]}
            {tfs[2]}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleSubmit()} color="primary">
            Submit
          </Button>
          <Button onClick={() => handleClose()} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
