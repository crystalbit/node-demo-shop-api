// env
const PRODUCTION = process.env.NODE_ENV === 'production';
const TEST = process.env.NODE_ENV === 'test';
const DEVELOPMENT = !PRODUCTION && !TEST;

// express settings
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import morgan from 'morgan';

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
if (DEVELOPMENT) app.use(morgan(":date :method :url :status :res[content-length] - :response-time ms"));
// for dev and test env do some allowances for browser policies
if (!PRODUCTION) app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Credentials', true);
    next();
});
  
// auth
import passport from 'passport';
import strategy from './modules/auth/strategy';
import { salt } from './modules/helpers/hashing';
app.use(session({ secret: salt(), resave: false, saveUninitialized: true }));
app.set('trust proxy', 1);
app.use(passport.initialize());
app.use(passport.session());
strategy(passport);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// routes
import productRouter from './modules/routes/products';
import orderRouter from './modules/routes/orders';
import authRouter from './modules/routes/auth';
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/auth', authRouter);

// run server
const PORT = process.env.PORT || 3333;
app.listen(PORT, '127.0.0.1', () => { console.log(`API started at port ${PORT}`); });

// export app only for chai-http tests
export default app;
