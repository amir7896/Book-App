import React, { useState } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
// Material UI Controls for Register Form ...
import TextField from "@mui/material/TextField";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// Google Login
import { GoogleLogin } from "react-google-login";
// React From Validation ...
import * as yup from "yup";
import { useFormik } from "formik";
// For Navigations .....
// Material UI Alert
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

// Form Validation ....
const validationSchema = yup.object({
  email: yup
    .string("Enter Your Email")
    .required("Email is required")
    .email("Please Provide a valid email!"),
  password: yup.string("Enter Your Password").required("Password is Required"),
});
const Base_URL = "http://localhost:4000";

const Login = () => {
  // Alert On success Response
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  // Alert On error Response
  const [alerterr, setAlerterr] = useState(false);
  const [alertContenterr, setAlertContenterr] = useState("");
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      // Register New User ....
      Axios.post(`${Base_URL}/login`, values)
        .then((res) => {
          if (res.data.success) {
            let message = res.data.message;
            setAlertContent(message);
            setAlert(true);
            let token = res.data.token;
            console.log("Login Response ===", res.data);
            localStorage.setItem("x-access-token", token);
            localStorage.setItem("userID", res.data.userid);
            localStorage.setItem("userName", res.data.username);

            setTimeout(() => {
              resetForm({});
              navigate("/books");
            }, 3000);
          } else {
            let msg = res.data.message;
            setAlertContenterr(msg);
            setAlerterr(true);
          }
          console.log("Response on User Login == ", res.data);
        })
        .catch((err) => {
          console.log("Error ====", err.message);
        });
    },
  });
  const navigate = useNavigate();
  // **********************
  // Google Login
  // ***********************

  // ========================
  // Google Success Response
  // =========================
  const responseSuccessGoogle = (response) => {
    Axios({
      method: "POST",
      url: "http://localhost:4000/google/login",
      data: { tokenId: response.tokenId },
    })
      .then((res) => {
        console.log("Backend google response success ===", res.data);
        localStorage.setItem("x-access-token", res.data.token);
        localStorage.setItem("userID", res.data.userid);
        localStorage.setItem("userName", res.data.username);
        setTimeout(() => {
          // resetForm({});
          navigate("/books");
        }, 3000);
      })
      .catch((err) => {
        console.log("Backend google response error ====", err);
      });
  };
  // ========================
  // Google Failure Response
  // ========================
  const responseFailureGoogle = (response) => {};

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {/* Success Alert */}
        <Stack>
          {alert ? <Alert severity="success">{alertContent}</Alert> : <></>}
        </Stack>
        {/* Error Alert */}
        <Stack>
          {alerterr ? <Alert severity="error">{alertContenterr}</Alert> : <></>}
        </Stack>
        <Typography variant="h3" gutterBottom component="div">
          Login Page
        </Typography>
        {/* Register Form */}
        <form onSubmit={formik.handleSubmit}>
          <TextField
            name="email"
            margin="dense"
            label="email"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            name="password"
            margin="dense"
            label="password"
            type="password"
            fullWidth
            variant="standard"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <div className="m-2">
            <GoogleLogin
              clientId="YOUR GOOGLE CLIENT ID"
              buttonText="Login With Google"
              onSuccess={responseSuccessGoogle}
              onFailure={responseFailureGoogle}
              cookiePolicy={"single_host_origin"}
            />
          </div>
          <Button variant="contained" fullWidth={true} type="submit">
            Login
          </Button>
          {/* Google Login */}

          {/* Forgot Password Button */}
          <Link
            style={{
              textDecoration: "none",
              color: "white",
              boxShadow: "none",
            }}
            to={"/forgot"}
          >
            <Button
              sx={{ mt: 1 }}
              variant="contained"
              fullWidth={true}
              type="submit"
            >
              Forgot Password
            </Button>
          </Link>
        </form>
      </Container>
    </>
  );
};

export default Login;
