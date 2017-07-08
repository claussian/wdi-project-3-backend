import Book from '../model/Book';

/* GET index page. */
exports.list = (req, res, next) => {

  console.log("got request");

  Book.find({}, (err, books) => {
  if (err) return res.status(404).send('Not found');
  res.json(books);
  });
}

/*
*  Create
*/
exports.createBook = (req, res, next) => {

  const book = new Book();
    book.cover = req.body.cover || "Unknown";
    book.title = req.body.title || "Unknown";
    book.author = req.body.author || "Unknown";
    book.genre = req.body.genre || "Unknown";
    book.owner = req.body.owner || "Unknown";
    book.contact = req.body.contact || "-1";
    book.review = req.body.review || "Unknown";
    book.reserved = req.body.reserved || "false";
    book.reservedBy = req.body.reservedBy || "Unknown";
    book.save((err, book) => {
         res.json(book);
    });
}

/*
*  Read
*/
exports.getBook = (req, res, next) => {

  const id = req.params.id;
  Book.findById(id, (err, book) => {
    if (err) return res.status(404).send('Not found');
    res.json(book);
  });
}


/*
*  Update
*/
exports.updateBook = (req, res, next) => {

 console.log("Got PUT Request");

 const book = req.body.book;

 Book.findById(book._id, (err, foundBook) => {
    if (err) return res.status(400).send('Bad Request');

    if(!foundBook){
      return res.status(404).send('Not Found');
    }

    foundBook.cover = book.cover;
    foundBook.title = book.title;
    foundBook.author = book.author;
    foundBook.genre = book.genre;
    foundBook.owner = book.owner;
    foundBook.contact = book.contact;
    foundBook.review = book.review;
    foundBook.reserved = book.reserved;
    foundBook.reservedBy = book.reservedBy;

    foundBook.save((err, book)=> {
      if (err) return res.status(400).send('Bad Request');
      res.json(foundBook);
    });

 });
}


/*
*  Delete
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
