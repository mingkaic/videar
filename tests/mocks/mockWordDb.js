var fakeDb = {};

exports.getTranscript = (vidId) => {
    var vidInfo = null;
    if (fakeDb[vidId]) {
        vidInfo = {
            "vidId": vidId,
            "startTime": fakeDb[vidId][0],
            "subtitles": fakeDb[vidId][1]
        };
    }
    return Promise.resolve(vidInfo);
};

exports.setTranscript = (vidId, start, transcript) => {
    fakeDb[vidId] = [start, transcript];
    return Promise.resolve(true);
};

exports.clearDb = () => {
    fakeDb = {};
}
