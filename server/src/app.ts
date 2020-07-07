import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import lusca from 'lusca';
import path from 'path';
import mongoose from 'mongoose';
import passport from 'passport';
import './config/passport';
import logger from 'morgan';

// Controllers (route handlers)
import routes from './routes/index';
import { isProd } from './util/env';
import { config } from './config';

// Create Express server
const app = express();

// Connect to MongoDB
mongoose.Promise = Promise;

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  })
  .catch((err) => {
    console.log(
      'MongoDB connection error. Please make sure MongoDB is running. ' + err
    );
    // process.exit();
  });

// Express configuration
app.set('port', isProd ? config.PORT : 3001);
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

if (isProd) {
  const buildPath = path.join(__dirname, '..', '..', 'client', 'build');
  // Serve any static files
  app.use(express.static(buildPath));

  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

export default app;
