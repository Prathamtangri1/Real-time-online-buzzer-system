import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import { Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const useStyles = makeStyles(theme => ({
  error: {
    color: theme.palette.error.dark,
  }
}));

export default function PlayerNameOptions(props) {
  const classes = useStyles();

  let pnamesTfs = [], tempPnames = [];

  for(let i = 0 ; i < props.numberOfPlayers ; i++) {
    tempPnames.push(`P${i+1}`);
  }

  const [state, setState] = React.useState({
    open: true,
    setOpen: true,
    name: "",
    pnames: tempPnames,
  });

  const handleChange = index => event => {
    let newPnames = state.pnames;
    newPnames[index] = event.target.value;
    setState({ ...state, pnames: newPnames });
  };

  for(let i = 0 ; i < props.numberOfPlayers ; i++) {
    pnamesTfs.push(
      <Container>
        <Typography variant="h6">
          Player {i+1}:
        </Typography>
        <TextField
            autoFocus
            margin="dense"
            id={"p"+(i+1)}
            type="text"
            defaultValue={"P"+(i+1)}
            onChange={handleChange(i)}
            fullWidth
            variant="outlined"
          />
      </Container>
    )
  }

  function handleClose() {
    setState({setOpen: false});
  }

  let error = "";

  function handleOk() {
    let temp = [...new Set(state.pnames)];
    if(temp.length < props.numberOfPlayers){
      error = 
        <Container>
          <Typography variant='h6' className={classes.error}>
            Some player names are same!
          </Typography>
        </Container>
    }
    else {
      props.pnames(state.pnames);
    }

    handleClose();
  }

  return (
    <div>
      <Dialog open={state.open} onClose={handleClose} aria-labelledby="form-dialog-title" TransitionComponent={Transition}>
      <DialogTitle id="form-dialog-title">Player Names: </DialogTitle>
        <DialogContent>
          {error}
          {pnamesTfs}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleOk} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
