import React from "react";
// MUI App Bar
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";

import AuthService from "../../services/Authentication";
// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Mui Style
import "./navstyle.css";

const Navbar = () => {
  let navigate = useNavigate();
  const auth = new AuthService();
  // Logout Uer
  const Logout = () => {
    toast.success("You are Logout Successfully!");
    auth.logout();
    navigate("/login");
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link
                to="/books"
                style={{ textDecoration: "none", color: "white" }}
              >
                BOOK-LIST
              </Link>
              {/* Home Page */}
              <Link
                variant="h6"
                style={{
                  textDecoration: "none",
                  color: "white",
                  boxShadow: "none",
                }}
                to={"/"}
              >
                <Button
                  style={{ backgroundColor: "transparent" }}
                  color="inherit"
                >
                  Home
                </Button>
              </Link>
            </Typography>
            {/* If User Login  */}
            {auth.isLoggedIn() ? (
              <>
                <Link
                  style={{
                    textDecoration: "none",
                    color: "white",
                    boxShadow: "none",
                  }}
                  to={"/profile"}
                >
                  <Button
                    style={{ backgroundColor: "transparent" }}
                    color="inherit"
                  >
                    Profile
                  </Button>
                </Link>
                {/* Logout Button */}
                <Button onClick={Logout} color="inherit">
                  Logout
                </Button>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Link
                  style={{
                    textDecoration: "none",
                    color: "white",
                    boxShadow: "none",
                  }}
                  to={"/login"}
                >
                  <Button
                    style={{ backgroundColor: "transparent" }}
                    color="inherit"
                  >
                    Login
                  </Button>
                </Link>
                {/* Register Button */}
                <Link
                  style={{
                    textDecoration: "none",
                    color: "white",
                    _hover: {
                      boxShadow: "none",
                    },
                  }}
                  to={"/register"}
                >
                  <Button
                    style={{ backgroundColor: "transparent" }}
                    color="inherit"
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}
          </Toolbar>
        </AppBar>
        <ToastContainer theme="colored" autoClose={2000} />
      </Box>
    </>
  );
};

export default Navbar;
