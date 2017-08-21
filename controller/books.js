import Book from '../models/Book';
import User from '../models/User';
import cloudinary from 'cloudinary';


/*
* Get books
*/
exports.listBooks = (req, res, next) => {

  console.log("got request listBooks");

  Book.find()
    .populate('owner')
    .populate('reservedBy')
    .exec((err, books) => {
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
  Book.findById(id)
    .populate('owner')
    .populate('reservedBy')
    .exec((err, book) => {
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
* Get books borrowed by user
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
      res.json(foundUser.booksBorrowed);
    });
}

/*
*  Create book, update User with new book
*/
exports.createBook = (req, res, next) => {

  console.log("got request createBook");

    const book = new Book();

    book.title = req.body.title || "Unknown";
    book.author = req.body.author || "Unknown";
    book.genre = req.body.genre || "Unknown";
    book.owner = req.user._id || "Unknown";
    book.review = req.body.review || "Unknown";
    book.reserved = false;
    book.reservedBy = null;
    cloudinary.uploader.upload(req.file.path, (result) => {
      book.cover = result.secure_url || "Unknown";
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
          console.log("Found user!")
          foundUser.booksOwned.push(book._id);
          foundUser.save( (err, savedUser) => {
            if (err) return res.status(400).send('Bad Request');
            console.log("pushed book._id into User booksOwned");
            console.log(savedUser);
          });
        });
        res.json(book);
      });
    })
}

/*
* Release book helper function
*/

const releaseBook = (foundBook) => {
  /* Find borrower and release book from his borrowed list */
  const borrowerId = foundBook.reservedBy

  User.findById(borrowerId, (err, foundBorrower) => {
    if (err) return res.status(400).send('Bad Request');

    if(!foundBorrower){
      return res.status(404).send('User not Found');
    }
    console.log("found borrower");

    const booksBorrowed = foundBorrower.booksBorrowed;
    booksBorrowed.splice(booksBorrowed.indexOf(foundBook._id),1);

    foundBorrower.save( (err, savedBorrower) => {
      if (err) return res.status(400).send('Bad Request');
      console.log("removed book._id from User booksBorrowed");
      console.log(savedBorrower);
    });
  });

  foundBook.reservedBy = null;
  foundBook.reserved = false;
  return foundBook;
}

/*
*  Owner updates book with pic
*/
exports.updateBookWithPic = (req, res, next) => {

  console.log("Got request updateBookWithPic");

  const id = req.params.id;
  const book = req.body;

  Book.findById(id, (err, foundBook) => {
     if (err) return res.status(400).send('Bad Request');

     if(!foundBook){
       return res.status(404).send('Not Found');
     }
     console.log("Found book, now updating");

     foundBook.title = book.title;
     foundBook.author = book.author;
     foundBook.genre = book.genre;
     foundBook.review = book.review;

     if(book.release == 'Yes') {
       foundBook = releaseBook(foundBook);
     }

     cloudinary.uploader.upload(req.file.path, (result) => {
       foundBook.cover = result.secure_url;
       console.log(foundBook);
       foundBook.save((err, updatedBook)=> {
         if (err) return res.status(400).send('Bad Request');
         console.log("updated book with pic");
         res.json(updatedBook);
       });
     },{public_id: req.body.picReviewPublicId})
  });
}

/*
*  Owner updates book without pic
*/
exports.updateBookNoPic = (req, res, next) => {

  console.log("Got request updateBookNoPic");

  const id = req.params.id;
  const book = req.body;
  console.log(book);

  Book.findById(id, (err, foundBook) => {
     if (err) return res.status(400).send('Bad Request');

     if(!foundBook){
       return res.status(404).send('Not Found');
     }
     console.log("Found book, now updating");

     foundBook.title = book.title;
     foundBook.author = book.author;
     foundBook.genre = book.genre;
     foundBook.review = book.review;

     if(book.release == 'Yes') {
       foundBook = releaseBook(foundBook);
     }

     foundBook.save((err, updatedBook)=> {
       if (err) return res.status(400).send('Bad Request');
       console.log("updated book no pic successfully!");
       res.json(updatedBook);
     });
  });
}


/*
* Borrower reserves book
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
        foundUser.save( (err, savedUser) => {
          if (err) return res.status(400).send('Bad Request');
          console.log("pushed book._id into User booksBorrowed");
          console.log(savedUser);
        });

      });
      res.json(book);
    });
  });
}

/*
*  Delete book
*/
exports.deleteBook = (req, res, next) => {

  console.log("Got request deleteBook");

  const id = req.params.id;
  Book.findById(id, (err, book) => {
    if (err) return res.status(400).send('Bad Request');

    if(!book){
      return res.status(404).send('Not Found');
    }

    /* Update user model with saved book */
    const user = req.user

    User.findById(user._id, (err, foundUser) => {
      if (err) return res.status(400).send('Bad Request');

      if(!foundUser){
        return res.status(404).send('User not Found');
      }

      const booksOwned = foundUser.booksOwned;
      booksOwned.splice(booksOwned.indexOf(book._id),1);

      foundUser.save( (err, savedUser) => {
        if (err) return res.status(400).send('Bad Request');
        console.log("removed book._id from User booksOwned");
        console.log(savedUser);
      });

    book.remove((err) => {
      if (err) return res.status(400).send('Bad Request');
      res.json({'message':"book deleted"});
    });
  });
});
}


export default exports;
