const fs = require('fs');
const s2Promise = require('stream-to-promise');
const request = require('request-promise');
const mm = require('musicmetadata');

const db = require('../db/fileDb');
const utils = require('../utils');
const wordMapModel = require('../models/wordMapModel');
const audioPartition = require('./audioConv').partition;

var s2tRequest = require('./speechApi');
if (process.env.NODE_ENV !== 'production') {
	s2tRequest = request('../../tests/mocks/mockSpeechApi');
}

const chunkDur = 10; // 10 seconds

// breaks audio from vidId into chunks, request wordmap from each chunk, 
// stoping once wordCount is fulfilled or stream ends
function lazyPartition(audioStream, start, wordCount, vidId) {
	var audioMap = new Map();
	var wordRes = new Map();
	var promise = new Promise((resolve, reject) => {
		mm(audioStream, { duration: true }, (err, metadata) => {
			if (err) {
				reject(err);
			}
			else {
				resolve(metadata.duration);
			}
		});
	})
	.then((length) => {
		// while wordCount is not satisfied and stream is not fulfilled,
		// parition and request wordmap sequentially
		var itFunc = () => {
			var audioChunkStream;
			var isLast = start + chunkDur >= length;
			if (isLast) {
				audioChunkStream = audioPartition(audioStream, start, length - start);
				start = -1;
			}
			else {
				audioChunkStream = audioPartition(audioStream, start, dur);
			}
			return s2tRequest(audioChunkStream)
			.then((wMap) => {
				console.log(wMap);
				// merge with audioMap
				audioMap = utils.ABMapArrMerge(audioMap, wordMap);
				
				// add wordCount-wordMap intersection to wordRes
				utils.intersectARemoveB(wordMap, wordCount, wordRes);
				
				if (wordCount.size > wordRes.size && !isLast) {
					start += chunkDur;
					return Promise.resolve(itFunc);
				}
			});
		};
		return itFunc();
	})
	.then(() => {
		console.log("complete!");
		// record next chunk start time, completion status to audioMap
		var instance = new wordMapModel({
			'vidId': vidId,
			'startTime': start,
			'words': utils.map2Obj(audioMap)
		});
	
		// save audioMap
		instance.save();
	
		return wordRes;
	})
	.catch((err) => {
		console.log(err);
	});

	return promise;
}

// check obtain stream and initiate lazy partition starting at time 0
function minimalPartition(vidId, wordCount) {
	var audioStream = db.getVidStream(vidId);
	if (null == audioStream || !audioStream.stream) {
		return {};
	}
	audioStream = audioStream.stream;
	var start = 0;
	return lazyPartition(audioStream, start, wordCount, vidId);
}

// looks at wordMap completion, requesting for missing chunks. (by lazy partitioning starting at last start time)
function fulfill(wordMap, wordCount) {
	// check completition
	var start = wordMap.startTime;
	var complete = start < 0;

	wordMap = utils.obj2Map(wordMap.words);

	// take wordRes as intersection of wordMap and wordCount
	// remove from wordCount along the way
	var wordRes = new Map();
	utils.intersectARemoveB(wordMap, wordCount, wordRes);

	// if complete, return wordRes
	if (complete) {
		return Promise.resolve(wordRes);
	}

	// else continue request
	var audioStream = db.getVidStream(wordMap.vidId);
	return lazyPartition(audioStream, start, wordCount, vidId)
	.then((freshWordRes) => {
		// merge freshWordRes and wordRes
		return utils.ABMapArrMerge(freshWordRes, wordRes);;
	});
}

exports.lazyPartition = lazyPartition;

exports.minimalPartition = minimalPartition;

exports.fulfill = fulfill;

exports.synthesize = (synParam) => {
	// params must be of form: { "script" : "...", "vidIds" : ["vid1", "vid2", ...] }
	var script = synParam.script;
	var vidIds = synParam.vidIds;
	if (typeof(script) !== "string" || typeof(vidIds) != "object") {
		throw "bad synthesis parameter: " + synParam;
	}

	var wordCount = utils.tokenSet(script);
	var scriptMap = new Map();

	var mapPromise = vidIds.map((vidId) => {
		// check which ids have maps on db
		return wordMapModel.findOne({ 'vidId': vidId }).exec()
		.then((wordMap) => {
			if (null == wordMap) {
				return minimalPartition(vidId, wordCount);
			}
			else {
				// look at wordMap completion, and whether script exists
				return fulfill(wordMap, wordCount);
			}
		})
		.then((wordMap) => {
			// merge word and scriptMap
			scriptMap = new Map(scriptMap, wordMap);
			// remove wordMap from wordCount
		})
		.catch(function (err) {
			// handle: if we can't reach speech to text announce s2t container is down
			console.log(err);
		});
	});

	return Promise.all(mapPromise);
};
