const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { CLIENT_ID, JWT_SECRET } = require("../config/index");
const client = new OAuth2Client(CLIENT_ID);

// Google Login ...
module.exports.googleLogin = async (req, res) => {
  console.log("goolge Login");
  try {
    const { tokenId } = req.body;
  //  console.log('Google TOKEN ID : ', tokenId);
    // Verify
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();
      // console.log("payload ==", payload);
      return payload;
    }
    verify()
      .then(async (response) => {
        let { sub, email, name } = response;
        // console.log("Google Login ID ==", sub);
        const userExist = await User.findOne({ email });

        if (userExist) {
          const token = jwt.sign({ userID: userExist._id }, JWT_SECRET, {
            expiresIn: "24h",
          });
          return res.status(200).json({
            success: true,
            message: "Login Successfully ",
            token: token,
            userid: userExist.id,
            username: userExist.username

          });
        } else {
          const newUser = new User({
            gogle_user_id: sub,
            username: name,
            email,
            login_type: "google",
          });
          const addUser = await newUser.save();
          if (addUser) {
            const token = jwt.sign({ userID: addUser._id }, JWT_SECRET, {
              expiresIn: "24h",
            });
            console.log("User Added Successfuly ===", addUser);
            return res.status(200).json({
              success: true,
              message: "Login Successfully !",
              token: token,
              username: addUser.username,
              userid: addUser.id
            });
          } else {
            console.log("User Not Added ==");
          }
        }
      })
      .catch((err) => {
        console.log("Error In Catch block of then ", err);
      });
  } catch (error) {
    console.log("== Google Login Error ==", error.message);
  }
};

module.exports.Login = async (req, res) => {
  console.log("Google Login");
};
