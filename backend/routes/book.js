const express = require("express");
const router = express.Router();
const book = require("../controller/book");
const authenticated = require("../middleware/verifyToken");
// Image Upload to Cloudinarry
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
// get all books
router.route("/books").get(book.Get);
// add book
router.route("/add").post(authenticated, upload.array("image"), book.add);
// get book by id
router.route("/:id").get(authenticated, book.singleBook);
//delete book by id
router.route("/:id").delete(authenticated, book.deleteBook);
// Update Book By ID
router.route("/:id").put(authenticated, book.updateBook);
// Update Image Of A Book By Id
router
  .route("/update/:id")
  .put(authenticated, upload.array("image"), book.updateImage);
module.exports = router;
