const chai = require('chai');
const fs = require('fs');

const utils = require('../../server/utils');
const synthesize = require('../../server/services/synthesize');
const mockVidDb = require('../mocks/mockVidDb');
const mockWordDb = require('../mocks/mockWordDb');
const mockSpeech = require('../mocks/mockSpeechApi');
const testUtils = require('../testUtils');

var mockobj = JSON.parse(fs.readFileSync(__dirname + '/../data/mockSynthData.json', 'utf8'));

var expect = chai.expect; // we are using the "expect" style of Chai

const testId = "TEST0:_fGx6K90TmCI";
const testId2 = "TEST1:_uRUmYqPQ5EU";
const testSrc = "test";
const testDur = 900000; // 900 seconds = 15 minutes (test audios should never be longer than 10 minutes)

describe('Synthesis:', function() {
	this.timeout(5000); // using real stream from mockVidDb (getting metadata could take a while)

	before(function() {
		// we need a mock audio in fake db
		mockVidDb.setVidStream(testId, testSrc, null);

		mockVidDb.setVidStream(testId2, testSrc, null);
	});

	describe('When WordDb is Empty:', function() {
		beforeEach(function() {
			mockSpeech.count = 0;
			mockWordDb.clearDb();
		});
	
		it("lazyPartition should stop calling s2t API once transcript uses every wordset", 
		function(done) {
			var n_split = 1;
			mockSpeech.split(n_split);
	
			var mockTranscript = testUtils.getTestTranscript();
			var mockSet = new Set(mockTranscript.map(wordInfo => wordInfo.word));
	
			synthesize.lazyPartition(testId, 0, mockSet)
			.then((subtitleInfo) => {
				var subtitles = subtitleInfo[0];
				var completion = subtitleInfo[1];
	
				expect(completion).to.equal(10); // chunk duration
				expect(mockSpeech.count).to.equal(n_split);

				expect(subtitles).to.be.an.instanceof(Array);
				expect(testUtils.objEq(subtitles, mockTranscript)).to.equal(true);
	
				done();
			})
			.catch(done);
		});
	
		// the audio partition operation is mocked, but it does not handle validating duration
		// IF partition validates duration, then RETHINK this test
		it("lazyPartition should never call s2t API if the start time is longer than the duration of the audio", 
		function(done) {
			var mockTranscript = testUtils.getTestTranscript();
			var mockSet = new Set(mockTranscript.map(wordInfo => wordInfo.word));
	
			synthesize.lazyPartition(testId, testDur, mockSet)
			.then((subtitleInfo) => {
				var subtitles = subtitleInfo[0];
				var completion = subtitleInfo[1];
	
				expect(completion).to.equal(-1); // completion flag
				expect(mockSpeech.count).to.equal(0);
				
				expect(subtitles).to.be.an.instanceof(Array);
				expect(subtitles.length).to.equal(0);
				
				done();
			})
			.catch(done);
		});
	
		it("fulfill should not call s2t API if transcript has wordset", 
		function(done) {
			var mockTranscript = testUtils.getTestTranscript();
			var mockSet = new Set(mockTranscript.map(wordInfo => wordInfo.word));
	
			synthesize.fulfill(testId, 0, mockSet, mockTranscript)
			.then((subtitleInfo) => {
				var subtitles = subtitleInfo[0];
				var completion = subtitleInfo[1];
	
				expect(completion).to.equal(0);
				expect(mockSpeech.count).to.equal(0);
				
				expect(subtitles).to.be.an.instanceof(Array);
				expect(testUtils.objEq(subtitles, mockTranscript)).to.equal(true);
				
				done();
			})
			.catch(done);
		});
		
		it("fulfill should call s2t API if transcript does not contain every word in wordset", 
		function(done) {
			var n_split = 3;
			mockSpeech.split(n_split);

			var mockTranscript = testUtils.getTestTranscript();
			var mockSet = new Set(mockTranscript.map(wordInfo => wordInfo.word));

			// take words from the first 1/n_split of the full transcript
			var mockIncompleteTranscript = [];
			for (var i = 0; i < mockTranscript.length / n_split; ++i) {
				mockIncompleteTranscript.push(mockTranscript[i]);
			}
			mockSpeech.count = 1; // artifically advance counter
	
			synthesize.fulfill(testId, 0, mockSet, mockIncompleteTranscript)
			.then((subtitleInfo) => {
				var subtitles = subtitleInfo[0];
				var completion = subtitleInfo[1];
	
				expect(completion).to.equal((n_split - 1) * 10);
				expect(mockSpeech.count).to.equal(n_split);

				expect(subtitles).to.be.an.instanceof(Array);
				expect(testUtils.objEq(subtitles, mockTranscript)).to.equal(true);
				
				done();
			})
			.catch(done);
		});
	
		it("getWordMap calls speechAPI if wordmap does not exist", 
		function(done) {
			var n_split = 3;
			mockSpeech.split(n_split);

			var transcript = testUtils.getTestTranscript();
			var mockWord = testUtils.getTestWordMap();
			var mockSet = new Set(mockWord.keys());
			var mockSet2 = new Set(mockSet);

			synthesize.getWordMap(testId, mockSet)
			.then((wordMap) => {
				expect(mockSpeech.count).to.equal(n_split);
				expect(wordMap).to.be.an.instanceof(Map);
				expect(testUtils.setEq(new Set(wordMap.keys()), mockSet2)).to.equal(true);

				return mockWordDb.getTranscript(testId);
			})
			.then((mapInfo) => {
				expect(mapInfo).to.not.equal(null);
				var storeTranscript = mapInfo.subtitles;

				expect(storeTranscript).to.be.an.instanceof(Array);
				expect(testUtils.objEq(transcript, storeTranscript)).to.equal(true);
				
				done();
			})
			.catch(done);
		});
		
		it("getScriptMap calls speechAPI if wordmap does not exist and timeframe has id property for first Id only", 
		function(done) {
			var n_split = 3;
			mockSpeech.split(n_split);
			
			var transcript = testUtils.getTestTranscript();
			var mockWord = testUtils.getTestWordMap();
			var mockSet = new Set(mockWord.keys());
			var mockSet2 = new Set(mockSet);
	
			vidIds = [testId, testId2];

			synthesize.getScriptMap(vidIds, mockSet)
			.then((wordMap) => {
				expect(mockSpeech.count).to.equal(n_split);
				expect(wordMap).to.be.an.instanceof(Map);
				expect(testUtils.setEq(new Set(wordMap.keys()), mockSet2)).to.equal(true);
				for (var key of wordMap.keys()) {
					var arr = wordMap.get(key);
					expect(arr.every((obj) => { return obj.id === testId; })).to.equal(true);
				}

				return mockWordDb.getTranscript(testId2);
			})
			.then((mapInfo) => {
				expect(mapInfo).to.equal(null);
				
				done();
			})
			.catch(done);
		});
	});
	
	describe('When WordDb Has Existing Incomplete Wordmap:', function() {
		var n_split = 5;

		beforeEach(function(done) {
			var mockTranscript = testUtils.getTestTranscript();

			// take words from the first 1/n_split of the full transcript
			var incompleteTranscript = [];
			for (var i = 0; i < mockTranscript.length / n_split; ++i) {
				incompleteTranscript.push(mockTranscript[i]);
			}

			// add incomplete wordmap
			mockWordDb.clearDb();
			mockWordDb.setTranscript(testId, 5, incompleteTranscript)
			.then((wordMapInfo) => {
				done();
			})
			.catch(done);

			mockSpeech.split(n_split);
			mockSpeech.count = 1;
		});
		
		it("getWordMap calls speechAPI if wordmap exist but doesn't contains wordset", 
		function(done) {
			var transcript = testUtils.getTestTranscript();
			var mockWord = testUtils.getTestWordMap();
			var mockSet = new Set(mockWord.keys());
			var mockSet2 = new Set(mockSet);

			synthesize.getWordMap(testId, mockSet)
			.then((wordMap) => {
				expect(mockSpeech.count).to.equal(n_split);
				expect(wordMap).to.be.an.instanceof(Map);
				expect(testUtils.setEq(new Set(wordMap.keys()), mockSet2)).to.equal(true);

				return mockWordDb.getTranscript(testId);
			})
			.then((mapInfo) => {
				expect(mapInfo).to.not.equal(null);
				var storedTranscript = mapInfo.subtitles;
				expect(storedTranscript).to.be.an.instanceof(Array);
				expect(testUtils.objEq(transcript, storedTranscript)).to.equal(true);
				
				done();
			})
			.catch(done);
		});
	});
	
	describe('When WordDb Has Existing Complete Wordmap:', function() {
		beforeEach(function(done) {
			mockSpeech.count = 0;
			var mockTranscript = testUtils.getTestTranscript();
			
			// add complete wordmap
			mockWordDb.clearDb();
			mockWordDb.setTranscript(testId, -1, mockTranscript)
			.then((wordMapInfo) => {
				done();
			})
			.catch(done);
		});
		
		it("getWordMap does not calls speechAPI if wordmap exist and contains wordset", 
		function(done) {
			var n_split = 5;
			mockSpeech.split(n_split);
			
			var transcript = testUtils.getTestTranscript();
			var mockWord = testUtils.getTestWordMap();
			var mockSet = new Set(mockWord.keys());
			var mockSet2 = new Set(mockSet);

			synthesize.getWordMap(testId, mockSet)
			.then((wordMap) => {
				expect(mockSpeech.count).to.equal(0);
				expect(wordMap).to.be.an.instanceof(Map);
				expect(testUtils.setEq(new Set(wordMap.keys()), mockSet2)).to.equal(true);

				return mockWordDb.getTranscript(testId);
			})
			.then((transcriptInfo) => {
				expect(transcriptInfo).to.not.equal(null);
				var storedTranscript = transcriptInfo.subtitles;
				expect(storedTranscript).to.be.an.instanceof(Array);
				expect(testUtils.objEq(transcript, storedTranscript)).to.equal(true);
				
				done();
			})
			.catch(done);
		});
		
		it("getScriptMap obtains injected key from second id if existing wordmap of the first id is complete", 
		function(done) {
			var n_split = 3;
			mockSpeech.split(n_split);
			var injectedValue = { "word": "UNREACHABLE", "time": {"start": 21.1, "end": 1112.1} };
			
			var transcript = testUtils.getTestTranscript();
			var mockWord = testUtils.getTestWordMap();
			var mockSet = new Set(mockWord.keys());
			var mockSet2 = new Set(mockSet);
	
			vidIds = [testId, testId2];
			mockSpeech.splitInject(injectedValue);
			synthesize.getScriptMap(vidIds, mockSet)
			.then((wordMap) => {
				expect(mockSpeech.count).to.equal(0);
				expect(wordMap).to.be.an.instanceof(Map);
				expect(testUtils.setEq(new Set(wordMap.keys()), mockSet2)).to.equal(true);
				for (var key of wordMap.keys()) {
					var arr = wordMap.get(key);
					expect(arr.every((obj) => { return obj.id === testId; })).to.equal(true);
				}

				done();
			})
			.catch(done);
		});
	});
});
