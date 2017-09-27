const mongoose = require('mongoose');
const grid = require('gridfs-stream');

var AudioModel = require('../models/audioModel.js');

var gfs = null;
var connection = mongoose.connection;
connection.once('connected', () => {
	gfs = grid(connection.db, mongoose.mongo);
});

// publically accessible data
// GET
exports.all = () => {
	return AudioModel.find({}).exec();
};

exports.metadata = (id) => {
    return AudioModel.findOne({ "id": id }).exec();
};

exports.get = (id, source) => {
    return exports.metadata(id)
    .then((info) => {
        var strm = null;
        if (info) {
            strm = gfs.createReadStream({ filename: source + id });
        }
        return strm;
    })
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

