const mongoose = require('mongoose');

const VidSchema = new mongoose.Schema({
	vidId: { type: String, unique: true },
	humanReadable: String,
	source: String,
	updated: { type: Date, default: Date.now },
	lastAccess: { type: Date, default: Date.now }
});

module.exports = mongoose.model('videos', VidSchema);
