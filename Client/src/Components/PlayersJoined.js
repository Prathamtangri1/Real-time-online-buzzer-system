import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: '#f5f5f5',
  },
}));


export default function PlayersJoined(props) {
  const classes = useStyles();

  let players = [];
  players = props.players.map(pName => (
    <ListItem>
      <ListItemIcon>
        <AccountCircleIcon fontSize="large" />
      </ListItemIcon>
      <ListItemText primary={pName} />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete" onClick={() => props.onPlayerDelete(pName)}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  ));

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="main mailbox folders">
        {players}
      </List>
    </div>
  );
}
