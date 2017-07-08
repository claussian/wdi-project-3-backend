import Mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const userSchema = new Mongoose.Schema({
  username: { type: String, unique: true},
  email: { type: String, unique: true},
  password: String,
  contact: Number,
  booksOwned: [],
  booksBorrowed: []
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};


const User = Mongoose.model('User', userSchema);

module.exports = User;
