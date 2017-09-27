const ss = require('socket.io-stream');

var sockets = {};

exports.connect = (io) => {
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
};

exports.sockets = sockets;
