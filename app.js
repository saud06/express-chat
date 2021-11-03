/*
 * Title: express-cha app landing
 * Description: Chat app lands here
 * Author: Saud
 * Date:
 */

// Dependencies
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const login = require('./router/login');
const inbox = require('./router/inbox');
const users = require('./router/users');
const errorHandler = require('./middlewares/errorHandler');

// App initialization
const app = express();

dotenv.config();

// Request parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// Set view engine
app.set('view engine', 'ejs');

// Database connection
mongoose
  .connect(process.env.MONGO_DB_CONN_STR)
  .then(() => {
    console.log('DB connected.');
  })
  .catch((err) => {
    console.log(err);
  });

// App routes
app.use('/', login);
app.use('/inbox', inbox);
app.use('/users', users);

// Not found handler
app.use(errorHandler.notFound);

// Default error handler
app.use(errorHandler.defaultError);

app.listen(3000, () => {
  console.log('App is listening at port 3000.');
});
