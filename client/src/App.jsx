import React from "react";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Timecard } from "./components/Timecard";
import { ManageUsers } from "./components/ManageUsers";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import "./App.css";
import { isUserAllowed, isUserAuthenticated } from "./utils/helpers";

export default function App() {
  return (
    <Router>
      <div>
        {/* https://reacttraining.com/react-router/web/example/auth-workflow */}
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <PrivateRoute path="/timecard">
            <Timecard />
          </PrivateRoute>
          <PrivateRoute path="/manage-users">
            <ManageUsers />
          </PrivateRoute>
          <Route path="/logout" render={() => <div>logout</div>} />
          <PrivateRoute exact path="/">
            {isUserAuthenticated() && !isUserAllowed("/timecard") ? (
              <Redirect to="/timecard" />
            ) : (
              <Redirect to="/login" />
            )}
          </PrivateRoute>
          <Route path="/" render={() => <div>404</div>} />
        </Switch>
      </div>
    </Router>
  );
}

const PrivateRoute = ({ children, ...rest }) => {
  const redirectTo = pathname => {
    return (
      <Redirect
        to={{
          pathname,
        }}
      />
    );
  };

  return (
    <Route
      {...rest}
      render={props =>
        isUserAuthenticated() && isUserAllowed(rest.path)
          ? children
          : isUserAuthenticated() && !isUserAllowed(rest.path)
          ? redirectTo("/timecard")
          : redirectTo("/login")
      }
    />
  );
};
