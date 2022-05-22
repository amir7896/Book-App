const express = require("express");
const router = express.Router();
const users = require("../controller/auth");
const authenticated = require("../middleware/verifyToken");
// Image Upload to Cloudinarry
const multer = require("multer");
const { storage } = require("../cloudinary/profilePicCLOUD");
const upload = multer({ storage });
const cloudinary = require("cloudinary");

// Retister User ...
router.route("/register").post(users.register);

// Signup verificatrion
router.route("/activate/:token").get(users.verify);

// Forgot Password Route
router.route("/forgot").post(users.forgotPassword);

// Reset Password Route
router.route("/reset/:token").post(users.reset);

// Login User ...
router.route("/login").post(users.login);


// User Profile By Id
router.route("/user/:id").get(users.userById);

// Get All Users ...
router.route("/users").get(users.getUsers);

//  Get Profile
router.route("/profile").get(authenticated, users.profile);
// Update User Profile ...
router.route("/profile/update").put(authenticated, users.updateProfile);
// Update User Profile Picture ...
router
  .route("/userpicture/update")
  .put(authenticated, upload.array("profilePic"), users.updateUserPic);
module.exports = router;
