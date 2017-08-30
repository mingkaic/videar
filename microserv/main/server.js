// Deps
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const ss = require('socket.io-stream');
const uuidv1 = require('uuid/v1');

const hash = require('bcrypt-nodejs');
const passport = require('passport');
const localStrats = require('passport-local').Strategy;

// Connect to DB
require('./server/db/connectMongo');
const vidDb = require('./server/db/vidDb');
const wordDb = require('./server/db/wordDb');
const userDb = require('./server/db/userDb');
const cache = require('./server/db/redisCache');

// Services
const converter = require('./server/services/audioConv');
const synthesize = require('./server/services/synthesize').synthesize;

// Auths
var User = require('./server/models/userModel');

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

app.use(passport.initialize());
app.use(passport.session());

// configure passport
passport.use(new localStrats(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set port
const port = process.env.PORT || default_port;
app.set('port', port);

function dbCheckStreamExist(vidId, exists, notexist) {
	vidDb.getVidStream(vidId)
	.then((streamInfo) => {
		if (streamInfo === null) {
			notexist();
		}
		else {
			exists(streamInfo);
		}
	});
}

var sockets = {};

// ===== Authentication Calls =====
app.get('/api/users', (req, res) => {
	userDb.getAllUsers()
	.then((users) => {
		users = users.map((usr) => {
			return usr.id_;
		});
		res.json(usrs);
	});
});

app.get('/api/users/:id', (req, res) => {
	var id = req.params.id;
	userDb.getUser(id)
	.then((user) => {
		user = user.username;
		res.json(user);
	})
});

app.post('/api/users', (req, res) => {
	userDb.setUser(req.body)
	.then(() => {
		passport.authenticate('local')(req, res, () => {
			res.json({"status": 'Rigstration successful'});
		});
	})
	.catch((err) => {
		res.status(500).json({ "err": err });
	});
});

app.post('/api/authenticate', (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(401).json({
				"err": info
			});
		}
		req.logIn(user, (err) => {
			if (err) {
				return res.status(500).json({
					"err": 'Could not log in user'
				});
			}
			res.json({
				"name": user.username,
				"id": user._id
			});
		})
	})(req, res, next);
});

// unimplemented
app.put('/api/users/:id', (req, res) => {
	var id = req.params.id;
	userDb.updateUser(id, req.body);
});

// unimplemented
app.delete('/api/users/:id', (req, res) => {
	var id = req.params.id;
	userDb.rmUser(id);
});

// ===== API INDEPENDENT OF SOCKET =====
app.get('/api/vidinfos', (req, res) => {
	console.log('requesting all ids');
	vidDb.getAllVidInfo()
	.then((infos) => {
		res.json(infos); 
	});
});

app.get('/api/audio_subtitles/:id', (req, res) => {
	var vidId = req.params.id;
	wordDb.getTranscript(vidId)
	.then((transcriptInfo) => {
		var status = "none";
		var subtitle = "";
		if (transcriptInfo) {
			status = "partial";
			if (0 > transcriptInfo.startTime) {
				status = "complete";
			}
			subtitle = transcriptInfo.subtitles
			.map((wordObj) => wordObj.word)
			.join(' ');
		}
		res.json({"status": status, "subtitle": subtitle});
	});
});

app.post('/api/req_audio', (req, res) => {
	var socket = sockets[req.body.socketId];
	var id = req.body.vidId;
	console.log('checking if '+id+' exists');
	dbCheckStreamExist(id, 
	(streamInfo) => {
		var dbStream = streamInfo.stream;
		// stream exists
		console.log('stream ' + id + ' found. transmitting...');
		var outStream = ss.createStream();
		ss(socket).emit('audio-stream', outStream, id);
		dbStream.pipe(outStream);
		res.json({ "name": streamInfo.name });
	},
	() => {
		res.json({ "name": null });
	});
});

app.post('/api/audio_meta', (req, res) => {
	var id = req.body.vidId;
	var name = req.body.name;
	vidDb.updateVidMeta(id, name)
	.then((success) => {
		if (success) {
			res.status(400).send("success");
		}
		else {
			res.status(404).send("audio not found");
		}
	})
	.catch((err) => {
		res.status(500).send(err);
	});
});

app.put('/api/synthesize', (req, res) => {
	var socket = sockets[req.body.socketId];
	var synthId = req.body.synthId;
	const context = "synthId";

	// todo: move this functionality somewhere else
	cache.hasKey(context, synthId)
	.then((existence) => {
		if (1 !== existence) {
			cache.setCacheKey(context, synthId, "set");
			console.log("synthesizing for request " + synthId);
			// synthesis handles params validation
			// params should be of form 
			return synthesize(req.body.params)
			.then((result) => {
				var missing = result.missing;
				var synth = result.stream;
				if (synth) {
					// add to vidDb
					// vidDb.setSynthStream(synthId, synth);
					console.log('streaming synth');
					var outStream = ss.createStream();
					ss(socket).emit('synthesized-audio', synthId, outStream);
					synth.pipe(outStream);
					synth.on('end', () => {
						console.log('synthStream complete');
					});
				}
				else {
					console.log('missing synthstream');
				}
				cache.deCache(context, synthId);
				// reply about missing words
				res.json({ "missing": missing || [] });
			});
		}
		else {
			console.log("synthesizing for request " + synthId + " in progress");
		}
	})
	.catch((err) => {
		console.log(err);
		res.status(500).send(err);
	});
});

app.put('/api/verify_id', (req, res) => {
	var id = req.body.vidId;
	// check if id already exists in our database
	dbCheckStreamExist(id, 
	(streamInfo) => {
		var dbStream = streamInfo.stream;
		// stream exists, tell client
		res.json({ "onDb": true, "name": streamInfo.name });
	},
	() => {
		// non-existent stream
		try {
			var mp3 = converter.ytExtract(id);
		}
		catch (err) {
			console.log(err);
			res.json({ "onDb": false, "name": null });
		}

		// save in vidDb
		var source = '.<youtube>';
		vidDb.setVidStream(id, source, mp3)
		.then((gfsStream) => {
			if (gfsStream) {
				gfsStream.on('finish', () => {
					// when streaming is complete
					console.log('emitting new audio to all with id '+id);
					// we just created a new record, notify clients, once data is written to vidDb
					io.sockets.emit('new-audio', id);
				});
			}
		});
		res.json({ "onDb": false, "name": "http://www.youtube.com/watch?v=" + id });
	});
});

// ===== SOCKET EVENTS & API DEPENDENT ON SOCKET =====
io.sockets.on('connection', (socket) => {
	var sid = socket.id;
	console.log('Socket connected: '+sid);
	sockets[sid] = socket;

	// POST-EQUIVALENT
	ss(socket).on('post-audio-client',
	(stream, fname) => {
		// generate vidId
		var vidId = uuidv1();

		stream = converter.format(stream, "mp3");
		vidDb.setVidStream(vidId, fname, stream)
		.then((gfsStream) => {
			if (gfsStream) {
				gfsStream.on('finish', () => {
					// when streaming is complete
					console.log('emitting new audio to all with id '+vidId);
					// we just created a new record, notify clients, once data is written to vidDb
					io.sockets.emit('new-audio', vidId);
				});
			}
		});
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
