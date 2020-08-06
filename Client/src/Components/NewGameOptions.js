







































// import React from 'react';
// import Button from '@material-ui/core/Button';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import DialogContent from '@material-ui/core/DialogContent';
// import { makeStyles } from '@material-ui/core/styles';
// import Slide from '@material-ui/core/Slide';
// import InputLabel from '@material-ui/core/InputLabel';
// import FormControl from '@material-ui/core/FormControl';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';

// const useStyles = makeStyles(theme => ({
//   margin: {
//     margin: theme.spacing(1),
//   },
//   root: {
//     display: 'flex',
//     flexWrap: 'wrap',
//   },
//   formControl: {
//     margin: theme.spacing(1),
//     minWidth: 120,
//   },
//   selectEmpty: {
//     marginTop: theme.spacing(2),
//   },
// }));

// const Transition = React.forwardRef(function Transition(props, ref) {
//     return <Slide direction="up" ref={ref} {...props} />;
//   });

// export default function NewGameOptions(props) {
//   const classes = useStyles();
//   const players = [1,2,3,4,5,6,7,8,9,10];

//   const numplayers = players.map((num) => <MenuItem value={num}>{num}</MenuItem>);

//   const [state, setState] = React.useState({
//     nop: '',
//     open: true,
//     setOpen: true,
//     num: 0,
//   });

//   const inputLabel = React.useRef(null);
//   const [labelWidth] = React.useState(0);
//   const gameId = createGameId();
//   props.gameId(gameId);

//   function handleClose() {
//     setState({setOpen: false});
//   }

//   function handleChange(event) {
//     setState(oldValues => ({
//       ...oldValues,
//       [event.target.name]: event.target.value,
//     }));
//   }

//   function handleOk() {
//     props.playerNames(state.nop);
//     handleClose();
//   }

//   function createGameId() {
//     return "uoiewp123";
//   }

//   return (
//     <div>
//       <Dialog open={state.open} onClose={handleClose} aria-labelledby="form-dialog-title" TransitionComponent={Transition}>
//       <DialogTitle id="form-dialog-title">New Game ID: {gameId}</DialogTitle>
//         <DialogContent>
//           <FormControl variant="outlined" className={classes.formControl}>
//             <InputLabel ref={inputLabel} htmlFor="outlined-age-simple">
//               Players
//             </InputLabel>
//             <Select
//               value={state.nop}
//               onChange={handleChange}
//               labelWidth={labelWidth}
//               inputProps={{
//                 name: 'nop',
//                 id: 'outlined-nop-simple',
//               }}
//               fullWidth
//             >
//               {numplayers}
//             </Select>
//           </FormControl>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="secondary">
//             Cancel
//           </Button>
//           <Button onClick={handleOk} color="primary">
//             Submit
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }
