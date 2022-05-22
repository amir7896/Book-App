import React, { useEffect, useState } from "react";
import Axios from "axios";
// Auth Header For Authenticaation
import authHeader from "../../../authHeader/AuthHeader";
// Material UI Card ....
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
// Material UI Grid ....
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
// Material UI Icon Button
import AddCircleIcon from "@mui/icons-material/AddCircle";
// Material UI Modal ....
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
// React From Validation ...
import * as yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
// Material UI Alert
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

// Form Validation ....
const validationSchema = yup.object({
  title: yup.string("Enter your Book Title").required("Book Title is Required"),
  author: yup.string("Enter your Book Author").required("Password is required"),
  price: yup
    .number("Only Number 0 to 9 required")
    .required("Book Price is required")
    .positive("Only Positive Number required"),
  image: yup.mixed().required("Picture  is Required"),
  description: yup
    .string("Enter Your Book Description")
    .required("Book Description is Required"),
});
// Base URL ...
const Base_URL = "http://localhost:4000";
// Bootstrap Dialog...
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
// Bootstrap Dialog Title
const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};
// Bootstrap Dialog Title Prop Types
BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

// =====================
// Functional Component
// =====================
const Books = () => {
  // =====================
  // All Use States ...
  // =====================
  // Modal Event For Open And Close  (Use State)..
  const [open, setOpen] = React.useState(false);
  const [books, setBooks] = useState(null);
  // Alert On Response
  const [alert, setAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  // New Method with file Upload...

  // ==========================
  // All Use Effects ......
  // ==========================
  const allBooks = async () => {
    await Axios.get(`${Base_URL}/book/books`, {
      headers: {
        Authorization: authHeader(),
      },
    })
      .then((response) => {
        setBooks(response.data.data);
        // console.log("=== Books List ===", response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    allBooks();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      author: "",
      price: "",
      image: null,
      description: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("price", values.price);
      formData.append("description", values.description);
      formData.append("author", values.author);
      formData.append("image", values.image);
      axios
        .post(`${Base_URL}/book/add`, formData, {
          headers: {
            Authorization: authHeader(),
          },
        })
        .then((res) => {
          if (res.data.success) {
            let message = res.data.message;
            setAlertContent(message);
            setAlert(true);
            allBooks();
            setTimeout(() => {
              handleClose();
            }, 3000);
          }
          //console.log("Response on add book == ", res.data);
        })
        .catch((err) => {
          console.log("Error ====", err.message);
        });
    },
  });

  // *******************
  // All variables .....
  // *******************
  // For Navigate To Pages
  // For Open Dialog
  const handleClickOpen = () => {
    setOpen(true);
  };
  //-------------------------- For Close Dialog -----------------------------//
  const handleClose = () => {
    setOpen(false);
    formik.setFieldValue("title", "");
    formik.setFieldValue("author", "");
    formik.setFieldValue("description", "");
    formik.setFieldValue("price", "");
    formik.setFieldValue("image", "");
  };

  return (
    <>
      {/* GRID */}
      <div>
        {/* Button Icon */}
        <Box item sx={{ mt: 1, ml: 2 }}>
          <Button
            variant="contained"
            onClick={handleClickOpen}
            endIcon={<AddCircleIcon />}
          >
            ADD-BOOK
          </Button>
        </Box>
      </div>
      <div>
        <Box sx={{ mt: 2, ml: 2 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 2, sm: 8 }}
            columns={{ xs: 4, sm: 8, md: 6 }}
            //mt={{ xs: 1, md: 1, sm: 3 }}
          >
            {books &&
              books.map((book) => (
                <Grid key={book._id}>
                  <Card sx={{ maxWidth: 400, m: 5 }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={book.image[0].url}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {book.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {book.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      {/* Book Detail Page */}
                      <Link to={`/book/${book._id}`}>
                        <Button variant="contained" size="large">
                          View Detail
                        </Button>
                      </Link>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
      </div>
      {/* ADD NEW BOOK DIALOG */}
      <div>
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <Stack>
            {alert ? <Alert severity="success">{alertContent}</Alert> : <></>}
          </Stack>
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          >
            ADD NEW BOOK
          </BootstrapDialogTitle>
          <DialogContent dividers>
            {/* *************************** */}
            {/* ADD Book Form */}
            {/* *************************** */}
            <form onSubmit={formik.handleSubmit}>
              {/* Ttitle Text  */}
              <TextField
                name="title"
                autoFocus
                autoComplete="off"
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
              {/* Author Text */}
              <TextField
                name="author"
                margin="dense"
                autoComplete="off"
                label="Book Author"
                type="text"
                fullWidth
                variant="standard"
                value={formik.values.author}
                onChange={formik.handleChange}
                error={formik.touched.author && Boolean(formik.errors.author)}
                helperText={formik.touched.author && formik.errors.author}
              />
              {/* Picture Input */}
              <input
                type="file"
                name="image"
                accept=".png, .jpeg, .jpg"
                onChange={(e) => {
                  formik.setFieldValue("image", e.target.files[0]);
                }}
              />
              {formik.touched.image && formik.errors.image ? (
                <div style={{ color: "#e53935", fontSize: "12px" }}>
                  {formik.errors.image}
                </div>
              ) : null}

              {/* Price Text Box */}
              <TextField
                name="price"
                margin="dense"
                autoComplete="off"
                label="Price"
                type="text"
                fullWidth
                variant="standard"
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
              {/* Description */}
              <TextField
                fullWidth
                name="description"
                autoComplete="off"
                margin="dense"
                variant="standard"
                placeholder="Description"
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
                <Button autoFocus type="submit">
                  Save changes
                </Button>
                <Button onClick={handleClose}>Cancel</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </BootstrapDialog>
      </div>
    </>
  );
};

export default Books;
