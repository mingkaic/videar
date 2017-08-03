// Deps
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const ss = require('socket.io-stream');

// Connect to DB
require('./server/db/connectMongo');

// Services
const yt = require('./server/services/ytConv');
const db = require('./server/services/vidDb');

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

// Any standard route
app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Listen on provided port, on all network interfaces.
server.listen(port, default_host, () => {
	console.log(`API running on localhost:${port}`)
});

// Socket events
io.sockets.on('connection', (socket) => {
	console.log('Socket connected');
	
	socket.on('client-get-audio', (vidId) => {
		try {
			// check if vidId already exists in our database
			db.getYTStream(vidId)
			.then((dbStream) => {
				var outStream = ss.createStream();
				if (dbStream === null) {
					yt(vidId).pipe(outStream);
					var mp3 = yt(vidId);
					// save in db
					db.setYTStream(vidId, mp3);
					// we just created a new vid record, notify clients, once data is written to db
					// dbStream.on('end', () => {
					// 	ss(socket).emit('audio-update', vidId);
					// });
				}
				else {
					dbStream.pipe(outStream);
				}
				ss(socket).emit('audio-stream', outStream, vidId);
			});
		}
		catch (err) {
			console.log(err);
			socket.emit('invalid-ytid', vidId); 
		}
	});
});
