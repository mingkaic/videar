const mongoose = require('mongoose');
const grid = require('gridfs-stream');

var linkVidModel = require('../models/vidModel.js');

var connection = mongoose.connection;
var gfs = null;

connection.once('connected', () => {
	gfs = grid(connection.db, mongoose.mongo);
});

// get all ids
exports.getAllYTInfo = () => {
	return linkVidModel.find({}).exec();
};

// read stream if it exists and return true, other return false for non-existent
exports.getYTStream = (vidId) => {
	// relies on query to wait until connection for gfs declaration
	return linkVidModel.findOne({ 'vidId': vidId }).exec()
	.then((vidInfo) => {
		if (vidInfo) {
			// vid exists, make a stream, read and return it
			return gfs.createReadStream({ filename: vidId });
		}
		return null;
	});
};

// write to gridfs if vidInfo is not found (idempotent)
exports.setYTStream = (vidId, dbStream, streamCb) => {
	// relies on query to wait until connection for gfs declaration
	return linkVidModel.findOne({ 'vidId': vidId }).exec()
	.then((vidInfo) => {
		if (vidInfo !== null) {
			// decide on update
			console.log('attempting to insert existing vid: ', vidId);
			return false;
		}

		// save to gridfs
		var writestream = gfs.createWriteStream({ filename: vidId });
		dbStream.pipe(writestream);
		if (streamCb) {
			writestream.on('finish', streamCb);
		}

		var instance = new linkVidModel({
			'vidId': vidId,
			'offline': false
		});

		// save to models;
		return instance.save();
	});
};

// removes the vidId
exports.removeYTStream = (vidId) => {
	// relies on query to wait until connection for gfs declaration
	return linkVidModel.findOne({ 'vidId': vidId })
	.remove().exec()
	.then((data) => {
		gfs.remove({ filename: vidId }, (err) => {
			if (err) {
				console.log(err);
				return;
			}
			console.log('Removed ', vidId, ' successfully');
		});
	});
};
