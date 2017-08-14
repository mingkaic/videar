const chai = require('chai');
const mongoose = require('mongoose');
const fs = require('fs');
const s2p = require('stream-to-promise');

// connect mongoose to mongo then get service
require('../server/db/connectMongo');
var db = require('../server/services/vidDb');

var expect = chai.expect; // we are using the "expect" style of Chai

const testId = "TEST0:_fGx6K90TmCI";
const source = __dirname + '/data/test1.mp3';

describe('Database read, write, and removal:', function() {
	beforeEach(function(done) {
		db.removeYTStream(testId)
		.then(() => {
			done();
		});
	});

	it('getVidStream should return promise with value null', 
	function(done) {
		db.getVidStream(testId)
		.then((foundInfo) => {
			expect(foundInfo).to.equal(null);
			done();
		});
	});

	it('setVidStream should return promise with value true denoting success', 
	function(done) {
		var rs = fs.createReadStream(source);
		db.setVidStream(testId, 'test', rs)
		.then((written) => {
			expect(written).to.equal(true);

			rs.on('close', function() {
				done();
			});
		});
	});

	it('getVidStream after successful setVidStream should return promise with non-null stream', 
	function(done) {
		var rs = fs.createReadStream(source);
		db.setVidStream(testId, 'test', rs)
		.then((written) => {
			expect(written).to.equal(true);
			rs.on('close', function() {
				// read from database again should succeed
				db.getVidStream(testId)
				.then((foundInfo) => {
					expect(foundInfo).to.not.equal(null);
					done();
				});
			});
		});
	});

	it('setVidStream after successful setVidStream should return promise with false denoting failed re-writing, tests for idempotency', 
	function(done) {
		var rs = fs.createReadStream(source);
		db.setVidStream(testId, 'test', rs)
		.then((written) => {
			expect(written).to.equal(true);
			// write from database again should return false, and undefined dbStream is not used
			return db.setVidStream(testId, 'test');
		})
		.then((written) => {
			expect(written).to.equal(false);

			rs.on('close', function() {
				done();
			});
		});
	});

	after(function() {
		mongoose.disconnect();
	});
});
