const chai = require('chai');
const fs = require('fs');

const utils = require('../../server/utils');
const synthesize = require('../../server/services/synthesize');
const mockMeta = require('../mocks/mockMetadata');
const mockVidDb = require('../mocks/mockVidDb');
const mockWordDb = require('../mocks/mockWordDb');
const mockSpeech = require('../mocks/mockSpeechApi');
const testUtils = require('../testUtils');

var mockobj = JSON.parse(fs.readFileSync(__dirname + '/../data/mockSynthData.json', 'utf8'));

var expect = chai.expect; // we are using the "expect" style of Chai

const testId = "TEST0:_fGx6K90TmCI";
const testSrc = "test";

describe('Synthesis and its subroutines:', function() {
	before(function() {
		// we need a mock audio in fake db
		mockVidDb.setVidStream(testId, testSrc, null);
	});

	describe('When Empty AND getWordMap subroutines:', function() {
		beforeEach(function() {
			mockSpeech.count = 0;
		});
	
		it("lazyPartition should stop calling s2t API once wordmap keyset matches wordset", 
		function(done) {
			var n_split = 1;
			mockSpeech.split(n_split);
	
			var mockWord = testUtils.getTestWordMap();
			var mockSet = Object.keys(mockWord);
			var mockSet2 = new Set(mockSet);
			mockSet = new Set(mockSet);
			mockWord = utils.obj2Map(mockWord);
			var existingMap = new Map();
	
			synthesize.lazyPartition(testId, 0, mockSet, existingMap)
			.then((wordMapInfo) => {
				var wordRes = wordMapInfo[0];
				var completion = wordMapInfo[1];
	
				expect(completion).to.equal(10); // chunk duration
				expect(mockSpeech.count).to.equal(n_split);
				expect(wordRes).to.be.an.instanceof(Map);
				
				expect(testUtils.setEq(new Set(wordRes.keys()), mockSet2)).to.equal(true);
				expect(testUtils.mapEq(existingMap, mockWord)).to.equal(true);
	
				done();
			})
			.catch(done);
		});
	
		// the audio partition operation is mocked, but it does not handle validating duration
		// IF partition validates duration, then RETHINK this test
		it("lazyPartition should never call s2t API if the start time is longer than the duration of the audio", 
		function(done) {
			var mockSet = new Set(Object.keys(testUtils.getTestWordMap()));
			var existingMap = new Map();
	
			synthesize.lazyPartition(testId, mockMeta.duration, mockSet, existingMap)
			.then((wordMapInfo) => {
				var wordRes = wordMapInfo[0];
				var completion = wordMapInfo[1];
	
				expect(completion).to.equal(-1); // completion flag
				expect(mockSpeech.count).to.equal(0);
				expect(wordRes).to.be.an.instanceof(Map);
	
				expect(Array.from(wordRes.keys()).length).to.equal(0);
				expect(existingMap.size).to.equal(0);
				
				done();
			})
			.catch(done);
		});
	
		it("fulfill should not call s2t API if wordmap keyset matches wordset", 
		function(done) {
			var mockWord = testUtils.getTestWordMap();
			var mockSet = Object.keys(mockWord);
			var mockSet2 = new Set(mockSet);
			mockSet = new Set(mockSet);
			mockWord = utils.obj2Map(mockWord);
	
			synthesize.fulfill(testId, mockWord, 0, mockSet)
			.then((wordMapInfo) => {
				var wordRes = wordMapInfo[0];
				var completion = wordMapInfo[1];
	
				expect(completion).to.equal(0);
				expect(mockSpeech.count).to.equal(0);
				expect(wordRes).to.be.an.instanceof(Map);
				
				expect(testUtils.setEq(new Set(wordRes.keys()), mockSet2)).to.equal(true);
				expect(testUtils.mapEq(wordRes, mockWord)).to.equal(true);
				
				done();
			})
			.catch(done);
		});
		
		it("fulfill should call s2t API if wordmap keyset does not contain every word in wordset", 
		function(done) {
			var n_split = 3;
			mockSpeech.split(n_split);
	
			var mockWord = testUtils.getTestWordMap();
			var mockSet = Object.keys(mockWord);
			var mockSet2 = new Set(mockSet);
			var existingMap = utils.obj2Map(mockWord);
			mockSet = new Set(mockSet);
			mockWord = utils.obj2Map(mockWord);
	
			// remove some words
			Array.from(mockSet).forEach((value, idx) => {
				if (idx % 2 == 0) {
					existingMap.delete(value);
				}
			});
	
			synthesize.fulfill(testId, existingMap, 0, mockSet)
			.then((wordMapInfo) => {
				var wordRes = wordMapInfo[0];
				var completion = wordMapInfo[1];
	
				expect(completion).to.equal(n_split * 10);
				expect(mockSpeech.count).to.equal(n_split);
				expect(wordRes).to.be.an.instanceof(Map);
				
				expect(testUtils.setEq(new Set(wordRes.keys()), mockSet2)).to.equal(true);
				expect(testUtils.mapEq(wordRes, mockWord)).to.equal(true);
				
				done();
			})
			.catch(done);
		});
	
		it("getWordMap calls speechAPI if wordmap does not exist", 
		function(done) {
			var n_split = 3;
			mockSpeech.split(n_split);

			var mockWord = testUtils.getTestWordMap();
			var mockSet = Object.keys(mockWord);
			var mockSet2 = new Set(mockSet);
			mockSet = new Set(mockSet);
			mockWord = utils.obj2Map(mockWord);

			synthesize.getWordMap(testId, mockSet)
			.then((wordMap) => {
				expect(mockSpeech.count).to.equal(n_split);
				expect(wordMap).to.be.an.instanceof(Map);
				expect(testUtils.setEq(new Set(wordMap.keys()), mockSet2)).to.equal(true);

				return mockWordDb.getWordMap(testId)
				.then((mapInfo) => {
					expect(mapInfo).to.not.equal(null);
					var storedWordMap = mapInfo.words;
					expect(storedWordMap).to.be.an.instanceof(Map);
					expect(testUtils.mapEq(wordMap, storedWordMap)).to.equal(true);
					
					done();
				});
			})
			.catch(done);
		});
	});
	
	describe('Existing Incomplete Wordmap:', function() {
		beforeEach(function(done) {
			mockSpeech.count = 0;
			
			var incompleteMap = utils.obj2Map(testUtils.getTestWordMap());
			// remove some words
			Array.from(incompleteMap.keys()).forEach((value, idx) => {
				if (idx % 2 == 0) {
					incompleteMap.delete(value);
				}
			});

			// add incomplete wordmap
			mockWordDb.clearDb();
			mockWordDb.setWordMap(testId, 5, incompleteMap)
			.then((wordMapInfo) => {
				done();
			})
			.catch(done);
		});
		
		it("getWordMap calls speechAPI if wordmap exist but doesn't contains wordset", 
		function(done) {
			var n_split = 5;
			mockSpeech.split(n_split);

			var mockWord = testUtils.getTestWordMap();
			var mockSet = Object.keys(mockWord);
			var mockSet2 = new Set(mockSet);
			mockSet = new Set(mockSet);
			mockWord = utils.obj2Map(mockWord);

			synthesize.getWordMap(testId, mockSet)
			.then((wordMap) => {
				expect(mockSpeech.count).to.equal(n_split);
				expect(wordMap).to.be.an.instanceof(Map);
				expect(testUtils.setEq(new Set(wordMap.keys()), mockSet2)).to.equal(true);

				return mockWordDb.getWordMap(testId)
				.then((mapInfo) => {
					expect(mapInfo).to.not.equal(null);
					var storedWordMap = mapInfo.words;
					expect(storedWordMap).to.be.an.instanceof(Map);
					expect(testUtils.mapEq(wordMap, storedWordMap)).to.equal(true);
					
					done();
				});
			})
			.catch(done);
		});
	});
	
	describe('Existing Complete Wordmap:', function() {
		beforeEach(function(done) {
			mockSpeech.count = 0;
			
			var completeMap = utils.obj2Map(testUtils.getTestWordMap());
			
			// add complete wordmap
			mockWordDb.clearDb();
			mockWordDb.setWordMap(testId, -1, completeMap)
			.then((wordMapInfo) => {
				done();
			})
			.catch(done);
		});
		
		it("getWordMap does not calls speechAPI if wordmap exist and contains wordset", 
		function(done) {
			var n_split = 5;
			mockSpeech.split(n_split);

			var mockWord = testUtils.getTestWordMap();
			var mockSet = Object.keys(mockWord);
			var mockSet2 = new Set(mockSet);
			mockSet = new Set(mockSet);
			mockWord = utils.obj2Map(mockWord);

			synthesize.getWordMap(testId, mockSet)
			.then((wordMap) => {
				expect(mockSpeech.count).to.equal(0);
				expect(wordMap).to.be.an.instanceof(Map);
				expect(testUtils.setEq(new Set(wordMap.keys()), mockSet2)).to.equal(true);

				return mockWordDb.getWordMap(testId)
				.then((mapInfo) => {
					expect(mapInfo).to.not.equal(null);
					var storedWordMap = mapInfo.words;
					expect(storedWordMap).to.be.an.instanceof(Map);
					expect(testUtils.mapEq(wordMap, storedWordMap)).to.equal(true);
					
					done();
				});
			})
			.catch(done);
		});
	});
});
