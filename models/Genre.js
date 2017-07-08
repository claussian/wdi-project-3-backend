import Mongoose from 'mongoose'

const genreSchema = new Mongoose.Schema({
  genre: String,
}, { timestamps: true });

const Genre = Mongoose.model('Genre', genreSchema);

module.exports = Genre;
