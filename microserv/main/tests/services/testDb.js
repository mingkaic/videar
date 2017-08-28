const chai = require('chai');
const mongoose = require('mongoose');

// connect mongoose to mongo then get service
const utils = require('../../server/utils');
const testUtils = require('../testUtils');
const connectionInfo = require('../../server/db/connectMongo');
var vidDb = require('../../server/db/vidDb');
var wordDb = require('../../server/db/wordDb');

var expect = chai.expect; // we are using the "expect" style of Chai

const testId = "TEST0:_fGx6K90TmCI";
const testSrc = "test";
const testWordStart = 12;

describe('Database Tests:', function() {
	// behavior when database is empty
	describe('Video Collection (When Empty):', function() {
		beforeEach(function(done) {
			testUtils.clearDB()
			.then(() => {
				done();
			})
			.catch((err) => {
				done();
			});
		});
	
		it('getAllVidInfo should return empty', 
		function(done) {
			vidDb.getAllVidInfo()
			.then((vids) => {
				expect(vids).to.be.instanceof(Array);
				expect(vids.length).to.equal(0);
			
				done();
			})
			.catch(done);
		});
	
		it('getVidStream should return promise with value null', 
		function(done) {
			vidDb.getVidStream(testId)
			.then((foundInfo) => {
				expect(foundInfo).to.equal(null);
			
				done();
			})
			.catch(done);
		});
	
		it('setVidStream should return promise with value stream denoting success',
		function(done) {
			var rs = testUtils.getTestDbStream();
			vidDb.setVidStream(testId, 'test', rs)
			.then((gfsStream) => {
				expect(testUtils.isStream(gfsStream)).to.equal(true);
	
				if (gfsStream) {
					gfsStream.on('close', function() {
						done();
					});
				}
				else {
					done();
				}
			})
			.catch(done);
		});
	
		it('removeVidStream should do nothing',
		function(done) {
			vidDb.removeVidStream(testId)
			.then((removed) => {
				expect(removed).to.equal(false);
	
				done();
			})
			.catch(done);
		});
	});

	// behavior when database already has an entry
	describe('Video Collection (With An Entry):', function() {
		beforeEach(function(done) {
			var rs = testUtils.getTestDbStream();
			vidDb.setVidStream(testId, testSrc, rs)
			.then((gfsStream) => {
				if (gfsStream) {
					gfsStream.on('close', function() {
						done();
					});
				}
				else {
					done();
				}
			})
			.catch((err) => {
				done();
			});
		});

		it('getAllVidInfo should return entry in array', 
		function(done) {
			vidDb.getAllVidInfo()
			.then((vids) => {
				expect(vids).to.be.instanceof(Array);
				expect(vids.length).to.equal(1);
				var entry = vids[0];
				expect(entry.vidId).to.equal(testId);
				expect(entry.source).to.equal(testSrc);
			
				done();
			})
			.catch(done);
		});

		it('getVidStream on entry should return promise with non-null stream', 
		function(done) {
			vidDb.getVidStream(testId)
			.then((foundInfo) => {
				expect(foundInfo).to.not.equal(null);
				expect(testUtils.isStream(foundInfo.stream)).to.equal(true);
				expect(foundInfo.source).to.equal(testSrc);

				done();
			})
			.catch(done);
		});

		it('setVidStream on entry should return promise with false denoting failed re-writing, tests for idempotency', 
		function(done) {
			// write from database again should return false, and undefined vidDbStream is not used
			vidDb.setVidStream(testId, testSrc)
			.then((gfsStream) => {
				expect(gfsStream).to.equal(null);
		
				done();
			})
			.catch(done);
		});
		
		it('removeVidStream on entry should empty the videos collection',
		function(done) {
			vidDb.removeVidStream(testId)
			.then((removed) => {
				expect(removed).to.equal(true);
				// todo: verify collection is empty

				done();
			})
			.catch(done);
		});
	});
	
	describe('Wordmap Collection (When Empty):', function() {
		beforeEach(function(done) {
			testUtils.clearDB()
			.then(() => {
				done();
			});
		});

		it('getTranscript should return promise with value null', 
		function(done) {
			wordDb.getTranscript(testId)
			.then((transcriptInfo) => {
				expect(transcriptInfo).to.equal(null);
			
				done();
			})
			.catch(done);
		});
		
		it('setTranscript should save required data', 
		function(done) {
			var mockTranscript = testUtils.getTestTranscript();
			wordDb.setTranscript(testId, testWordStart, mockTranscript)
			.then((data) => {
				expect(data.vidId).to.equal(testId);
				expect(data.startTime).to.equal(testWordStart);
				expect(data.subtitles).to.be.instanceOf(Array);
				expect(testUtils.objEq(data.subtitles, mockTranscript)).to.equal(true);

				done();
			})
			.catch(done);
		});

		after(function(done) {
			testUtils.clearDB()
			.then(() => {
				done();
			});
		});
	});
	
	describe('Wordmap Collection (With An Entry):', function() {
		beforeEach(function(done) {
			var mockTranscript = testUtils.getTestTranscript();
			wordDb.setTranscript(testId, 12, mockTranscript)
			.then((data) => {
				done();
			})
			.catch(done);
		});

		it('getTranscript should return promise with wordMap', 
		function(done) {
			var mockTranscript = testUtils.getTestTranscript();
			wordDb.getTranscript(testId)
			.then((data) => {
				expect(data.vidId).to.equal(testId);
				expect(data.startTime).to.equal(testWordStart);
				expect(data.subtitles).to.be.instanceOf(Array);
				expect(testUtils.objEq(data.subtitles, mockTranscript)).to.equal(true);
			
				done();
			})
			.catch(done);
		});
		
		it('setTranscript should update data', 
		function(done) {
			var mockTranscript = testUtils.getTestTranscript();
		
			wordDb.setTranscript(testId, testWordStart, mockTranscript)
			.then((data) => {
				mockTranscript.push({"word": "injected", "time": { "start": 10000, "end": 11000 } });
				return wordDb.setTranscript(testId, -1, mockTranscript);
			})
			.then((data) => {
				expect(data.vidId).to.equal(testId);
				expect(data.startTime).to.equal(-1);
				expect(data.subtitles).to.be.instanceOf(Array);
				expect(testUtils.objEq(data.subtitles, mockTranscript)).to.equal(true);

				done();
			})
			.catch(done);
		});
		
		after(function(done) {
			testUtils.clearDB()
			.then(() => {
				done();
			});
		});
	});

	after(function() {
		testUtils.clearDB()
		.then(() => {
			mongoose.disconnect();
		});
	});
});
