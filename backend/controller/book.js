const Book = require("../models/book");
const multer = require("multer");
const cloudinary = require("cloudinary");

// ======================
// Getting All Books
// ====================
module.exports.Get = async (req, res) => {
  try {
    const books = await Book.find({});
    if (books) {
      return res.json({ success: true, data: books });
    } else {
      return res.json({ success: false, message: "No Books Available" });
    }
  } catch (err) {
    console.log("** Error In Gettign All Books ***", err.message);
  }
};

// ==============================
// Adding new Books
// =============================
module.exports.add = async (req, res) => {
  try {
    if (!req.body.title)
      return res.json({ success: false, message: "Title Is Required" });
    if (!req.body.author)
      return res.json({ success: false, message: "Book Author Is Required" });
    // if (!req.body.image)
    //   return res.json({
    //     success: false,
    //     message: "image is required",
    //   });
    if (!req.body.description)
      return res.json({
        success: false,
        message: "Book Description Is Required",
      });

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      image: req.body.image,
      description: req.body.description,
      price: req.body.price,
    });
    book.createdBy = req.userID;
    // Uploading Image
    book.image = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    // console.log("=== Req.files ===", req.files);
    //console.log("Login User ===", req.userID);
    const addBook = await book.save((err, newbook) => {
      if (err) {
        res.json({
          success: false,
          message: "There was an error to added book",
        });
      } else {
        res.json({
          success: true,
          message: "Book added Successfully!",
          data: newbook,
        });
      }
    });
  } catch (error) {}
};

// ==================
// Getting Book By ID
// ==================

module.exports.singleBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id).populate("createdBy");
    if (!book) {
      console.log("Book not found by Given ID", id);
    } else {
      //console.log("Book ===", book);
      res.send(book);
    }
  } catch (error) {
    console.log("** Error in getting book by id **", error.message);
  }
};

// delete Book by id
module.exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const delBook = await Book.findByIdAndDelete(id);
    // console.log("** Deleted Book ==", delBook);
    // Deleting Image from the cloudinary
    // console.log("name of image in Cloudinary ==", delBook.image[0].filename);
    cloudinary.v2.uploader.destroy(delBook.image[0].filename);

    if (delBook) {
      res
        .status(200)
        .json({ success: true, message: "Book deleted Successfully!" });
    } else {
      res.status(400).json({
        success: false,
        message: "Book Not Deleted There is an error",
      });
    }
  } catch (err) {}
};
// Find Book By ID and Update
module.exports.updateBook = async (req, res) => {
  const { id } = req.params;
  console.log("ID ==", id);
  const book = req.body;
  console.log("body ==", req.body);

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { $set: book },
      { new: true }
    );
    if (updatedBook) {
      res
        .status(200)
        .json({ success: true, message: "Book Updated Successfully!" });
    } else {
      res.status(400).json({
        success: false,
        message: "Book Not Updated There Is an error!",
      });
    }
  } catch (err) {
    console.log("** Error In Update Book **", err.message);
  }
};
// Update Image To Cloudinary ....
module.exports.updateImage = async (req, res) => {
  console.log("REq files ===", req.files);
  console.log("Image Update Route");
  const { id } = req.params;
  const book = req.body;
  console.log("Book ID ==", id);
  try {
    const findBook = await Book.findById(id);
    console.log("boo.img ===", book.image);
    console.log("Req.files ===", req.files);
    console.log("Req.boyd ===", req.body);
    cloudinary.v2.uploader.explicit(findBook.image[0].filename);
    book.image = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    const updatedImage = await Book.findByIdAndUpdate(id, { $set: book });
    //Delete Previous Image when update Image ......
    //cloudinary.v2.uploader.destroy(findBook.image[0].filename);
    if (!updatedImage) {
      console.log("** Image Not Updated **");
      return res.status(400).json({
        success: false,
        message: "There is an error image not updated try againg",
      });
    } else {
      console.log("** Image Updated Succssfully !");
      return res
        .status(200)
        .json({ success: true, message: "Image Updated Succssfully !" });
    }
  } catch (err) {
    console.log("=== Error in Catch Block of Image Update ===", err);
  }
};
