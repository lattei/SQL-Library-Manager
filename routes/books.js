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




/* CREATE  / Post Books
/books/:id
// Create Book Route */
router.post('/new', asyncHandler(async(req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    //Becomes an update form
    //res.redirect("/books/" + book.id);
    //Goes back to Books list
    res.redirect("/books");
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render("new-book", { book, errors: error.errors})
    } else {
      throw error;
    }
  }
}));

/* READ - GET a book (redirect to /books route)
GET List of Books /books
GET New Book Form /books/new
GET Detail of Specific Book
 */

// GET the new book form route
router.get('/new', (req, res) => {
  res.render("new-book", { book: {} });
});

// Get a List of Books
router.get('/', asyncHandler(async(req,res) => {
  const books = await Book.findAll();
  res.render("index", { books });


}));

//Get Specific Book

router.get('/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("update-book", {book, title: book.title });
  } else {
    const err = new Error('Book not found!');
    err.status = 404;
    next(err);
  }
}));




/* UPDATE
/books/:id updates book info in the database */
router.post('/:id', asyncHandler(async(req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/books");
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id //making sure the correct book gets updated
      res.render("update-book", {
        book,
        errors: error.errors,
      })
    } else {
      throw error;
    }
  }
}));

/* DELETE
post /books/:id/delete to delete a book */
router.post('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    console.log(`Not found Book ID: ${req.params.id}`);
    res.sendStatus(404);
  }
}));

module.exports = router;
