import Mongoose from 'mongoose'

const bookSchema = new Mongoose.Schema({
  cover: String,
  title: String,
  author: String,
  genre: String,
  owner: String,
  contact: Number,
  review: String,
  reserved: Boolean,
  reservedBy: String
}, { timestamps: true });

const Book = Mongoose.model('Book', bookSchema);

module.exports = Book;
