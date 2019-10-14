import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

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
    fontSize: 25,
  },
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

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Buzzer
          </Typography>
          <Button color="inherit">{pname}</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
