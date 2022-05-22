const dotenv = require("dotenv");
dotenv.config();

const DB = process.env.DB;
const JWT_SECRET = process.env.Secret;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const USER_EMAIL = process.env.USER_EMAIL;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const JWT_RESET_KEY = process.env.JWT_RESET_KEY;
const Cloud_name = process.env.CLOUD_NAME;
const Cloud_key = process.env.CLOUD_KEY;
const Cloud_secret = process.env.CLOUD_SECRET;
const ClientID_Eamil = process.env.CLIENT_ID_Email;
const ClientSecret_Email = process.env.CLIENT_SECRET_Email;
const Sendgrid_Api_Key=  process.env.SENDGRID_API_KEY

module.exports = {
  DB,
  JWT_SECRET,
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  USER_EMAIL,
  REFRESH_TOKEN,
  JWT_RESET_KEY,
  Sendgrid_Api_Key,
  Cloud_name,
  Cloud_key,
  Cloud_secret,
  ClientID_Eamil,
  ClientSecret_Email,
};
