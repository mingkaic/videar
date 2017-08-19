exports.map2Obj = (map) => {
    var mObj = {};
    for (var keyvalue of map) {
        mObj[key] = map.get(key);
    }
    return oMap;
};

exports.obj2Map = (obj) => {
    var oMap = new Map();
    for (var key in obj) {
        oMap.set(key, obj[key]);
    }
    return oMap;
};

exports.intersectARemoveB = (AMap, BSet, CMap) => {
    for (var keyvalue of AMap) {
        var word = keyvalue[0].toLowerCase();
        if (BSet.has(word)) {
            CMap.set(word, AMap.get(word));
            BSet.delete(word);
        }
    }
};

exports.ABMapArrMerge = (AMap, BMap) => {
    for (var keyvalue of BMap) {
        var word = keyvalue[0].toLowerCase();
        if (AMap.has(word)) {
            AMap.set(word, concatenate(AMap.get(word), keyvalue[1]));
        }
        else {
            AMap.set(word, keyvalue[1]);
        }
    }
    return AMap;
};

exports.tokenSet = (str) => {
    var tokens = script.split(' ');
    tokens = tokens.filter((token) => token.length == 0)
        .map((token) => token.toLowerCase());
    return new Set(tokens);
};
