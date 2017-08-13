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
const synthesize = require('./server/services/synthesize');

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

var sockets = {};

// ===== API INDEPENDENT OF SOCKET =====
app.get('/api/vidinfos', (req, res) => {
	console.log('requesting all ids');
	db.getAllYTInfo()
	.then((infos) => {
		var ids = infos.map((info) => {
			return info.vidId;
		});
		res.json(ids);
	});
});

app.get('/api/synthesize', (req, res) => {
	var socket = sockets[req.body.socketId];
	// synthesis handles params validation
	synthesize(req.body.params)
	.then(() => {
		res.json({});
	});
});

app.post('/api/req_audio', (req, res) => {
	var socket = sockets[req.body.socketId];
	var id = req.body.vidId;
	dbCheckStreamExist(id, 
	(dbStream) => {
		// stream exists
		console.log('stream '+id+' found. transmitting...');
		var outStream = ss.createStream();
		ss(socket).emit('audio-stream', outStream, id);
		dbStream.pipe(outStream);
		res.json(true);
	},
	() => {
		res.json(false);
	});
});

app.put('/api/verify_id', (req, res) => {
	var id = req.body.vidId;
	// check if id already exists in our database
	dbCheckStreamExist(id, 
	(dbStream) => {
		// stream exists, tell client
		res.json({ "onDb": true, "exists": true });
	},
	() => {
		// non-existent stream
		try {
			var mp3 = yt(id);
		}
		catch (err) {
			console.log(err);
			res.json({ "onDb": false, "exists": false });
		}
		// save in db
		db.setYTStream(id, mp3, 
		() => {
			// when streaming is complete
			console.log('emitting new audio to all with id '+id);
			// we just created a new record, notify clients, once data is written to db
			io.sockets.emit('new-audio', id);
		})
		.then((data) => {
			console.log('saved ', data);
			return true;
		});
		res.json({ "onDb": false, "exists": true });
	});
});

// ===== SOCKET EVENTS & API DEPENDENT ON SOCKET =====
io.sockets.on('connection', (socket) => {
	let sid = socket.id;
	console.log('Socket connected: '+sid);
	sockets[sid] = socket;

	// POST-EQUIVALENT
	ss(socket).on('post-audio-client',
	(fname, stream) => {
		console.log('got audio '+fname);
		// process...
			// // we just created a new vid record, notify clients, once data is written to db
			// io.sockets.emit('new-audio', vidId);
	});

	socket.on('disconnect', () => {
		console.log(sid+' disconnected');
		delete sockets[sid];
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
