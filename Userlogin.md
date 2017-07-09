# User login with react-redux frontend

## Backend

`npm install --save`
1. `passport`
2. `passport-local`
3. `bcrypt`
4. `crypto`

Folder > Files
1. config > `passport.js` (set up authentication strategies here - localStrategy will use comparePassword method defined in User.js)
2. routes > `auth.js` (http requests GET, POST for login and signup)
3. models > `User.js` (include at least email and password)

`app.js`
'import passport from 'passport'`
`import auth from './routes/auth'`
`'const passportConfig = require('./config/passport')`
`app.use(passport.initialize())` 
`app.use(passport.session())` This will enable passport to update user session with user info upon authentication
`app.use('/auth', auth)`

`auth.js`
1. To sign up a new user, the route is:
`router.post('/signup', function(req, res, next) {
    User.findOne(..`
	1.1 In `Login.js`, `this.state` updates email, username and password keys on input entry.
	1.2 On ajax call, find existing user using `req.body.email` or `req.body.username`, if not create `new User()` and populate with `req.body` attributes

2. To login an existing user, the route is:
`router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(error, user, info) {..`
	2.1 In `Login.js`, `this.state` updates email, username and password keys on input entry.
	2.2 On ajax call, use passport.js strategy `local` to authenticate user > updates `req.user`?

## Frontend

`index.js`
1. `store.dispatch(getUser())` is the function that updates `state.user` in the global app state. It dispatches the `getUser()` action which fires the ajax GET request `/auth/user`. If user is authenticated, `req.user` has been populated by passport.js

`App.js`
1. 