const mongoose = require('mongoose');
const grid = require('gridfs-stream');

var dbName = 'videar';
if (process.env.NODE_ENV !== 'production') {
	dbName += '_test';
}

const dbHost = process.env.DB_HOST || '127.0.0.1';

// setup grid and mongoose
const mongoURL = 'mongodb://' + dbHost + ':27017/' + dbName;
mongoose.connect(mongoURL, { useMongoClient: true });
grid.mongo = mongoose.mongo;
mongoose.Promise = require('bluebird');

var connection = mongoose.connection;

connection.on('connected', () => {
	console.log('Mongoose connection open to ' + mongoURL);
});

connection.on('error', (err) => {  
	console.log('Mongoose connection error: ' + err);
}); 

connection.on('disconnected', () => {
	console.log('Mongoose connection disconnected'); 
});

var gfs = null;
connection.once('connected', () => {
	gfs = grid(connection.db, mongoose.mongo);
});

var model = mongoose.model('videos', new Schema());

exports.getStream = (vidId) => {
	return model.findOne({ 'vidId': vidId }).exec()
	.then((vidInfo) => {
		if (vidInfo) {
			// vid exists, make a stream, read and return it
			return gfs.createReadStream({ filename: vidId });
		}
		return null;
	});
};
