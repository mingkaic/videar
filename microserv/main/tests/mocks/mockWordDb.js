var fakeDb = {};

exports.getWordMap = (vidId) => {
	return Promise.resolve({
        "vidId": vidId,
        "startTime": fakeDb[vidId][0],
        "words": fakeDb[vidId][1]
    });
};

exports.setWordMap = (vidId, start, wordMap) => {
    fakeDb[vidId] = [start, wordMap];
    return Promise.resolve(true);
};
