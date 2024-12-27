

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./pages/Navbar";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Userdata from "./pages/Userdata";

// Component to conditionally render the Navbar
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarPaths = ["/signin", "/signup"];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {children}
    </>
  );
};

// PrivateRoute component
const PrivateRoute = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem("user");
  return isAuthenticated ? element : <Navigate to="/signin" />;
};

function App() {
  return (
    <div className="App">
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />

            {/* Private Routes */}
           
            <Route
              path="/Userdata"
              element={<PrivateRoute element={<Userdata />} />}
            />

            {/* Redirect to Home for unknown routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
