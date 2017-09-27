// Deps
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const passport = require('passport');
const localStrats = require('passport-local').Strategy;

// Connect to DB
require('./server/database');

// Auths
var User = require('./server/models/userModel');

const default_port = '8080';
const default_host = '0.0.0.0';

// Create HTTP server.
const app = express();
const server = http.createServer(app);
var io = socketio.listen(server);

require('./server/sockets').connect(io);

// Parse POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

app.use(passport.initialize());
app.use(passport.session());

// configure passport
passport.use(new localStrats(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set port
const port = process.env.PORT || default_port;
app.set('port', port);

var routes = require('./server/routes');

// Any standard route
routes.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.use(routes);

// Listen on provided port, on all network interfaces.
server.listen(port, default_host, () => {
	console.log(`API running on localhost:${port}`)
});
