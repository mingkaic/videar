const mongoose = require('mongoose');

const wordMapModel = require('../models/wordMapModel');
const utils = require('../utils');

exports.getWordMap = (vidId) => {
	return wordMapModel.findOne({ 'vidId': vidId }).exec();
};

// start = -1 if wordMap requests are complete
exports.setWordMap = (vidId, start, wordMap) => {
	// record next chunk start time, completion status to audioMap
	var instance = new wordMapModel({
		'vidId': vidId,
		'startTime': start,
		'words': utils.map2Obj(wordMap)
	});

	// save audioMap
	return instance.save();
};
