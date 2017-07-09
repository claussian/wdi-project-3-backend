# SwapBooks backend setup

## User login with react-redux frontend

### Backend

`npm install --save`
1. `passport`
2. `passport-local`
3. `bcrypt-nodejs` For some reason `bcrypt` doesn't work
4. `crypto`
5. `mongoose`
6. `connect-mongo`
7. `express-session`



Folder > Files
1. config > `passport.js` (set up authentication strategies here - localStrategy will use comparePassword method defined in User.js)
2. routes > `auth.js` (http requests GET, POST for login and signup)
3. models > `User.js` (include at least email and password)

`app.js`
'import passport from 'passport'`
`import auth from './routes/auth'`
`'const passportConfig = require('./config/passport')`
`app.use(passport.initialize())` 
`app.use(passport.session())` This is invoked on every http request. It will check whether there is an authenticated user object in `req.session.passport.user` loaded by `passport.serializeUser()`. If there is, load additional user information to `req.user` via `passport.deserializeUser()` in passport.js
`app.use('/auth', auth)` This makes the authentication routes available to app

`auth.js`
1. To sign up a new user, the route is:
`router.post('/signup', function(req, res, next) {
    User.findOne(..`
	1.1 In `Login.js`, in `this.state`, email, username and password keys are updated on input entry.
	1.2 On ajax call, find existing user using `req.body.email` or `req.body.username`, if not create `new User()` and populate with `req.body` attributes
	1.3 Invoke `req.logIn` which updates `req.session.passport.user` via `passport.serializeUser()`

2. To login an existing user, the route is:
`router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(error, user, info) {..`
	2.1 In `Login.js`, in `this.state`, email, username and password keys are updated on input entry.
	2.2 On ajax call, use passport.js strategy `local` to authenticate user. If password matches, invoke `req.logIn` which updates `req.session.passport.user` via `passport.serializeUser()`

### Frontend

`index.js`
1. `store.dispatch(getUser())` is the function that updates `state.user` in the global app state. It dispatches the `getUser()` action which fires the ajax GET request `/auth/user`. If user is authenticated, it returns `req.user` which has been populated by `passport.deserializeUser()`

`App.js`
1. `state.user` is exposed via `mapStatetoProps` as `this.props.user`. If exists, isLoggedIn is updated and `<Secret/>` component is loaded. Else, `<Login/>` component is loaded.