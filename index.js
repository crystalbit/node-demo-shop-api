// env
const PRODUCTION = process.env.NODE_ENV === 'production';
const TEST = process.env.NODE_ENV === 'test';
const DEVELOPMENT = !PRODUCTION && !TEST;

// express settings
const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cors = require('cors');
app.use(cookieParser());
app.use(bodyParser.json());
if (DEVELOPMENT) app.use(morgan(":date :method :url :status :res[content-length] - :response-time ms"));
if (!PRODUCTION) app.use(cors()); // enable cross-domain requests for dev env

// auth
const passport = require('passport');
app.set('trust proxy', 1);
const { salt: secret } = require('./modules/helpers/hashing');
app.use(session({ secret: secret(), resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
require('./modules/auth/strategy')(passport);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// routes
app.use('/api/products', require('./modules/routes/products'));
app.use('/api/orders', require('./modules/routes/orders'));
app.use('/api/auth', require('./modules/routes/auth'));

// run server
const PORT = process.env.PORT || 3333;
app.listen(PORT, '127.0.0.1', () => { console.log(`API started at port ${PORT}`); });

// export app only for chai-http tests
module.exports = app;
