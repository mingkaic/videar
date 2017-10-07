const mongoose = require('mongoose');
const grid = require('gridfs-stream');
const uuidv1 = require('uuid/v1');
const Readable = require('stream').Readable;

var AudioModel = require('../models/audioModel.js');

var gfs = null;
var connection = mongoose.connection;
connection.once('connected', () => {
	gfs = grid(connection.db, mongoose.mongo);
});

// publically accessible data
// GET
exports.all = (query, limit) => {
	var allQuery = AudioModel.find(query);
	allQuery = allQuery.limit(limit);
	return allQuery.exec();
};

exports.metadata = (id) => {
	return AudioModel.findOne({ "id": id }).exec();
};

exports.get = (id) => {
	return exports.metadata(id)
	.then((info) => {
		var strm = null;
		if (info) {
			strm = gfs.createReadStream({ filename: id });
		}
		return strm;
	});
};

exports.upload = (file) => {
	var id = uuidv1();
	// assert id is not in database
	var writeStream = gfs.createWriteStream({ filename: id });
	var instance = new AudioModel({
		"id": id,
		"title": file.name,
		"source": "uploaded"
	});

	var reader = new Readable();
	reader.pipe(writeStream);
	reader.push(file.data);
	reader.push(null);

	return new Promise((resolve, reject) => {
		writeStream
		.on('close', resolve)
		.on('error', reject);
	})
	.then(() => {
		return instance.save();
	})
	.then((data) => {
		console.log('saved ', data);
		return id;
	});
};

// POST
exports.updateTitle = (id, title) => {
	return exports.metadata(id)
	.then((info) => {
		if (info === null) {
			return false;
		}
		info.title = title;
		return info.save().then((data) => {
			console.log('saved ', data);
		});
	});
};

// user specific data

