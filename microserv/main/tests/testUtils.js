const fs = require('fs');
const mongo = require('mongodb');
const mp3Duration = require('mp3-duration'); // save

const connectionInfo = require('../server/db/connectMongo');

const dbSource = __dirname + '/data/dbtest.mp3';
const wordSource = __dirname + '/data/wordtest.mp3';
const wordMapPath = __dirname + '/data/mockWordMap.json';
const temporary = __dirname + "/data/temporary.mp3";

function clearCollections(db, collections) {
	const prefixLen = connectionInfo.db.length;
	var promises = collections.map((collection) => {
		var name = collection.name;
		if (name.substring(0, 6) === "system") {
			console.log(name + " cannot be dropped because it's a system file");
			return Promise.resolve();
		}
		return new Promise((resolve, reject) => {
			db.dropCollection(name, function(err) {
				if (err) {
					reject(err);
				}
				else {
					console.log(name + " dropped");
					resolve();
				}
			});
		});
	});
	return Promise.all(promises);
}

exports.clearCollection = (collectionName) => {
	return new Promise((resolve, reject) => {
		mongo.MongoClient
		.connect(connectionInfo.url, (err, db) => {
			if (err) {
				reject(err);
			}
			else {
				resolve(db);
			}
		});
	})
	.then((db) => {
		return clearCollections(db, [collectionName]);
	})
	.catch((err) => {
		console.log(err);
	});
};

exports.clearDB = () => {
	return new Promise((resolve, reject) => {
		mongo.MongoClient
		.connect(connectionInfo.url, (err, db) => {
			if(err) {
				reject(err);
			}
			else {
				db.listCollections().toArray(
				(err, collections) => {
					if (err) {
						reject(err);
					}
					else {
						resolve([db, collections]);
					}
				});
			}
		});
	})
	.then((compound) => {
		return clearCollections(compound[0], compound[1])
	})
	.catch((err) => {
		console.log(err);
	});
};

exports.isStream = (obj) => {
	return typeof(obj['pipe']) === "function" &&
	typeof(obj['on']) === "function"; 
};

exports.getTestDbStream = () => {
	return fs.createReadStream(dbSource);
};

exports.getTestWordStream = () => {
	return fs.createReadStream(wordSource);
};

exports.getTestWordMap = () => {
	return JSON.parse(fs.readFileSync(wordMapPath, 'utf8'));
};

exports.getDuration = (stream, cb) => {
	var ws = fs.createWriteStream(temporary);
	stream.pipe(ws);
	stream.on('end', () => {
		mp3Duration(temporary, (err, duration) => {
			if (err) throw err;
			cb(duration);
		});
	});
};

function objEq(obj1, obj2) {
	// ensure all children is in object form
	obj1 = JSON.parse(JSON.stringify(obj1));
	obj2 = JSON.parse(JSON.stringify(obj2));

	// typecheck
	var t1 = typeof(obj1);
	var t2 = typeof(obj2);
	if (t1 != t2) {
		return false;
	}
	// equal primitive or undefined
	if (t1 !== "object") {
		return obj1 === obj2;
	}
	// equal array
	if (t1 instanceof Array) {
		return arrEq(obj1, obj2);
	}
	
	// otherwise we deal with objects
	var attrs1 = Object.keys(obj1);
	var attrs2 = Object.keys(obj2);
	if (!arrEq(attrs1, attrs2)) {
		return false;
	}
	
	return attrs1.every((attr) => {
		return objEq(obj1[attr], obj2[attr]);
	});
}

function arrEq(arr1, arr2) {
	arr1.sort();
	arr2.sort();
	return (arr1.length == arr2.length) && 
	arr1.every((element, index) => {
		return objEq(element, arr2[index]); 
	});
}

exports.objEq = objEq;

exports.arrEq = arrEq;

exports.setEq = (set1, set2) => {
	return Array.from(set1).every((elem) => {
		return set2.has(elem)
	});
};

exports.mapEq = (map1, map2) => {
	var keys1 = Array.from(map1.keys());
	var keys2 = Array.from(map2.keys());
	if (!arrEq(keys1, keys2)) {
		return false;
	}

	return keys1.every((key) => {
		return objEq(map1.get(key), map2.get(key));
	})
};
