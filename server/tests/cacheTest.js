const chai = require('chai');
const uuidv1 = require('uuid/v1');

const cache = require('../cache');

const expect = chai.expect;

describe('Popular Cache', function() {
	it('getPopularToday should return null',
	function(done) {
		cache.getPopularToday()
		.then((res) => {
			expect(res).to.be.null;
			done();
		})
		.catch(done);
	});

	it('setPopularToday should store a value getPopularToday can retrieve', 
	function(done) {
		const sampleId = 'SAMPLE' + uuidv1();
		cache.setPopularToday([sampleId]);
		cache.getPopularToday()
		.then((res) => {
			expect(res.length).to.equal(1);
			expect(res[0]).to.equal(sampleId);
			cache.client.flushdb((err) => {
				if (err) {
					done(err);
				}
				else {
					done();
				}
			});
		})
		.catch(done);
	});
});
