const redis = require('redis');
const bluebird = require('bluebird');

const client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.on("error", (err) => {
    console.log("Error " + err);
});

const milliperday = 24 * 3600 * 1000;

function getToday() {
    // 2 hours before now to force today to start at 1am instead of 0am
    var now = Date.now() - 3600 * 1000;
    return Math.floor(now / milliperday);
}

exports.getPopularToday = () => {
    return client.getAsync(JSON.stringify(getToday()))
    .then((res) => {
        if (res) {
            res = JSON.parse(res);
        }
        return res;
    });
};

exports.setPopularToday = (ids) => {
    var timeout = milliperday - (Date.now() % milliperday); // remaining time today
    timeout += 7200 * 1000; // timeout around 2am
    client.set(JSON.stringify(getToday()), JSON.stringify(ids), 'EX', timeout);
};

exports.client = client;
