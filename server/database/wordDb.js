const mongoose = require('mongoose');

const transcriptModel = require('../models/transcriptModel');
const utils = require('../utils');

exports.getTranscript = (vidId) => {
	return transcriptModel.findOne({ 'vidId': vidId }).exec();
};

// start = -1 if wordMap requests are complete
exports.setTranscript = (vidId, start, transcript) => {
	if (!(transcript instanceof Array)) {
		throw "setting non-array transcript";
	}

	return transcriptModel.findOne({ 'vidId': vidId }).exec()
	.then((transcriptInfo) => {
		if (transcriptInfo) {
			transcriptInfo.startTime = start;
			// todo: select best wordMap (attempt to correct missing words)
			transcriptInfo.subtitles = transcript;
		}
		else {
			// record next chunk start time, completion status to audioMap
			transcriptInfo = new transcriptModel({
				'vidId': vidId,
				'startTime': start,
				'subtitles': transcript // transcript has form [{"word": string, time: {"start": number, "end": number}}]
			});
		}
		// save audioMap
		return transcriptInfo.save();
	});
};
