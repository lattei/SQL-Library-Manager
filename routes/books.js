const express = require("express");
const router = express.Router();
const Book = require("../models").Book;
const { Op } = require("sequelize");

/* Handler function to wrap each route with */

function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      //Forward this to the global error handler!
      next(error);
    }
  }
}

/* GET */
router.get('/new', (req, res) => {
  res.render('new-book', { title: "New Book" });
});

/* CREATE  / Post Books
// Route: get /books/new - Shows the create new book form
// View: new-book.pug - for the new book form
// Create Book Route */
router.post('/new', asyncHandler(async(req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render("new-book", { book, errors: error.errors})
    } else {
      throw error;
    }
  }
}));



module.exports = router;
