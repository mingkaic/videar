const request = require('request-promise');

const audDb = require('../database/audDb.js');

const uasURL = process.env.UAS_URL || 'http://127.0.0.1:3124';

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

        var yid = response.ids[0];
        // search for yid in shared database
        return audDb.get(yid);
    });
};

exports.audio_search = (keyword) => {
    return request({
        "encoding": 'utf8',
        "method": 'POST',
        "uri": uasURL + '/search/' + link,
        "body": { "source": 'audiosearch' },
        "json": true,
        "timeout": 5000
    })
    .then((response) => {
        var err = response.error;
        if (err) {
            throw err;
        }

        return response.ids;
    });
};

exports.front_page = () => {
    return request({
        "encoding": 'utf8',
        "method": 'POST',
        "uri": uasURL + '/sounds',
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

exports.health = () => {
    return request({
        "encoding": 'utf8',
        "method": 'GET',
        "uri": uasURL + '/health',
        "json": true
    })
    .then((response) => {
        return response.status;
    });
}
