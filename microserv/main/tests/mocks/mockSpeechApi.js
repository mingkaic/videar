const testUtil = require('../testUtils');

var mockWordMap = require('../testUtils').getTestWordMap();

module.exports = function(audioChunkStream) {
	this.count++;
	return Promise.resolve(mockWordMap);
};

exports.counts = 0;
