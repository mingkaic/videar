const mongoose = require('mongoose');
const grid = require('gridfs-stream');
const s2Promise = require('stream-to-promise');

var gfs = null;

var vidModel = require('../models/vidModel.js');
var connection = mongoose.connection;
connection.once('connected', () => {
	gfs = grid(connection.db, mongoose.mongo);
});

// get all ids
exports.getAllVidInfo = () => {
	return vidModel.find({}).exec();
};

// read stream if it exists and return stream and source of video, other return null for non-existent
exports.getVidStream = (vidId) => {
	// relies on query to wait until connection for gfs declaration
	return vidModel.findOne({ 'vidId': vidId }).exec()
	.then((vidInfo) => {
		if (vidInfo) {
			// vid exists, make a stream, read and return it
			return {
				"stream": gfs.createReadStream({ filename: vidId }), 
				"source": vidInfo.source
			};
		}
		return null;
	});
};

// write to gridfs if vidInfo is not found (idempotent)
exports.setVidStream = (vidId, source, dbStream) => {
	// relies on query to wait until connection for gfs declaration
	return vidModel.findOne({ 'vidId': vidId }).exec()
	.then((vidInfo) => {
		if (vidInfo !== null) {
			// decide on update
			console.log('attempting to insert existing vid: ', vidId);
			return null;
		}

		// save to gridfs
		var writeStream = gfs.createWriteStream({ filename: vidId });
		var instance = new vidModel({
			'vidId': vidId,
			'source': source
		});

		dbStream.pipe(writeStream);

		// save to models
		return instance.save()
		.then((data) => {
			console.log('saved ', data);
			return writeStream;
		});
	});
};

// removes the vidId
exports.removeVidStream = (vidId) => {
	// relies on query to wait until connection for gfs declaration
	return vidModel.findOne({ 'vidId': vidId })
	.then((audio) => {
		if (audio) {
			return vidModel.remove(audio).exec()
			.then(() => {
				gfs.remove({ filename: vidId }, (err) => {
					if (err) {
						throw err;
					}
					console.log('Removed ', vidId, ' successfully');
				});
				return true;
			});
		}
		return false;
	});
};

exports.cache = (stream) => {
	// todo: replace with cache
	var cacheId = "chunk_" + uuidv1();
	var writestream = gfs.createWriteStream({ filename: cacheId });
	stream.pipe(writestream);
	return s2Promise(writestream)
	.then(() => {
		return cacheId;
	});
};
