const mongoose = require('mongoose');

const WordMapSchema = new mongoose.Schema({
	vidId: { type: String, unique: true, required: true, index: true },
	startTime: { type: Number },
	words: { type: mongoose.Schema.Types.Mixed, default: {} }
});

module.exports = mongoose.model('wordmap', WordMapSchema);
