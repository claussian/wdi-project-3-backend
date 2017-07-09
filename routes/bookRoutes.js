import express from 'express';
import booksController from '../controller/books';

const router = express.Router();

/* GET all books */
router.get('/', booksController.listBooks);

/* GET individual book */
router.get('/:id', booksController.getBook);

/* GET books shared by user */
router.get('/shared', booksController.listBooksSharedByUser);

/* GET books reserved by user */
router.get('/borrowed', booksController.listBooksBorrowedByUser);

/* POST a book to share */
router.post('/', booksController.createBook);

/* PUT your shared book */
router.put('/:id', booksController.updateBook);

/* PUT to reserve a book */
router.put('/reserve/:id', booksController.reserveBook);


export default router;
