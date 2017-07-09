import Book from '../models/Book';
import User from '../models/User';

/*
* Get books
*/
exports.listBooks = (req, res, next) => {

  console.log("got request listBooks");

  Book.find({}, (err, books) => {
  if (err) return res.status(404).send('Not found');
  res.json(books);
  });
}

/*
*  Get a book
*/
exports.getBook = (req, res, next) => {

  console.log("got request getBook");

  const id = req.params.id;
  Book.findById(id, (err, book) => {
    if (err) return res.status(404).send('Not found');
    res.json(book);
  });
}

/*
* Get books shared by user
*/
exports.listBooksSharedByUser = (req, res, next) => {

  console.log("got request listBooksSharedByUser");

  const user = req.user

  User.findById(user._id)
    .populate('booksOwned')
    .exec((err, foundUser) => {
      if (err) return res.status(400).send('Bad Request');

      if(!foundUser){
        return res.status(404).send('User not Found');
      }
      res.json(foundUser.booksOwned);
    });
}

/*
* Get books shared by user
*/
exports.listBooksBorrowedByUser = (req, res, next) => {

  console.log("got request listBooksBorrowedByUser");

  const user = req.user

  User.findById(user._id)
    .populate('booksBorrowed')
    .exec((err, foundUser) => {
      if (err) return res.status(400).send('Bad Request');

      if(!foundUser){
        return res.status(404).send('User not Found');
      }
      res.json(foundUser.booksOwned);
    });
}

/*
*  Create book, update User with new book
*/
exports.createBook = (req, res, next) => {

  console.log("got request createBook");

  const book = new Book();
    // book.cover = req.body.cover || "Unknown";
    book.title = req.body.title || "Unknown";
    book.author = req.body.author || "Unknown";
    book.genre = req.body.genre || "Unknown";
    book.owner = req.user._id || "Unknown";
    book.review = req.body.review || "Unknown";
    book.reserved = false;
    book.save((err, book) => {

      /* Update user model with saved book */
      const user = req.user;
      console.log("saved book, now finding book owner");
      console.log(user);

      User.findById(user._id, (err, foundUser) => {
        if (err) return res.status(400).send('Bad Request');

        if(!foundUser){
          return res.status(404).send('User not Found');
        }

        foundUser.booksOwned.push(book._id);
        foundUser.save( (err, savedUser) => {
          if (err) return res.status(400).send('Bad Request');
          console.log("pushed book._id into User");
          console.log(savedUser);
        });

      });
         res.json(book);
    });
}

/*
*  Update book, release book based on Boolean
*/
exports.updateBook = (req, res, next) => {

 console.log("Got request updateBook");

 const id = req.params.id;
 const book = req.body;

 Book.findById(id, (err, foundBook) => {
    if (err) return res.status(400).send('Bad Request');

    if(!foundBook){
      return res.status(404).send('Not Found');
    }
    console.log("Found book, now updating")
    console.log(foundBook);

    // foundBook.cover = book.cover;
    foundBook.title = book.title;
    foundBook.author = book.author;
    foundBook.genre = book.genre;
    foundBook.review = book.review;

    foundBook.save((err, updatedBook)=> {
      if (err) return res.status(400).send('Bad Request');
      console.log("updated book");
      res.json(updatedBook);
    });
 });
}


/*
* Reserve book
*/
exports.reserveBook = (req, res, next) => {

  const id = req.params.id;

  Book.findById(id, (err, foundBook) => {
    if (err) return res.status(404).send('Not found');

    if(!foundBook){
      return res.status(404).send('Not Found');
    }

    foundBook.reserved = true;
    foundBook.reservedBy = req.user._id;

    foundBook.save((err, book)=> {
      if (err) return res.status(400).send('Bad Request');

      /* Update user model with saved book */
      const user = req.user

      User.findById(user._id, (err, foundUser) => {
        if (err) return res.status(400).send('Bad Request');

        if(!foundUser){
          return res.status(404).send('User not Found');
        }

        foundUser.booksBorrowed.push(book._id);
        foundUser.save();

      });
         res.json(book);
    });
  });
}

/*
*  Delete book
*/
exports.deleteBook = (req, res, next) => {

  const id = req.params.id;
  Book.findById(id, (err, book) => {
    if (err) return res.status(400).send('Bad Request');

    if(!book){
      return res.status(404).send('Not Found');
    }

    book.remove();

    res.json("ok");
  });
}


export default exports;
