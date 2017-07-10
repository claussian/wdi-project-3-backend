import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Debug from 'debug';
import express from 'express';
import logger from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import passport from 'passport';
import multer from 'multer';
const upload = multer({ dest: './uploads/' });
import cloudinary from 'cloudinary';

// Configure .env path
dotenv.load({path: '.env'});

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

// import favicon from 'serve-favicon';
import path from 'path';
import lessMiddleware from 'less-middleware';

/* import routes to make them available to app */
import bookRoutes from './routes/bookRoutes';
import auth from './routes/auth';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/bookdb');
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

const app = express();
const debug = Debug('wdi-project-3-backend:app');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

/* Why do we need this ? To connect mongodb by session? */
const MongoStore = require('connect-mongo')(session);
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: "WDI Singapore",
  store: new MongoStore({
    url: 'mongodb://localhost/bookdb',
    autoReconnect: true,
    clear_interval: 3600
  })
}));
/* Make passport available to app. Passport will update user session with user info on authentication */
app.use(passport.initialize());
app.use(passport.session());

/* routes are made available to app */
app.use('/api', bookRoutes);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
/* eslint no-unused-vars: 0 */
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Handle uncaughtException
process.on('uncaughtException', (err) => {
  debug('Caught exception: %j', err);
  process.exit(1);
});

export default app;
