import React, { useState } from "react";
import Axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
// Material UI Alert
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
// Form Validation ....
const validationSchema = yup.object({
  confirmpass: yup
    .string("Enter Your Confirm Password")
    .required("Confirm Password is Required"),
  password: yup.string("Enter Your Password").required("Password is Required"),
});
// Backend URL ...
const Base_URL = "http://localhost:4000";

const Reset = () => {
  // Alert On success Response
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  // Alert On error Response
  const [alerterr, setAlerterr] = useState(false);
  const [alertContenterr, setAlertContenterr] = useState("");
  //  Getiing Token From the Prams
  const location = useLocation();
  const token = location.pathname.split("/")[2];
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmpass: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      // Register New User ....
      Axios.post(`${Base_URL}/reset/${token}`, values)
        .then((res) => {
          if (res.data.success) {
            let message = res.data.message;
            setAlertContent(message);
            setAlert(true);

            setTimeout(() => {
              resetForm({});
              navigate("/");
            }, 3000);
          } else {
            let msg = res.data.message;
            setAlertContenterr(msg);
            setAlerterr(true);
          }
          console.log("Response On Password Reset == ", res.data);
        })
        .catch((err) => {
          console.log("Error ====", err.message);
        });
    },
  });
  const navigate = useNavigate();
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
          Password Reset
        </Typography>
        {/* Register Form */}
        <form onSubmit={formik.handleSubmit}>
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
          <TextField
            name="confirmpass"
            margin="dense"
            label="Confirm Password"
            type="password"
            fullWidth
            variant="standard"
            value={formik.values.confirmpass}
            onChange={formik.handleChange}
            error={
              formik.touched.confirmpass && Boolean(formik.errors.confirmpass)
            }
            helperText={formik.touched.confirmpass && formik.errors.confirmpass}
          />
          <Button variant="contained" fullWidth={true} type="submit">
            Reset Password
          </Button>
          {/* Forgot Password Button */}
        </form>
      </Container>
    </>
  );
};

export default Reset;
