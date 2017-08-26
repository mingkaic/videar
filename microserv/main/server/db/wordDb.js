const mongoose = require('mongoose');

const wordMapModel = require('../models/wordMapModel');
const utils = require('../utils');

exports.getWordMap = (vidId) => {
	return wordMapModel.findOne({ 'vidId': vidId }).exec()
	.then((wordMapInfo) => {
		if (wordMapInfo) {
			wordMapInfo.words = utils.obj2Map(wordMapInfo.words);
		}
		return wordMapInfo;
	});
};

// start = -1 if wordMap requests are complete
exports.setWordMap = (vidId, start, wordMap) => {
	if (wordMap instanceof Map) {
		wordMap = utils.map2Obj(wordMap);
	}

	return wordMapModel.findOne({ 'vidId': vidId }).exec()
	.then((wordMapInfo) => {
		console.log(start, wordMap);
		if (wordMapInfo) {
			wordMapInfo.startTime = start;
			// todo: select best wordMap (attempt to correct missing words)
			wordMapInfo.words = wordMap;
		}
		else {
			// record next chunk start time, completion status to audioMap
			wordMapInfo = new wordMapModel({
				'vidId': vidId,
				'startTime': start,
				'words': wordMap
			});
		}
		// save audioMap
		return wordMapInfo.save();
	})
	.then((wordMapInfo) => {
		if (wordMapInfo) {
			wordMapInfo.words = utils.obj2Map(wordMapInfo.words);
		}
		return wordMapInfo;
	});
};
