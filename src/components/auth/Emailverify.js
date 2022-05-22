import React from "react";
// Card
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate, useLocation } from "react-router-dom";
// Axios
import axios from "axios";
// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Backe end URL
const Base_URL = "http://localhost:4000";

const Emailverify = () => {
  //  Getiing Token From the Prams
  const location = useLocation();
  const token = location.pathname.split("/")[2];
  // Getting Verification Result ...
  axios
    .get(`${Base_URL}/activate/${token}`)
    .then((res) => {
      window.alert(res.data.message);
    })
    .catch((err) => {
      window.alert("User already register");
      console.log("** Error in account verification **", err.message);
    });
  return (
    <>
      <Card
        sx={{
          mx: "auto",
          mt: 5,
          width: 600,
          maxWidth: "100%",
        }}
      >
        <CardContent>
          <Typography variant="h2" sx={{ fontSize: 14 }} color="text.secondary">
            User Account Verification
          </Typography>
          <Typography variant="h5" component="div">
            simple card
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            adjective
          </Typography>
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </>
  );
};

export default Emailverify;
