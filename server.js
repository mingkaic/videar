// Deps
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const ss = require('socket.io-stream');

// API routes
const api = require('./server/routes/api');

// services
const yt_service = require('./server/services/yt_audio');
const db = require('./server/services/aws_storage');

const default_port = '8080';
const default_host = '0.0.0.0';

// Create HTTP server.
const app = express();
const server = http.createServer(app);
var io = socketio.listen(server);

// Parse POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// API route
app.use('/api', api);

// Any standard route
app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Set port
const port = process.env.PORT || default_port;
app.set('port', port);

// Listen on provided port, on all network interfaces.
server.listen(port, default_host, () => {
	console.log(`API running on localhost:${port}`)
});

// Socket events
io.sockets.on('connection', (socket) => {
	console.log('Socket connected');
	socket.on('client-audio-request', (vidId) => {
		try {
			// check if vidId already exists in our database
			var outStream = db.getYTStream(vidId);
			if (!outStream) {
				var dbStream = ss.createStream();
				yt_service(vidId, outStream);
				yt_service(vidId, dbStream);
				db.setYTStream(vidId, dbStream);
			}
			ss(socket).emit('audio-stream', outStream, vidId);
		} catch (exception) {
			console.log(exception);
			socket.emit('invalid-ytid', vidId);
		}
	});
});
