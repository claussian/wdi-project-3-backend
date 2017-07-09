import Mongoose from 'mongoose';

const Schema = Mongoose.Schema;

/* Borrower updates reserved = true, Owner updates reserved = false */
const bookSchema = new Mongoose.Schema({
  cover: String,
  title: String,
  author: String,
  genre: String,
  owner: {type: Schema.ObjectId},
  review: String,
  reserved: Boolean,
  reservedBy: {type: Schema.ObjectId}
}, { timestamps: true });

const Book = Mongoose.model('Book', bookSchema);

module.exports = Book;
