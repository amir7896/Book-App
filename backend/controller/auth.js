const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
// OAuth ...
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const cloudinary = require("cloudinary");
// send grid ..
const sgMail = require("@sendgrid/mail");
// All Env Variables Use .....
const {
  JWT_SECRET,
  REDIRECT_URI,
  USER_EMAIL,
  REFRESH_TOKEN,
  JWT_RESET_KEY,
  Sendgrid_Api_Key

} = require("../config/index");
// set sendgrid api key ..
sgMail.setApiKey(
  Sendgrid_Api_Key
);
// Jwt Reset Key
const jwt_reset_key = JWT_RESET_KEY;
// Register New User ...
module.exports.register = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    if (!req.body.username)
      return res.json({ success: false, message: "Username Required !" });
    if (!req.body.email)
      return res.json({ success: false, message: "Email  Required !" });
    if (!req.body.password)
      return res.json({ success: false, message: "Password  Required !" });

    // Email Verification Process
    const token = jwt.sign({ username, email, password }, JWT_SECRET, {
      expiresIn: "30m",
    });
    const CLIENT_URL = " http://localhost:3000"; //"http://" + req.headers.host;

    const output = `
              <h2>Please click on below link to activate your account</h2>
              <p>${CLIENT_URL}/activate/${token}</p>
              <p><b>NOTE: </b> The above activation link expires in 30 minutes.</p>
              `;

            const msg = {
            to: email, // Change to your recipient
            from: "amirshahzad07896@gmail.com", // Change to your verified sender
            subject: "Account Verification: ✔",
            text: "BOOK-APP",
            html: output,
            };
            sgMail
            .send(msg)
            .then((response) => {
              console.log("Mail sent : %s", response);
              return res.status(200).json({
                success: true,
                message: "Email Verification Link is Sent to your Email",
              });
            })
            .catch((error) => {
              console.error(error);
            });
  } catch (e) {
    console.log("** Error Register User **", e.message);
  }
};
// Email Verification Handling .....
module.exports.verify = (req, res) => {
  const token = req.params.token;
  try {
    const token = req.params.token;
    if (token) {
      jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
        if (err) {
          console.log("** JWT Verification error in verify email **", err);
          return res.status(400).json({
            success: false,
            message: "Something went wrong or emial verify link expired",
          });
        } else {
          const { username, email, password } = decodedToken;
          User.findOne({ email: email }).then((user) => {
            if (user) {
              console.log("User Already Register ===", user);
              return res
                .status(400)
                .json({ success: false, message: "User already register" });
            } else {
              let user = new User({
                username,
                email,
                password,
                login_type: "email",
              });

              // Save New User
              user.save((err) => {
                if (err) {
                  if (err.code === 11000) {
                    console.log("email already exists verfication error");
                    return res.json({
                      success: false,
                      message: "Email Already Exists!",
                    });
                  } else {
                    console.log("** User Not Verified **", err);
                    return res.json({
                      success: false,
                      message: "User Not Registered!",
                    });
                  }
                } else {
                  console.log("User Verified Successfully !");
                  return res.json({
                    success: true,
                    message:
                      "User Email Verify Successfully Now You Can Login , Thank's!",
                    data: user,
                  });
                }
              });
            }
          });
        }
      });
    } else {
      console.log("Account activation error!");
    }
  } catch (err) {
    console.log("** Error in user Verfication catch Block **", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};
// Find User By ID
module.exports.userById = (req, res) => {
  res.send("User Profile by Id");
};

// Fogotten Password Handling ...
module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email)
      return res.json({
        success: false,
        message: "Enter Your email for reset Password",
      });
    await User.findOne({ email: email })
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "30m",
        });
        const CLIENT_URL = "http://localhost:3000";

        const output = `
              <h2>Please click on below link to reset your Password</h2>
              <p>${CLIENT_URL}/reset/${token}</p>
              <p><b>NOTE: </b> This  link expires in 30 minutes.</p>
              `;
        User.updateOne({ resetLink: token }, (err, success) => {
          if (err) {
            console.log("** Error in adding reset Link **", err.message);
            return res
              .status(400)
              .json({ success: false, message: err.message });
          } else {
            const msg = {
            to: email, // Change to your recipient
            from: "amirshahzad07896@gmail.com", // Change to your verified sender
            subject: "Password Reset: ✔",
            text: "BOOK-APP",
            html: output,
            };
            sgMail
            .send(msg)
            .then((response) => {
              console.log("Mail sent : %s", response);
              return res.status(200).json({
                success: true,
                message: " Reset Password Link is Sent to your Email",
              });
            })
            .catch((error) => {
              console.error(error);
            });
          }
        });
      })
      .catch((err) => {
        console.log("** Error In Sending Reset Password Mail **", err);
        return res.json({
          success: false,
          message: "Email not exists",
        });
      });
  } catch (err) {
    console.log("** Error In Catch Block password reset **", err.message);
    return res.status(400).json({ success: false, message: err.message });
  }
};

// Reset Password Handling ....
module.exports.reset = async (req, res) => {
  var { password, confirmpass } = req.body;
  const { token } = req.params;
  try {
    // console.log("ID ===", token);
    if (!password)
      return res
        .status(400)
        .json({ success: false, message: "Please enter password !" });
    if (!confirmpass)
      return res
        .status(400)
        .json({ success: false, message: "Please enter confirm password !" });
    if (password != confirmpass)
      return res
        .status(400)
        .json({ success: false, message: "Password confirms not match !" });

    if (token) {
      jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
        if (err) {
          console.log("** Password Reset User Token Error ** ", err);
          return res.status(400).json({
            success: false,
            message: "Invalid Token For Password reset",
          });
        } else {
          const userId = decodedToken._id;
          console.log("** Id in token ==", userId);
          console.log("Deocoded Token ===", decodedToken);
          // Bcrypting Password ..
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) {
                console.log("** Error in bcrypting password **", err);
              } else {
                password = hash;
                // Updating User Password ...
                User.findByIdAndUpdate(
                  userId,
                  { password, resetLink: "" },
                  (err, result) => {
                    if (err) {
                      console.log("** Error in Password reset **", err);
                      return res
                        .status(400)
                        .json({ success: false, message: err.message });
                    } else {
                      console.log("=== Result of password reset ===", result);
                      console.log("** Password Reset Successfully !");
                      return res.status(200).json({
                        success: true,
                        message: "Password Reset Successfully !",
                      });
                    }
                  }
                );
              }
            });
          });
        }
      });
    }

    // res.send("Reset Password Route");
  } catch (err) {
    console.log("** Error in catch Block of password reset ***", err.message);
    return res.status(400).json({ success: false, message: err.message });
  }
};
// Login User  Handling .....
module.exports.login = async (req, res) => {
  try {
    if (!req.body.email)
      return res.json({ success: false, message: "Email Required !" });
    if (!req.body.password)
      return res.json({ success: false, message: "Password Required !" });

    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
       return  res.json({ success: false, err });
      } else {
        if (!user) {
          return res.json({ success: false, message: "User Not Exists !" });
        } else {
          const validPassword = user.comparePassword(req.body.password);
          if (!validPassword) {
            res.json({
              success: false,
              message: "Invalid User Name Or Password",
            });
          } else {
            const token = jwt.sign({ userID: user._id }, JWT_SECRET, {
              expiresIn: "24h",
            });
            // console.log("User ===", user);
            res.json({
              success: true,
              message: "Login Successfully !",
              token: token,
              username: user.username,
              userid: user.id
            });
          }
        }
      }
    });
  } catch (error) {
    console.log("** Login Error **", error);
  }
};
// Get All Users ...
module.exports.getUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    if (!allUsers)
      return res.json({ success: false, message: "Users Not Founds !" });
    if (allUsers) return res.json({ success: true, Users: allUsers });
  } catch (error) {
    console.log("** Getting Users Error **", error);
  }
};
// Get Profile ...
module.exports.profile = async (req, res) => {
  try {
    User.findOne({ _id: req.userID })
      .select("username email profilePic address country")
      .exec((err, user) => {
        if (err) {
          res.json({ success: false, err });
        } else {
          if (!user) {
            res.json({ success: false, message: "User Not Found !" });
          } else {
            res.json({ success: true, User: user });
          }
        }
      });
  } catch (error) {}
};
// Update User Profile ...
module.exports.updateProfile = async (req, res) => {
  const userID = req.userID;
  const uesr = req.body;
  try {
    const findUser = await User.findById(userID);
    console.log("** find User **", findUser);
    // uesr.profilePic = req.files.map((f) => ({
    //   url: f.path,
    //   filename: f.filename,
    // }));
    const updateUser = await User.findByIdAndUpdate(userID, { $set: uesr });
    if (updateUser) {
      // cloudinary.v2.uploader.destroy(findUser.profilePic[0].filename);

      return res.status(200).json({
        success: true,
        message: "User Updated Successfully",
        User: findUser,
      });
    } else {
      return res
        .status(400)
        .json({ success: true, message: "User not Updated" });
    }
  } catch (err) {
    console.log("** Error In User Updating Profile **", err);
  }
};

// Updating User Profile Pic ....
module.exports.updateUserPic = async (req, res) => {
  const userid = req.userID;
  const user = req.body;
  try {
    user.profilePic = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    const updatedProfile = await User.findByIdAndUpdate(userid, { $set: user });
    if (updatedProfile) {
      console.log("** User Profile Picture Updated Succssfully !");
      return res
        .status(200)
        .json({ success: true, message: "User Profile Picture Updated !" });
    } else {
      console.log("** User profile Picture Not Updated !");
      return res.status(400).json({
        success: false,
        message: "User Profile Picture not updated !",
      });
    }
  } catch (err) {
    console.log("** Error In Updating User Profile Pic", err);
  }
};
