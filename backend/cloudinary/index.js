const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { Cloud_name, Cloud_key, Cloud_secret } = require("../config/index");
cloudinary.config({
  cloud_name: Cloud_name,
  api_key: Cloud_key,
  api_secret: Cloud_secret,
});

// Book Storage ...
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Book App 2022",
    allowedFormats: ["png", "jpg", "jpeg"],
  },
});

module.exports = {
  storage,
  cloudinary,
};
