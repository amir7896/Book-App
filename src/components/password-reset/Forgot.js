import React, { useState } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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
  email: yup
    .string("Enter Your Email")
    .required("Email is required")
    .email("Please Provide a valid email!"),
});
// Backend URL
const Base_URL = "http://localhost:4000";

const Forgot = () => {
  // Alert On success Response
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  // Alert On error Response
  const [alerterr, setAlerterr] = useState(false);
  const [alertContenterr, setAlertContenterr] = useState("");
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      // Register New User ....
      Axios.post(`${Base_URL}/forgot`, values)
        .then((res) => {
          if (res.data.success) {
            let message = res.data.message;
            setAlertContent(message);
            setAlert(true);
            setTimeout(() => {
              resetForm({});
              //   navigate("/");
            }, 3000);
          } else {
            let msg = res.data.message;
            console.log("Message of forgot ", msg);
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
          Forgot Password Page
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
          <Button variant="contained" fullWidth={true} type="submit">
            Send Mail
          </Button>
        </form>
      </Container>
    </>
  );
};

export default Forgot;
