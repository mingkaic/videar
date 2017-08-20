const fs = require('fs');
const mongo = require('mongodb');

const connectionInfo = require('../server/db/connectMongo');

const dbSource = __dirname + '/data/dbtest.mp3';
const wordSource = __dirname + '/data/wordtest.mp3';
const wordMapPath = __dirname + '/data/mockWordMap.json';

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
