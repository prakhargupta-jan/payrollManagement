const cookieParser = require('cookie-parser');
const express = require('express');
const morgan = require('morgan');
const errorController = require('./controllers/errorCongroller');
const routes = require('./routes')

const app = express();

// Middlewares
app.use(morgan('dev'))
app.use(express.json());
app.use(cookieParser());

// Handling Routes
routes(app);


app.use(errorController);
module.exports = app;