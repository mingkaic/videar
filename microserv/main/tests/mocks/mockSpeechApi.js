const testUtil = require('../testUtils');
const utils = require('../../server/utils');

var mockWordMap = require('../testUtils').getTestWordMap();

var default_split = 3;
var mockWordMaps;

function split(split) {
	var allMap = utils.obj2Map(mockWordMap);
	var mapAttrs = Object.keys(mockWordMap);
	if (split < 2) {
		mockWordMaps = [ allMap ];
		return;
	}
	module.exports.nsplit = split;
	mockWordMaps = [];
	var splitsize = mapAttrs.length/split;
	var it = 0;
	for (var i = 0; i < split; i++) {
		if (it+splitsize >= mapAttrs.length) {
			splitsize = mapAttrs.length - it;
		}
		var splitSet = new Set(mapAttrs.splice(it, it+splitsize));
		var splitMap = new Map();
		utils.intersectAB(allMap, splitSet, splitMap);
		mockWordMaps.push(splitMap);
	}
}

split(default_split);

module.exports = function (audioChunkStream) {
	var promise = Promise.resolve(mockWordMaps[module.exports.count % module.exports.nsplit]);
	module.exports.count++;
	return promise;
}

module.exports.count = 0;
module.exports.split = split;
module.exports.nsplit = default_split;
