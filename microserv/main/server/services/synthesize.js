const fs = require('fs');
const mm = require('musicmetadata');
const s2Promise = require('stream-to-promise');

const utils = require('../utils');
const audioPartition = require('./audioConv').partition;

var s2tRequest;
var db;
if (process.env.NODE_ENV !== 'production') {
	db = require('../../tests/mocks/mockVidDb');
	s2tRequest = require('../../tests/mocks/mockSpeechApi');
}
else {
	db = require('../db/vidDb');
	s2tRequest = require('../api/speechApi');
}

const chunkDur = 10; // 10 seconds

// check obtain stream and initiate lazy partition starting at time 0
// breaks audio from vidId into chunks, request wordmap from each chunk, 
// stoping once wordCount is fulfilled or stream ends
function lazyPartition(vidId, start, wordCount) {
	var audioStream = db.getVidStream(vidId);
	if (null == audioStream || !audioStream.stream) {
		return {};
	}
	audioStream = audioStream.stream;

	var audioMap = new Map(); // store every word extracted
	var wordRes = new Map(); // store words pertaining to wordCount
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
		db.setWordMap(vidId, start, audioMap);
	
		return wordRes;
	})
	.catch((err) => {
		console.log(err);
	});

	return promise;
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
	return lazyPartition(vidId, start, wordCount)
	.then((freshWordRes) => {
		// merge freshWordRes and wordRes
		return utils.ABMapArrMerge(freshWordRes, wordRes);;
	});
}

exports.lazyPartition = lazyPartition;

exports.fulfill = fulfill;

exports.synthesize = (synParam) => {
	// params must be of form: { "script" : "...", "vidIds" : ["vid1", "vid2", ...] }
	var script = synParam.script;
	var vidIds = synParam.vidIds;
	if (typeof(script) !== "string" || vidIds instanceof Array) {
		throw "bad synthesis parameter: " + synParam;
	}

	var wordCount = utils.tokenSet(script);
	var scriptMap = new Map();

	var mapPromise = vidIds.map((vidId) => {
		// check which ids have maps on db
		return db.getWordMap(vidId)
		.then((wordMapInst) => {
			if (null === wordMapInst) {
				return lazyPartition(vidId, 0, wordCount);
			}
			else {
				// look at wordMap completion, and whether script exists
				return fulfill(wordMapInst, wordCount);
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
