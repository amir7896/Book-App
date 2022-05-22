
const sgMail = require("@sendgrid/mail");
const jwt = require('jsonwebtoken')
const {
  Sendgrid_Api_Key,
  JWT_SECRET,
REDIRECT_URI,
USER_EMAIL,
REFRESH_TOKEN,
JWT_RESET_KEY,} = require('../config/index');


module.exports.sgMail{
  const token = jwt.sign({ username, email, password }, JWT_SECRET, {
    expiresIn: "30m",
  });
  const CLIENT_URL = " http://localhost:3000"; //"http://" + req.headers.host;

  const output = `
            <h2>Please click on below link to activate your account</h2>
            <p>${CLIENT_URL}/activate/${token}</p>
            <p><b>NOTE: </b> The above activation link expires in 30 minutes.</p>
            `;
}
