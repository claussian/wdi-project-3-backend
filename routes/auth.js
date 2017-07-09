import express from 'express';
import passport from 'passport';
import User from '../models/User';
import userController from '../controller/users';

const router = express.Router();

/* Verify user credentials */
router.get('/user', (req, res, next) => {
  res.json(req.user);
});

/* Signup new user */
router.post('/signup', function(req, res, next) {
    User.findOne( {$or:[{ email: req.body.email },
                        { username:req.body.username}]}, (err, existingUser) => {

      console.log("Data: ",req.body.email, req.body.username, req.body.password, req.body.contact)

      if (existingUser) {
          return res.json({'error':'login','message': 'This username/email already exists!'});
      }

      console.log("New user");

      let user = new User();
      user.username = req.body.username;
      user.email = req.body.email;
      user.password = req.body.password;
      user.contact = req.body.contact;
      console.log(user);
      user.save((err) => {
        console.log("saving user...")
        if (err) {
          console.log("User save error");
          return res.json({'error':'database','message': err});
        }
        req.logIn(user, (err) => {
        if (err) {
            console.log("User login error");
            return res.json({'error':'login','message': err});
        }
        console.log("User login success");
        res.json({'user':user});
        });
      });
    });
});

/* Validate user login */
router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(error, user, info) {
        if(error) {
            console.log(error);
            return res.json({'error':'database','message': "Something went seriously wrong. Contact the dev team."});
        }
        if(!user) {
          return res.json({'error':'user','message': "Wrong password or email"})
        }
        /* req.login is a passport function that calls passport.serializeUser in passport.js */
        req.logIn(user, function(err) {
            if (err) {
              console.log("Login err", "Wrong password");
              return res.json({'error':'user','message': "Wrong password"})
            }
            return res.json(user);
        });
    })(req, res, next);
});

/* logout user */
router.get('/logout',(req, res, next) => {
  req.logout();
  res.json({'message': 'User logged out'});
});

/*  clear shared books */
router.delete('/user/clearBooks', userController.removeUserSharedBooks);

export default router;
