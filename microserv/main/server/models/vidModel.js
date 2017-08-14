const mongoose = require('mongoose');

const VidSchema = new mongoose.Schema({
	vidId: { type: String, unique: true },
	source: String,
	updated: { type: Date, default: Date.now },
	lastAccess: { type: Date, default: Date.now }
});

const VFileSchema = new mongoose.Schema({
	vidId: { type: String, unique: true },
	filename: String
});

exports.VidModel = mongoose.model('videos', VidSchema);

exports.FileModel = mongoose.model('vidfiles', VFileSchema);
