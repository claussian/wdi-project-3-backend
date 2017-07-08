import Mongoose from 'mongoose';

/* Borrower updates reserved = true, Owner updates reserved = false */
const bookSchema = new Mongoose.Schema({
  cover: String,
  title: String,
  author: String,
  genre: String,
  owner: userSchema.schema,
  review: String,
  reserved: Boolean,
  reservedBy: userSchema.schema
}, { timestamps: true });

const Book = Mongoose.model('Book', bookSchema);

module.exports = Book;
