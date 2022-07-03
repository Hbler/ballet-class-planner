import { Routes as Switch, Route, Navigate } from "react-router-dom";

import Login from "../pages/login";
import SignUp from "../pages/signup";
import Home from "../pages/home";

import { ContextUser } from "../providers/userProvider";

export default function Routes() {
  const { token } = ContextUser();
  return (
    <Switch>
      <Route index element={!!token ? <Navigate to={"/home"} /> : <Login />} />
      <Route
        path="/signup"
        element={!!token ? <Navigate to={"/home"} /> : <SignUp />}
      />
      <Route
        path="/home"
        element={!!token ? <Home /> : <Navigate to={"/"} />}
      />
    </Switch>
  );
}
