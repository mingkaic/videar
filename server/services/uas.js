const request = require('request-promise');

const uasHost = process.env.UAS_HOST || '127.0.0.1';
const uasPort = process.env.UAS_PORT || 8080;
const uasURL = process.env.UAS_URL || 'http:' + uasHost + ':' + uasPort;

exports.url = uasURL;

exports.front_page = () => {
    return request({
        "encoding": 'utf8',
        "method": 'POST',
        "uri": uasURL + '/popular',
        "json": true
    })
    .then((response) => {
        var err = response.error;
        if (err) {
            throw err;
        }

        return response.ids;
    });
};

exports.youtube_search = (link) => {
    return request({
        "encoding": 'utf8',
        "method": 'POST',
        "uri": uasURL + '/search/' + link, 
        "body": { "source": 'youtube' },
        "json": true
    })
    .then((response) => {
        var err = response.error;
        if (err) {
            throw err;
        }

        return response.ids[0];
    });
};

exports.audio_search = (keyword) => {
    return request({
        "encoding": 'utf8',
        "method": 'POST',
        "uri": uasURL + '/search/' + link,
        "body": { "source": 'audiosearch' },
        "json": true
    })
    .then((response) => {
        var err = response.error;
        if (err) {
            throw err;
        }

        return response.ids;
    });
};

exports.problems = () => {
    return request({
        "encoding": 'utf8',
        "method": 'GET',
        "uri": uasURL + '/lasterror',
        "json": true,
        "timeout": 1000
    })
    .then((response) => {
        return response.status;
    })
    .catch((err) => {
        return "not connected";
    });
};
