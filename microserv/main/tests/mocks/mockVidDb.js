var fakeDb = {};
const fakeStream = {"on": () => {}, "pipe": () => {}};

exports.getAllVidInfo = () => {
    var info = Object.keys(fakeDb).map((key) => {
        return {
            vidId: key,
            source: fakeDb[key]
        };
    });
	return Promise.resolve(info);
};

exports.getVidStream = (vidId) => {
	// relies on query to wait until connection for gfs declaration
    return new Promise((resolve) => {
		if (fakeDb[vidId]) {
			resolve({
				"stream": fakeStream,
				"source": fakeDb[vidId]
			});
		}
		resolve(null);
	});
};

// write to gridfs if vidInfo is not found (idempotent)
exports.setVidStream = (vidId, source, dbStream) => {
	return new Promise((resolve) => {
		if (fakeDb[vidId]) {
			resolve(null);
		}

		fakeDb[vidId] = source;
		resolve(fakeStream);
	});
};

// removes the vidId
exports.removeVidStream = (vidId) => {
	return new Promise((resolve) => {
		if (fakeDb[vidId]) {
			delete fakeDb[vidId];

			return resolve(true);
		}
		return resolve(false);
	});
};

exports.cache = (stream) => {
	// todo: replace with cache
	var cacheId = "chunk_fakecacheId";
	return Promise.resolve(cacheId);
};
