const redis = require('redis');
const uuidv1 = require('uuid/v1');

const cacheHost = process.env.CACHE_HOST || '127.0.0.1';
const cacheUrl = 'redis://' + cacheHost + ':6379';

console.log('connecting to ' + cacheUrl);
var client = redis.createClient(cacheUrl);

client.on('connect', () => {
    console.log("connected");
});

// make more complex later
function contextualize(context, id) {
    return "<|" + context + ">_" + id;
}

function promisify(cb) {
    return new Promise((resolve, reject) => {
        cb((err, obj) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(obj);
            }
        });
    })
}

exports.setCache = (context, value) => {
    var cacheId = uuidv1();
    return exports.encacheKey(context, cacheId, value)
    .then(() => {
        return cacheId;
    });
};

exports.setCacheKey = (context, id, value) => {
    return promisify((cb) => client.set(contextualize(context, id), value, cb));
};

exports.hasKey = (context, id) => {
    return promisify((cb) => client.exists(contextualize(context, id), cb));
};

exports.getCache = (context, id) => {
    return promisify((cb) => client.get(contextualize(context, id), cb));
};

exports.deCache = (context, id) => {
    return promisify((cb) => client.del(contextualize(context, id), cb));
};
