const request = require('request-promise');
const uasURL = process.env.UAS_URL || 'http://127.0.0.1:3124';

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
    return new Promise((resolve) => {
        request({
            "encoding": 'utf8',
            "method": 'GET',
            "uri": uasURL + '/lasterror',
            "json": true,
            "timeout": 1000
        })
        .then((response) => {
            resolve(response.status);
        })
        .catch((err) => {
            resolve("not connected");
        });
    });
};
