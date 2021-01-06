const express = require("express");
const router = express.Router();
const path = require("path");
const BlogPost = require("../models/BlogPost");
const multer = require("multer");
var fs = require("fs");
const { storage } = require("../cloudinary");

//upload init
const upload = multer({
  storage: storage,
});

router.post("/save", upload.single("img"), (req, res) => {
  const data = {
    body: req.body.body,
    img: {
      url: req.file.path,
      filename: req.file.filename,
    },
  };

  // console.log("Data: ", req.file.filename);
  // console.log("img: ", req.file.url);

  const newBlogPost = new BlogPost(data);

  newBlogPost.save((err, val) => {
    if (err) {
      res.status(500).json({ msg: "Sorry, The data couldn't be saved" });
      // console.log("Reached the save errors! BLOGPOST", newBlogPost);
      return;
    }
    // console.log("printing the req here: ", val);
    res.json(val);
  });
});

//This is working totally fine!
router.get("/", (req, res) => {
  BlogPost.find()
    .then((data) => {
      console.log("from axios yay!");
      res.json(data);
    })
    .catch((err) => {
      console.log("error :", err);
    });
});

module.exports = router;
