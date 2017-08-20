const chai = require('chai');
const mm = require('musicmetadata');

const testUtils = require('../testUtils');
var audioConv = require('../../server/services/audioConv');

var expect = chai.expect; // we are using the "expect" style of Chai
const testId = "uRUmYqPQ5EU";
const testDur = 10;

describe('Audio Conversion: ', function() {
	it('ytExtract retreives a stream', function() {
		var ytStream = testUtils.isStream(audioConv.ytExtract(testId));
		expect(ytStream).to.equal(true);
	});

	it('partition creates a stream of duration specified', function(done) {
		var ws = testUtils.getTestWordStream();
		var partition = audioConv.partition(ws, 0, testDur);
        expect(testUtils.isStream(partition)).to.equal(true);

        testUtils.getDuration(partition.format('mp3'), (duration) => {
            expect(Math.round(duration)).to.equal(testDur);
            done();
        });
	});
});
