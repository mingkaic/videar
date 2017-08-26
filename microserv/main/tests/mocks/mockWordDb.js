var fakeDb = {};

exports.getWordMap = (vidId) => {
    var vidInfo = null;
    if (fakeDb[vidId]) {
        vidInfo = {
            "vidId": vidId,
            "startTime": fakeDb[vidId][0],
            "words": fakeDb[vidId][1]
        };
    }
    return Promise.resolve(vidInfo);
};

exports.setWordMap = (vidId, start, wordMap) => {
    fakeDb[vidId] = [start, wordMap];
    return Promise.resolve(true);
};

exports.clearDb = () => {
    fakeDb = {};
}
