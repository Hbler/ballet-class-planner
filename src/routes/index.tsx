import { Routes as Switch, Route, Navigate } from "react-router-dom";

import Login from "../pages/login";
import SignIn from "../pages/signin";
import Home from "../pages/home";

import { CurrentUser } from "../providers/userProvider";

export default function Routes() {
  const { token } = CurrentUser();
  return (
    <Switch>
      <Route
        index
        element={!!token ? <Navigate to={"/home/:user"} /> : <Login />}
      />
      <Route
        path="/siging"
        element={!!token ? <Navigate to={"/home/:user"} /> : <SignIn />}
      />
      <Route
        path="/home/:user"
        element={!!token ? <Home /> : <Navigate to={"/"} />}
      />
    </Switch>
  );
}
