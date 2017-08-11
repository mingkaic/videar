// Deps
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const ss = require('socket.io-stream');
const s2p = require('stream-to-promise');

// Connect to DB
require('./server/db/connectMongo');

// Services
const yt = require('./server/services/ytConv');
const db = require('./server/services/vidDb');
const synthesize = require('./server/services/synthesis');

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

// Set port
const port = process.env.PORT || default_port;
app.set('port', port);

app.get('/api/vidinfos', (req, res) => {
	db.getAllYTInfo()
	.then((infos) => {
		var ids = infos.map((info) => {
			return info.vidId;
		});
		res.json(ids);
	});
});

app.get('/api/synthesize', (req, res) => {
	// synthesis handles params validation
	synthesize(req.body.params)
	.then(() => {
		res.json({});
	});
});

// Any standard route
app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Listen on provided port, on all network interfaces.
server.listen(port, default_host, () => {
	console.log(`API running on localhost:${port}`)
});

function dbCheckStreamExist(vidId, exists, notexist) {
	db.getYTStream(vidId)
	.then((dbStream) => {
		if (dbStream === null) {
			notexist();
		}
		else {
			exists(dbStream);
		}
	});
}

// Socket events
io.sockets.on('connection', (socket) => {
	console.log('Socket connected');

	// GET
	socket.on('client-get-audio', (vidId) => {
		dbCheckStreamExist(vidId, 
		(dbStream) => {
			// stream exists
			var outStream = ss.createStream();
			ss(socket).emit('audio-stream', outStream, vidId);
			dbStream.pipe(outStream);
		},
		() => {
			// non-existent stream
		});
	});

	// POST
	ss(socket).on('client-set-audio',
	(stream) => {
		console.log('got audio');
		// process...
			// // we just created a new vid record, notify clients, once data is written to db
			// socket.broadcast.emit('new-audio', vidId);
	});
	
	// PUT
	socket.on('client-verify-id', (vidId) => {
		// check if vidId already exists in our database
		dbCheckStreamExist(vidId, 
		(dbStream) => {
			// stream exists, tell client
			socket.emit('old-ytid');
		},
		() => {
			// non-existent stream
			try {
				var mp3 = yt(vidId);
			}
			catch (err) {
				console.log(err);
				socket.emit('invalid-ytid', vidId); 
			}
			// save in db
			db.setYTStream(vidId, mp3);
			// when streaming is complete
			mp3.on('close', function() {
				// we just created a new record, notify clients, once data is written to db
				socket.broadcast.emit('new-audio', vidId);
			});
		});
	});
});
