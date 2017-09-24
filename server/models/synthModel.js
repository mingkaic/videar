const mongoose = require('mongoose');

const SynthSchema = new mongoose.Schema({
	synthId: { type: String, unique: true },
    script: String,
    vidIds: [String]
});

module.exports = mongoose.model('synth', VidSchema);
