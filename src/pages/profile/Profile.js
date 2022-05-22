import React, { useState, useEffect } from "react";
// Material UI
import Button from "@mui/material/Button";
import Axios from "axios";
// For Authentication
import authHeader from "../../authHeader/AuthHeader";
// **********************************
// Update User Form Material UI Porotion
// **********************************
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

// Material UI Card...
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
// Material UI Alert
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
// React Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Material UI Avatar ...
import Avatar from "@mui/material/Avatar";
// React Form Validation
import * as yup from "yup";
import { useFormik } from "formik";
// =================================
// Form Validation For Update Book
// =================================
const validationSchema = yup.object({
  address: yup
    .string("Enter User Address")
    .required("User Address is required !"),
  country: yup
    .string("Enter User Country")
    .required("User country name is required !"),
});
// ==========================================
// Style Input Image Button for Update Image
// ==========================================
const Input = styled("input")({
  display: "none",
});

// Base URL ...
const Base_URL = "http://localhost:4000";

// ====================
// Functional Component
// ====================
const Profile = () => {
  // User useState...
  const [user, setUser] = useState(null);
  // Open Close Dialog Use State..
  const [open, setOpen] = useState(false);
  // MUI Alert Implementation
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");

  // Update Alert ....
  const [alertupdate, setAlertupdate] = useState(false);
  const [alertContentupdate, setAlertContentupdate] = useState("");
  // Update Profile Picture  useState
  const [profilePic, setImage] = useState("");
  // Hide And Show Update Button State ...
  const [Show, setShow] = useState(false);
  let message = "";
  // ***********************************
  // All Methods Used in Component ....
  // ***********************************
  // For Open Update Form Dialog
  const handleClickOpen = () => {
    setOpen(true);
  };
  // For Close Update Form Dialog
  const handleClose = () => {
    setOpen(false);
  };

  // ====================
  // Getting Login User
  // ====================
  const User = async () => {
    await Axios.get(`${Base_URL}/profile`, {
      headers: {
        Authorization: authHeader(),
      },
    })
      .then((res) => {
        setUser(res.data.User);
        // console.log(res.data);
      })
      .catch((err) => {
        console.log("** Error In getting User **", err.message);
      });
  };
  useEffect(() => {
    User();
  }, []);

  // ======================
  // Updating User Profile
  // =======================
  const formik = useFormik({
    initialValues: {
      address: "",
      country: "",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    // ======================================
    // Update Book By ID On Submit Handle...
    // ======================================
    onSubmit: (values) => {
      Axios.put(`${Base_URL}/profile/update`, values, {
        headers: {
          Authorization: authHeader(),
        },
      })
        .then((res) => {
          if (res.data.success) {
            message = res.data.message;
            setAlertContentupdate(message);
            setAlertupdate(true);
            setTimeout(() => {
              handleClose();
              //navigate(`/book/${id}`);
              User();
              // console.log("Response == ", res.data);
            }, 3000);
          }
        })
        .catch((err) => {
          console.log("Error ====", err.message);
        });
    },
  });
  // *******************************************
  // Updating User Profile Picture ...........
  // *******************************************
  // ======================================
  // Hangle Change Input of Update Image
  // ======================================
  const fileSelectHandler = (e) => {
    setImage(e.target.files[0]);
    console.log("== File Change Handler ==", e.target.files[0]);
    setShow(true);
  };
  // ======================
  // Update Image Function
  // ======================
  const changeImage = (e) => {
    e.preventDefault();
    const formData = new FormData();
    console.log("Form Data ==", profilePic);
    formData.append("profilePic", profilePic);
    Axios.put(`${Base_URL}/userpicture/update`, formData, {
      headers: {
        Authorization: authHeader(),
      },
    })
      .then((res) => {
        console.log("Response On Update Image ===", res.data);
        if (res.data.success) {
          toast.success("Image Updated Successfully !");
          User();
          setShow(false);
          // setTimeout(() => {
          //   navigate(`/book/${id}`);
          //   getBook();
          //   console.log("Response == ", res.data);
          // }, 3000);
        }
      })
      .catch((err) => {
        console.log("Error In Update Image ===", err);
      });
  };

  return (
    <>
      {/* User Info Card */}
      <Card
        sx={{
          mx: "auto",
          mt: 5,
          width: 600,
          maxWidth: "100%",
          sm: "auto",
        }}
      >
        <Stack direction="row" spacing={2}>
          <Avatar
            sx={{ width: 600, height: 200, xs: 100, sm: 500 }}
            variant="square"
            src={user?.profilePic[0].url}
          ></Avatar>
        </Stack>
        {/* {user?.profilePic[0]?.url ? (
          <CardMedia
            style={{ borderRadius: "50%" }}
            component="img"
            height="300"
            image={user?.profilePic[0].url}
            alt="green iguana"
          />
        ) : (
          <CardMedia
            component="img"
            height="400"
            image="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
            alt="green iguana"
          />
        )} */}
        {/* Update image Content */}
        {/* Update Image Form */}
        <form onSubmit={changeImage} encType="multpart/form-data">
          <Stack direction="row" alignItems="center" spacing={2}>
            <label>
              <Input
                accept="image/*"
                id="icon-button-file"
                type="file"
                name="image"
                onChange={fileSelectHandler}
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <PhotoCamera />
              </IconButton>
            </label>
            {Show && (
              <div>
                <Button variant="contained" type="submit">
                  Update
                </Button>
              </div>
            )}
          </Stack>
        </form>

        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {user?.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.address}
          </Typography>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            color="text.secondary"
          >
            {user?.country}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            sx={{ mt: 1 }}
            variant="contained"
            fullWidth={true}
            type="submit"
            onClick={handleClickOpen}
            size="small"
          >
            Update-Profile
          </Button>
        </CardActions>
      </Card>

      {/* Update User Profile Content */}
      <div>
        <form onSubmit={formik.handleSubmit}>
          <Dialog open={open} onClose={handleClose}>
            {/* Update Book Alert */}
            <Stack sx={{ width: "100%" }} spacing={2}>
              {alertupdate ? (
                <Alert severity="success">{alertContentupdate}</Alert>
              ) : (
                <></>
              )}
            </Stack>
            <DialogTitle>Update Profile</DialogTitle>

            <DialogContent>
              <form>
                <TextField
                  name="address"
                  margin="dense"
                  label="Address"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.address && Boolean(formik.errors.address)
                  }
                  helperText={formik.touched.address && formik.errors.address}
                />

                <TextField
                  name="country"
                  margin="dense"
                  label="Country"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.country && Boolean(formik.errors.country)
                  }
                  helperText={formik.touched.country && formik.errors.country}
                />
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button type="submit">Update</Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
        </form>
        {/* Toast Container */}
        <ToastContainer theme="colored" autoClose={2000} />
      </div>
    </>
  );
};

export default Profile;
