const chai = require('chai');
const fs = require('fs');

const synthesize = require('../../server/services/synthesize');

var mockobj = JSON.parse(fs.readFileSync(__dirname + '/../data/mockSynthData.json', 'utf8'));

var expect = chai.expect; // we are using the "expect" style of Chai

describe('Synthesis and its subroutines:', function() {
	it("lazyPartition should stop calling s2t API once every word in word set is in the word map", 
	function() {

	});

	it("lazyPartition should never calls s2t API if the start time is longer than the duration of the audio", 
	function() {

	});

	it("fulfill should not call s2t API if every word in word set is in existing word map", 
	function() {

	});
	
	it("fulfill should call s2t API if word in word set is yet in existing word map", 
	function() {

	});
});
