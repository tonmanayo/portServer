#!/usr/bin/env node

/**
 * Module dependencies.
 */

import createError  from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import expressip from 'express-ip'; // sending json
import mongoose from 'mongoose';             // using data modeling library for mongo
import bodyParser from 'body-parser';
import cors from 'cors'

import indexRouter  from './routes/index';
import userIDRouter  from './routes/userID';
import helmet  from 'helmet';
import Debug from 'debug';
import http from'http'
import io from 'socket.io';

const debug = Debug('server:server');

mongoose.connect('mongodb://localhost:27017/wtc');

// const db = mongoose.connect('mongodb://localhost/api');
const app = express();

// view engine setup
app.set('views', path.join(path.dirname('.'), 'views'));
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(cors());
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

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
};

/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = (val) => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
};
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

let server = http.createServer(app);

/**
 * Create Socket IO server.
 */

const socketIO = io(server);

socketIO.on('connection', (socket) => {
  console.log('a user connected');


  socket.on('SEND_MESSAGE', (message) => {
    console.log('message: ', message);
    socketIO.sockets.emit('RECEIVE_MESSAGE', message)
  });

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
});


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
    console.log(`running on port: ${port}`)
});
server.on('error', onError);
server.on('listening', onListening);