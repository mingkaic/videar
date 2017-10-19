const redis = require('redis');
const bluebird = require('bluebird');

const client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.on("error", (err) => {
    console.log("Error " + err);
});

const milliperday = 24 * 3600 * 1000

exports.getPopularToday = () => {
	var today = Math.floor(Date.now() / milliperday);
    return client.getAsync(JSON.stringify(today))
    .then((res) => {
        if (res) {
            res = JSON.parse(res);
        }
        return res;
    });
};

exports.setPopularToday = (ids) => {
	var today = Math.floor(Date.now() / milliperday);
	var timeout = milliperday - (Date.now() % milliperday); // remaining time today
    client.set(JSON.stringify(today), JSON.stringify(ids), 'EX', timeout);
};

exports.client = client;
