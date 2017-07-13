import express from 'express';
import booksController from '../controller/books';

/* middleware for file handling en route to cloudinary */
import multer from 'multer';
const upload = multer({ dest: './uploads/' });

const router = express.Router();

/* GET all books */
router.get('/book', booksController.listBooks);

/* GET individual book */
router.get('/book/:id', booksController.getBook);

/* GET books shared by user */
router.get('/shared', booksController.listBooksSharedByUser);

/* GET books reserved by user */
router.get('/borrowed', booksController.listBooksBorrowedByUser);

/* POST a book to share */
router.post('/book', upload.single('cover'), booksController.createBook);

/* PUT your shared book with picture */
router.put('/book/:id', upload.single('cover'), booksController.updateBookWithPic);

/* PUT your shared book without picture */
router.put('/booknopic/:id', booksController.updateBookNoPic);

/* PUT to reserve a book */
router.put('/reserve/:id', booksController.reserveBook);


export default router;
