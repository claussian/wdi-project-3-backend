import User from '../models/User';

exports.updateUser = (req, res, next) => {
  const user = req.user;

}

exports.removeUserSharedBooks = (req, res, next) => {
  const user = req.user;

  User.findById(user._id, (err, foundUser) => {
    foundUser.booksOwned = [];
    foundUser.save( (err, savedUser) => {
      if (err) return res.status(400).send('Bad Request');
      console.log("emptied User booksOwned");
      res.json(savedUser);
    });
  });
}

// exports.removeUserBorrowedBooks = (req, res, next) => {
//   const user = req.user;
//
//   User.findById(user._id, (err, foundUser) => {
//     foundUser.booksBorrowed = [];
//     foundUser.save( (err, savedUser) => {
//       if (err) return res.status(400).send('Bad Request');
//       console.log("emptied User booksBorrowed");
//       res.json(savedUser);
//     });
//   });
// }

export default exports;
