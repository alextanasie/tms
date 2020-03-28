import React, { ReactChildren } from "react";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Timecard } from "./components/Timecard";
import { ManageUsers } from "./components/ManageUsers";
import { BrowserRouter as Router, Switch, Route, Redirect, RouteProps } from "react-router-dom";
import "./App.css";
import decode from "jwt-decode";

export default function App() {
  return (
    <Router>
      <div>
        {/* https://reacttraining.com/react-router/web/example/auth-workflow */}
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          {/* <AuthRoute path="/timecard" render={props => <Timecard {...props} />} /> */}
          {/* <Timecard /> */}
          {/* </AuthRoute> */}

          {/* <Route path="/timecards" component={Timecard} /> */}
          <PrivateRoute path="/timecard">
            <Timecard />
          </PrivateRoute>
          <Route path="/manage-users" component={ManageUsers} />
          <Route path="/logout" render={() => <div>logout</div>} />
          <Route path="/" render={() => <div>404</div>} />
        </Switch>
      </div>
    </Router>
  );
}

const checkAuth = () => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");
  //TODO add functionality for refreshToken
  // https://www.youtube.com/watch?v=oRL-pttfNSc
  // https://www.youtube.com/watch?v=UA0AIkjI85c
  // console.log("do we get here", token, new Date().getTime() / 1000);
  if (!token || !refreshToken) {
    return false;
  }

  try {
    // const { exp } = decode(refreshToken);
    const { exp } = decode(token);
    if (exp < new Date().getTime() / 1000) {
      return false;
    }
  } catch (e) {
    return false;
  }

  return true;
};

interface PrivateRouteProps extends RouteProps {}

const PrivateRoute = ({ children, ...rest }: PrivateRouteProps) => {
  console.log("getting to private route");
  return (
    <Route
      {...rest}
      render={props =>
        checkAuth() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              // state: { from: location },
            }}
          />
        )
      }
    />
  );
};
