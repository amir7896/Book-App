import Axios from "axios";
// Authentication Header For Authorization ..
import authHeader from "../../../authHeader/AuthHeader";
import React, { useEffect, useState } from "react";
// Material UI Card for Display Book Data
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// Material UI Alert
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
// useNavigate for Navigation to other Pages and
// useLocation to get ID from Params ..
import { useNavigate, useLocation } from "react-router-dom";
// Material UI Upload Image  Input ....
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

// **********************************
// Update Book Material UI Porotion
// **********************************
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
// React Form Validation
import * as yup from "yup";
import { useFormik } from "formik";
// moment
import moment from "moment";
// Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Backend URL
const Base_URL = "http://localhost:4000";

// =================================
// Form Validation For Update Book
// =================================
const validationSchema = yup.object({
  title: yup.string("Enter your Book Title").required("Book Title is Required"),
  author: yup.string("Enter your Book Author").required("Password is required"),
  price: yup
    .number("Only Number 0 to 9 required")
    .required("Book Price is required")
    .positive("Only Positive Number required"),
  description: yup
    .string("Enter Your Book Description")
    .required("Book Description is Required"),
});
// ==========================================
// Style Input Image Button for Update Image
// ==========================================
const Input = styled("input")({
  display: "none",
});

// ~~~~~~~~~~~~~~~~~~
// Login User ID
// ~~~~~~~~~~~~~~~~~~
const userID = localStorage.getItem("userID");

// ****************************
// Functional Component Main
// ****************************
const BookDetail = () => {
  // *********************
  // All UseStates ....
  // *********************
  // Handling to open dialog for Update Book
  const [open, setOpen] = React.useState(false);
  // Get Single Book UseState
  const [book, setBook] = useState(null);
  // MUI Alert Implementation
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");

  // Update Alert ....
  const [alertupdate, setAlertupdate] = useState(false);
  const [alertContentupdate, setAlertContentupdate] = useState("");
  // Update Image useState
  const [image, setImage] = useState("");
  // Hide And Show Update Button State ...
  const [Show, setShow] = useState(false);

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
  // *******************
  // All Variables .....
  // *******************
  // For Navigate To Pages
  let navigate = useNavigate();
  // Alert Message
  let message = "";
  // For Getiing ID From the Prams
  const location = useLocation();
  const id = location.pathname.split("/")[2];

  // ===============
  // Get Book By ID
  // ===============
  const getBook = async () => {
    await Axios.get(`${Base_URL}/book/${id}`, {
      headers: {
        Authorization: authHeader(),
      },
    })
      .then((res) => {
        setBook(res.data);
        //  console.log("** Single Book **", res.data);
        // Image Array
        // console.log("++ Image Array ++", res.data.image[0].url);
      })
      .catch((err) => {
        console.log("** Error in Getting Book Detail ***", err.message);
      });
  };

  // ===================
  // Delete Book Method
  // ===================
  const deleteBook = async () => {
    await Axios.delete(`${Base_URL}/book/${id}`, {
      headers: {
        Authorization: authHeader(),
      },
    })
      .then((res) => {
        if (res.data.success) {
          message = res.data.message;
          setAlertContent(message);
          setAlert(true);
          setTimeout(() => {
            // Toast Message
            // Navigate To Home Page
            navigate("/books");

            // Show Toast Message
          }, 3000);
        }

        console.log("Response  ===", res.data);
      })
      .catch((err) => {
        console.log("Eror === ", err.message);
      });
  };
  // =======================
  // Get Single Book Method
  // =======================
  useEffect(() => {
    // Get Book By ID
    getBook();
  }, []);
  // *****************************
  // Update Book Form Validation
  // *****************************
  const formik = useFormik({
    initialValues: {
      title: book?.title,
      author: book?.author,
      price: book?.price,
      description: book?.description,
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    // ======================================
    // Update Book By ID On Submit Handle...
    // ======================================
    onSubmit: (values) => {
      Axios.put(`${Base_URL}/book/${id}`, values, {
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
              navigate(`/book/${id}`);
              getBook();
              console.log("Response == ", res.data);
            }, 3000);
          }
        })
        .catch((err) => {
          console.log("Error ====", err.message);
        });
    },
  });
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
    console.log("Form Data ==", image);
    formData.append("image", image);
    Axios.put(`${Base_URL}/book/update/${id}`, formData, {
      headers: {
        Authorization: authHeader(),
      },
    })
      .then((res) => {
        console.log("Response On Update Image ===", res.data);
        if (res.data.success) {
          toast.success("Image Updated Successfully !");
          getBook();
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
  // ==============
  // Returning JSX
  // ==============
  return (
    <>
      {/* Card */}
      {/* Delete Book Alert */}
      <Stack>
        {alert ? <Alert severity="success">{alertContent}</Alert> : <></>}
      </Stack>
      <Card
        sx={{
          mx: "auto",
          mt: 5,
          width: 600,
          maxWidth: "100%",
        }}
      >
        <CardMedia
          sx={{
            height: 250,
          }}
          component="img"
          alt="green iguana"
          height="140"
          image={book?.image[0].url}
        />
        {/* Upload Image Button */}
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
            Title: {book?.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {book?.description}
          </Typography>
          <Typography variant="h4">Author : {book?.author}</Typography>
          <Typography variant="h4">Price : {book?.price}</Typography>
          <Typography variant="h4">
            Created BY : {book?.createdBy.username}
          </Typography>
          <Typography variant="h4" component="div">
            Created At :{moment(book?.createdAt).format(" MMMM Do YYYY")}
          </Typography>
        </CardContent>
        {userID === book?.createdBy._id ? (
          <CardActions>
            <Button size="small" onClick={deleteBook}>
              delete
            </Button>
            <Button size="small" onClick={handleClickOpen}>
              Update
            </Button>
            <br></br>
          </CardActions>
        ) : (
          ""
        )}
      </Card>
      {/* Update Book Dialog */}
      {/* FOR Updating book */}
      <div>
        <Dialog open={open} onClose={handleClose}>
          {/* Update Book Alert */}
          <Stack sx={{ width: "100%" }} spacing={2}>
            {alertupdate ? (
              <Alert severity="success">{alertContentupdate}</Alert>
            ) : (
              <></>
            )}
          </Stack>
          <DialogTitle>Update Book</DialogTitle>

          <DialogContent>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                name="title"
                autoFocus
                margin="dense"
                label="Book Title"
                type="text"
                fullWidth
                variant="standard"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
              <TextField
                name="author"
                margin="dense"
                label="Book Author"
                type="text"
                fullWidth
                variant="standard"
                value={formik.values.author}
                onChange={formik.handleChange}
                error={formik.touched.author && Boolean(formik.errors.author)}
                helperText={formik.touched.author && formik.errors.author}
              />

              <TextField
                name="price"
                margin="dense"
                label="Book Price"
                type="text"
                fullWidth
                variant="standard"
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
              <TextField
                name="description"
                margin="dense"
                label="Book Description"
                type="text"
                fullWidth
                variant="standard"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Update</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
        {/* Toast Container */}
        <ToastContainer theme="colored" autoClose={2000} />
      </div>
    </>
  );
};

export default BookDetail;
