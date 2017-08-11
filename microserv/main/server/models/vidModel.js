const mongoose = require('mongoose');

const linkVidSchema = new mongoose.Schema({
	vidId: { type: String, unique: true },
	offline: Boolean,
	updated: { type: Date, default: Date.now },
	lastAccess: { type: Date, default: Date.now }
});

module.exports = mongoose.model('vidLinks', linkVidSchema);
