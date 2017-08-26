const request = require('request-promise');
const utils = require('../utils');

const db = require('../db/vidDb');

const s2tHost = process.env.SPEECH_HOST || '127.0.0.1';
const s2tPort = process.env.SPEECH_PORT || '8000';

const speechURL = 'http://' + s2tHost + ':' + s2tPort;

const timeout = 3000000; // 50 minute

var simplemutex = false;

module.exports = (audioChunkStream) => {
	simplemutex = true;
	console.log("speech api called");
	return db.cache(audioChunkStream)
	.then((cacheId) => {
		console.log('data cached and calling ' + speechURL + '/vid_wordmap/'+cacheId);
		return request.get({ 
			"url": speechURL + '/vid_wordmap/' + cacheId,
			"json": true,
			"timeout": timeout
		});
	})
	.then((response) => {
		simplemutex = false;
		if (response) {
			return utils.obj2Map(response.vidIds);
		}
		else {
			throw "unable to retreive word map";
		}
	});
};
