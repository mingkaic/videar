const mongoose = require('mongoose');
const grid = require('gridfs-stream');
const uuidv1 = require('uuid/v1');
const audConvert = require('./audioConv').convert;

var models = require('../models/vidModel.js');
var vidModel = models.VidModel;
var fileModel = models.FileModel;

var connection = mongoose.connection;
var gfs = null;

connection.once('connected', () => {
	gfs = grid(connection.db, mongoose.mongo);
});

// get all ids
exports.getAllVidInfo = () => {
	return vidModel.find({}).exec();
};

exports.getFileInfo = (vidId) => {
	return fileModel.findOne({ 'vidId': vidId }).exec();
}

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

exports.setVidFile = (fstream, fname, streamCb) => {
	// generate vidId
	var vidId = uuidv1();
	// save to gridfs
	var writestream = gfs.createWriteStream({ filename: vidId });
	if (streamCb) {
		writestream.on('finish', () => streamCb(vidId));
	}

	var finstance = new fileModel({
		'vidId': vidId,
		'filename': fname
	})
	var vinstance = new vidModel({
		'vidId': vidId,
		'source': 'upload'
	});
	// convert to wav before saving
	audConvert(fstream).pipe(writestream);

	// save to models;
	return finstance.save()
	.then((file) => {
		console.log('saved ', file);
		return vinstance.save();
	})
	.then((data) => {
		console.log('saved ', data);
		return true;
	});;
}

// write to gridfs if vidInfo is not found (idempotent)
exports.setVidStream = (vidId, source, dbStream, streamCb) => {
	// relies on query to wait until connection for gfs declaration
	return vidModel.findOne({ 'vidId': vidId }).exec()
	.then((vidInfo) => {
		if (vidInfo !== null) {
			// decide on update
			console.log('attempting to insert existing vid: ', vidId);
			return false;
		}

		// save to gridfs
		var writestream = gfs.createWriteStream({ filename: vidId });
		if (streamCb) {
			writestream.on('finish', streamCb);
		}

		var instance = new vidModel({
			'vidId': vidId,
			'source': source
		});
		// todo: check dbStream format before saving ...

		dbStream.pipe(writestream);

		// save to models;
		return instance.save()
		.then((data) => {
			console.log('saved ', data);
			return true;
		});
	});
};

// removes the vidId
exports.removeYTStream = (vidId) => {
	// relies on query to wait until connection for gfs declaration
	return vidModel.findOne({ 'vidId': vidId })
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
