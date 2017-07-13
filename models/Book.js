import Mongoose from 'mongoose';
import User from './User';

const Schema = Mongoose.Schema;

/* Borrower updates reserved = true, Owner updates reserved = false */
const bookSchema = new Mongoose.Schema({
  cover: String,
  title: String,
  author: String,
  genre: String,
  owner: {type: Schema.ObjectId, ref: 'User'},
  review: String,
  hold: Boolean,
  holdBy: {type: Schema.ObjectId, ref: 'User'},
  reserved: Boolean,
  reservedBy: {type: Schema.ObjectId, ref: 'User'}
}, { timestamps: true });

const Book = Mongoose.model('Book', bookSchema);

module.exports = Book;
