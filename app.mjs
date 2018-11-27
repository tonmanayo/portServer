import createErrorR  from'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import expressip from 'express-ip'; // sending json
import mongoose from 'mongoose';             // using data modeling library for mongo
import bodyParser from 'body-parser';


import indexRouter  from './routes/index';
import userIDRouter  from './routes/userID';
import helmet  from 'helmet';

mongoose.connect('mongodb://localhost:27017/wtc');


// const db = mongoose.connect('mongodb://localhost/api');
const app = express();

// view engine setup
app.set('views', path.join(path.dirname('.'), 'views'));
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(expressip().getIpInfoMiddleware);
app.use(logger('dev'));
app.use(helmet({
    noCache: true,
}));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Content-type, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.dirname('.'), 'public')));

app.use('/', indexRouter);
app.use('/userID', userIDRouter);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
