const express = require("express");
const router = express.Router();

const google = require("../controller/google_login");

// Google Login ..

router.route("/login").post(google.googleLogin);
module.exports = router;
