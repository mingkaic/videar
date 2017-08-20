const chai = require('chai');
const mm = require('musicmetadata');

const testUtil = require('../testUtils');
var audioConv = require('../../server/services/audioConv');

var expect = chai.expect; // we are using the "expect" style of Chai
const testId = "uRUmYqPQ5EU";
const testDur = 10;

describe('Audio Conversion: ', function() {
	it('ytExtract retreives a stream', function() {
		var ytStream = testUtil.isStream(audioConv.ytExtract(testId));
		expect(ytStream).to.equal(true);
	});

	it('partition creates a stream of duration specified', function(done) {
		var ws = testUtil.getTestWordStream();
		var partition = audioConv.partition(ws, 0, testDur);
		expect(testUtil.isStream(partition)).to.equal(true);

		mm(partition, { duration: true}, (err, metadata) => {
			expect(metadata.duration).to.equal(testDur);
			done();
		});
	});
});
