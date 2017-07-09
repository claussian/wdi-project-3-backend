import express from 'express';
import booksController from '../controller/books';


/* GET all books */
router.get('/', booksController.listBooks);

/* GET individual book */
router.get('/:id', booksController.getBook);

/* POST a book to share */
router.post('/', booksController.createBook);

/* PUT your shared book */
router.put('/:id', booksController.updateBook);

/* PUT to reserve a book */
router.put('/reserve/:id', booksController.reserveBook);
