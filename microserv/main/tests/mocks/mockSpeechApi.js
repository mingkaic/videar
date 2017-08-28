const testUtil = require('../testUtils');
const utils = require('../../server/utils');

var mockTranscript = require('../testUtils').getTestTranscript();
var n = mockTranscript.length;

// todo: inject some junk values into mockWordMap

var default_split = 3;
var mockTranscripts;

function split(nsplit) {
	module.exports.count = 0;
	module.exports.nsplit = nsplit;

	if (nsplit < 2) {
		mockTranscripts = [ mockTranscript ];
		return;
	}
	mockTranscripts = [];
	var mockCpy = mockTranscript.slice();
	var splitsize = Math.ceil(n/nsplit);
	for (var i = 0; i < nsplit; i++) {
		var end = Math.min(splitsize, mockCpy.length);
		mockTranscripts.push(mockCpy.splice(0, end));
	}
}

module.exports = function (audioChunkStream) {
	var promise = Promise.resolve(mockTranscripts[module.exports.count % module.exports.nsplit]);
	module.exports.count++;
	return promise;
};

module.exports.count = 0;
module.exports.split = split;
module.exports.nsplit = default_split;
module.exports.splitInject = (value) => {
	mockTranscripts[(module.exports.count + 1) % module.exports.nsplit].push(value);
};

split(default_split);
