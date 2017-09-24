const mongoose = require('mongoose');

const TranscriptSchema = new mongoose.Schema({
	vidId: { type: String, unique: true, required: true, index: true },
	speechModel: { type: String, default: 'sphinx4' },
	startTime: { type: Number },
	subtitles: { type: [mongoose.Schema.Types.Mixed], default: [] }
});

module.exports = mongoose.model('transcript', TranscriptSchema);
