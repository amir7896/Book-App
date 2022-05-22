import React, { useState } from "react";
import Axios from "axios";
// Material UI Controls for Register Form ...
import TextField from "@mui/material/TextField";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// React From Validation ...
import * as yup from "yup";
import { useFormik } from "formik";
// For Navigations .....
import { useNavigate } from "react-router-dom";
// Material UI Alert
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

// Form Validation ....
const validationSchema = yup.object({
  username: yup.string("Enter User Name").required("Usernaem is required!"),
  email: yup
    .string("Enter Your Email")
    .required("Email is required")
    .email("Please Provide a valid email!"),
  password: yup.string("Enter Your Password").required("Password is Required"),
});
// Base URL ...
const Base_URL = "http://localhost:4000";
const Register = () => {
  // Alert On success Response
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  // Alert On error Response
  const [alerterr, setAlerterr] = useState(false);
  const [alertContenterr, setAlertContenterr] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      // Register New User ....
      Axios.post(`${Base_URL}/register`, values)
        .then((res) => {
          if (res.data.success) {
            let message = res.data.message;
            setAlertContent(message);
            setAlert(true);

            setTimeout(() => {
              resetForm({});
              navigate("/login");
            }, 3000);
          } else {
            let msg = res.data.message;
            setAlertContenterr(msg);
            setAlerterr(true);
          }
          console.log("Response on User Registration == ", res.data);
        })
        .catch((err) => {
          console.log("Error ====", err.message);
        });
    },
  });
  // JSX File ....
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
          Registration Page
        </Typography>
        {/* Register Form */}
        <form onSubmit={formik.handleSubmit}>
          <TextField
            name="username"
            autoFocus
            margin="dense"
            label="user name"
            type="text"
            fullWidth
            variant="standard"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
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
          <Button variant="contained" fullWidth={true} type="submit">
            Register
          </Button>
        </form>
      </Container>
    </>
  );
};

export default Register;
