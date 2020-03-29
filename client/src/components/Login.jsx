import React from "react";
import { Avatar, Button, CssBaseline, TextField, Typography } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";
import { Copyright } from "./common/Copyright";
import ApiService from "../services/api.service";
import { FormControl } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/collection/158528)",
    backgroundRepeat: "no-repeat",
    backgroundColor: theme.palette.type === "light" ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

// interface Props extends RouteComponentProps {}

export const Login = ({ history, location, match }) => {
  const classes = useStyles();

  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [loginErr, setLoginErr] = React.useState(false);

  const goToRegister = () => {
    history.push("/register");
  };

  const login = e => {
    e.preventDefault();
    // console.log(email, pass);
    const credentials = { email, password: pass };
    ApiService.login(credentials)
      .then(res => {
        history.push("/timecard");
      })
      .catch(err => {
        console.error("login error", err);
        setLoginErr(true);
      });
  };

  const onEmailChange = e => {
    setEmail(e.target.value);
  };

  const onPassChange = e => {
    setPass(e.target.value);
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate onSubmit={login}>
            <FormControl fullWidth error={loginErr}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={onEmailChange}
              />
            </FormControl>
            <FormControl fullWidth error={loginErr}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={pass}
                onChange={onPassChange}
              />
            </FormControl>
            {/* <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={email.length < 6 || pass.length < 6}
            >
              Sign In
            </Button>
            <Grid container>
              {/* <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
              <Grid item>
                <Link href="#" variant="body2" onClick={goToRegister}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Copyright />
          </form>
        </div>
      </Grid>
    </Grid>
  );
};
