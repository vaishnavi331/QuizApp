// PrivateRoute.js
import React from 'react';
import { Navigate, Route } from 'react-router-dom';

const PrivateRoute = ({ element, authenticated, redirectTo, ...rest }) => {
  return authenticated ? (
    <Route {...rest} element={element} />
  ) : (
    <Navigate to={redirectTo} />
  );
};

export default PrivateRoute;
