// Deps
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const path = require('path');
const fileUpload = require('express-fileupload');

const passport = require('passport');
const localStrats = require('passport-local').Strategy;

// Connect to DB
require('./server/database');

// Auths
var User = require('./server/local_db/_models/user_model');

const default_port = '8080';
const default_host = '0.0.0.0';

// Create HTTP server.
const app = express();
const server = http.createServer(app);

// Parse POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(fileUpload());

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
