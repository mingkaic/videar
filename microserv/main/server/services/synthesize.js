const fs = require('fs');
const s2Promise = require('stream-to-promise');

const utils = require('../utils');
const audioConv = require('./audioConv');

var vidDb;
var wordDb;
var s2tRequest;
var partition;
if (process.env.NODE_ENV !== 'production') {
	vidDb = require('../../tests/mocks/mockVidDb');
	wordDb = require('../../tests/mocks/mockWordDb');
	s2tRequest = require('../../tests/mocks/mockSpeechApi');
	partition = () => { return null; };
}
else {
	vidDb = require('../db/vidDb');
	wordDb = require('../db/wordDb');
	s2tRequest = require('../api/speechApi');
	partition = audioConv.partition;
}

const chunkDur = 10; // 10 seconds

// check obtain stream and initiate lazy partition starting at time 0
// breaks audio from vidId into chunks, request wordmap from each chunk, 
// stoping once wordSet is fulfilled or stream ends
//		invariants: there needs to be vidId in vidDb to get wordmap otherwise get empty map
// 		warning: wordSet is emptied after lazyPartition
function lazyPartition(vidId, start, wordSet, existingMap) {
	var wordRes = new Map(); // store words pertaining to wordSet
	return vidDb.getVidStream(vidId)
	.then((audioStream) => {
		console.log("lazy partitioning got audiostream for " + vidId);
		if (null == audioStream || !audioStream.stream) {
			console.log("stream invalid");
			return [wordRes, start];
		}

		return audioConv.getDuration(audioStream.stream)
		.then((durOut) => {
			var length = durOut[0];
			var buffer = durOut[1];

			console.log(vidId + ' has duration ' + length);
			// while wordSet is not satisfied and stream is not fulfilled,
			// parition and request wordmap sequentially
			var itFunc = () => {
				// START OF CONDITIONS
				if (start >= length || start < 0) {
					start = -1;
					return;
				}
				if (wordSet.size == 0) {
					return;
				}
				// END OF CONDITIONS

				console.log(vidId + ' starting ' + start);
				var audioChunkStream = partition(buffer.getStream(), start, Math.min(chunkDur, length - start));
				return s2tRequest(audioChunkStream)
				.then((wMap) => {
					if (wMap) {
						// merge with existingMap
						utils.addBToA(existingMap, wMap);
						
						// add wordSet-wordMap intersection to wordRes
						utils.intersectAB(wMap, wordSet, wordRes);
						utils.removeAfromB(wMap, wordSet);
					}

					start += chunkDur; // ITERATE
					return itFunc();
				});
			};
			return itFunc();
		})
		.then(() => {
			console.log("complete!");
			return [wordRes, start];
		})
		.catch((err) => {
			console.log(err);
		});
	});
}

// looks at wordMap completion, requesting for missing chunks. (by lazy partitioning starting at last start time)
function fulfill(vidId, wordMap, start, wordSet) {
	// check completition
	var complete = start < 0;

	// take wordRes as intersection of wordMap and wordSet
	// remove from wordSet along the way
	var words = new Map();
	utils.intersectAB(wordMap, wordSet, words);
	utils.removeAfromB(wordMap, wordSet);

	// if complete, return wordRes
	if (complete) {
		return Promise.resolve([words, start]);
	}

	// else continue request
	return lazyPartition(vidId, start, wordSet, wordMap)
	.then((wordMapInfo) => {
		var completion = start;
		if (wordMapInfo) {
			var freshWords = wordMapInfo[0];
			completion = wordMapInfo[1];
	
			// merge words
			utils.addBToA(words, freshWords);
		}
		return [words, completion];
	});
}

function getWordMap(vidId, wordSet) {
	return wordDb.getWordMap(vidId)
	.then((wordMapInst) => {
		var existingWordMap;
		var wordMapPromise;
		if (null === wordMapInst) {
			console.log("lazy partitioning " + vidId);
			existingWordMap = new Map();
			wordMapPromise = lazyPartition(vidId, 0, wordSet, existingWordMap);
		}
		else {
			console.log("fulfilling " + vidId);
			var start = wordMapInst.startTime;
			existingWordMap = wordMapInst.words;
			// look at wordMap completion, and whether script exists
			wordMapPromise = fulfill(vidId, existingWordMap, start, wordSet);
		}

		return wordMapPromise
		.then((wordMapInfo) => {
			var wordMap = wordMapInfo[0];
			var completion = wordMapInfo[1];

			wordDb.setWordMap(vidId, completion, existingWordMap);
			return wordMap;
		});
	});
}

function getScriptMap(vidIds, scriptSet) {
	var scriptMap = new Map();
	console.log('Looking at vidIds: ' + vidIds);
	return utils.sequentialPromise(vidIds, 
	() => scriptSet.size > 0,
	(vidId) => {
		console.log('EXTRACTING WORD MAP FROM ' + vidId);
		// check which ids have maps on vidDb
		return getWordMap(vidId, scriptSet)
		.then((wordMap) => {
			// clone to prevent data reference back to database
			wordMap = utils.obj2Map(JSON.parse(JSON.stringify(utils.map2Obj(wordMap))));
			// label times with id
			for (var keyvalue of wordMap) {
				for (var time of keyvalue[1]) {
					time['id'] = vidId;
				}
			}

			// merge word and scriptMap
			utils.addBToA(scriptMap, wordMap);
			
			// remove wordMap from scriptSet
			utils.removeAfromB(wordMap, scriptSet);
		})
		.catch(function (err) {
			// handle: if we can't reach speech to text announce s2t container is down
			console.log(err);
		});
	})
	.then(() => {
		return scriptMap;
	});
}

exports.lazyPartition = lazyPartition;

exports.fulfill = fulfill;

exports.getWordMap = getWordMap;

exports.getScriptMap = getScriptMap;

exports.synthesize = (synParam) => {
	// params must be of form: { "script" : "...", "vidIds" : ["vid1", "vid2", ...] }
	var script = synParam.script;
	var vidIds = synParam.vidIds;
	if (typeof(script) !== "string" || !(vidIds instanceof Array)) {
		throw "bad synthesis parameter: " + JSON.stringify(synParam);
	}

	var tokens = utils.tokenize(script);
	var tokenSet = new Set(tokens);
	console.log(tokenSet);

	return getScriptMap(vidIds, tokenSet)
	.then((scriptMap) => {
		// assertion: wordCount is empty, 

		var audioMap = new Map();
		// extract audio chunks
		for (var keyvalue of scriptMap) {
			var word = keyvalue[0];
			var option = keyvalue[1];
			console.log(word, option[0]);
			var audio;
			// todo: get audio from option
			audioMap.set(word, audio);
		}

		var audioLayout = tokens.map((word) => {
			return audioMap[word];
		});
		// validate audioLayout

		// piece together chunks
		var synthChunk;

		return synthChunk;
	});
};
