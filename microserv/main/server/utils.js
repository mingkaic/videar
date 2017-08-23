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

// taken from https://stackoverflow.com/questions/5467129/sort-javascript-object-by-key
function sortObj(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
}

function uniqueConcat(arr1, arr2) {
	var arrset = new Set(arr2.map(sortObj).map(JSON.stringify));

	var arr3 = Array.from(arr2);
	for (var elem of arr1) {
		if (!arrset.has(JSON.stringify(sortObj(elem)))) {
			arr3.add(arr1);
		}
	}
	return arr3;
}

// map: ? -> array of 1-level objects
exports.addBToA = (AMap, BMap) => {
	for (var keyvalue of BMap) {
		var word = keyvalue[0].toLowerCase();
		if (AMap.has(word)) {
			var arr1 = AMap.get(word);
			var arr2 = keyvalue[1];
			var combined = uniqueConcat(arr1, arr2);

			AMap.set(word, combined);
		}
		else {
			AMap.set(word, keyvalue[1]);
		}
	}
};

exports.tokenize = (str) => {
	var tokens = str.split(' ');
	tokens = tokens.filter((token) => token.length > 0)
		.map((token) => token.toLowerCase());
	return tokens;
};

exports.sequentialPromise = (arr, condition, iter) => {
	var iterfunc = (idx) => {
		console.log(condition());
		if (idx < arr.length && condition()) {
			console.log("sequentially processing " + arr[idx]);
			return iter(arr[idx])
			.then(() => {
				return iterfunc(idx+1);
			});
		}
		console.log("sequential array completed");
	};

	return Promise.resolve(0).then(iterfunc);
};
