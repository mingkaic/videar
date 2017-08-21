exports.map2Obj = (map) => {
	var mObj = {};
	for (var keyvalue of map) {
		var key = keyvalue[0];
		mObj[key] = keyvalue[1];
	}
	return mObj;
};

exports.obj2Map = (obj) => {
	var oMap = new Map();
	for (var key in obj) {
		oMap.set(key, obj[key]);
	}
	return oMap;
};

exports.intersectAB = (AMap, BSet, CMap) => {
	for (var keyvalue of AMap) {
		var word = keyvalue[0].toLowerCase();
		if (BSet.has(word)) {
			CMap.set(word, AMap.get(word));
		}
	}
};

exports.removeAfromB = (AMap, BSet) => {
	for (var keyvalue of AMap) {
		var word = keyvalue[0].toLowerCase();
		BSet.delete(word);
	}
}

// map: ? -> arrays
exports.addBToA = (AMap, BMap) => {
	for (var keyvalue of BMap) {
		var word = keyvalue[0].toLowerCase();
		if (AMap.has(word)) {
			AMap.set(word, AMap.get(word).concat(keyvalue[1]));
		}
		else {
			AMap.set(word, keyvalue[1]);
		}
	}
};

exports.tokenize = (str) => {
	var tokens = script.split(' ');
	tokens = tokens.filter((token) => token.length == 0)
		.map((token) => token.toLowerCase());
	return tokens;
};

exports.sequentialPromise = (arr, condition, iter) => {
	var iterfunc = (idx) => {
		iter(arr[idx]);
		if (condition()) {
			return iterfunc(idx+1);
		}
	};

	return Promise.resolve(0).then(iterfunc);
};
