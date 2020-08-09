import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontFamily: "Playball",
    fontSize: 35,
  },

  title2: {
    flexGrow: 1,
    fontSize: 20,
  }
}));

export default function ButtonAppBar(props) {
  const classes = useStyles();
  let pname = "Login";

  if(Array.isArray(props.pname)) {
    pname = "Admin";
  }
  else if(props.pname === "") {
    pname = "Login";
  }
  else {
    pname = props.pname;
  }

  let gameIdText = '';
  if(props.gameId !== ''){
    gameIdText =  <Typography variant="h6" className={classes.title2}>
                    Buzzer Game ID: {props.gameId}
                  </Typography>
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Aldrin
          </Typography>
          {gameIdText}
          <Button color="inherit">{pname}</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
