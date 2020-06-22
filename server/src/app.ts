import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import lusca from 'lusca';
import path from 'path';
import mongoose from 'mongoose';
import { MONGODB_URI } from './util/secrets';
import passport from 'passport';
import './config/passport';
import logger from 'morgan';
import bluebird from 'bluebird';

// Controllers (route handlers)
import routes from './routes/index';

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  })
  .catch(err => {
    console.log(
      'MongoDB connection error. Please make sure MongoDB is running. ' + err
    );
    // process.exit();
  });

// Express configuration
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(
  express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
);
app.use(logger('dev'));

/**
 * routes.
 */
app.use(routes);

export default app;
