const request = require('request-promise');
const s2tURL = process.env.S2T_URL || 'http://127.0.0.1:8008';

exports.subtitles = (id) => {
    return request({
        "encoding": 'utf8',
        "method": 'GET',
        "uri": s2tURL + '/subtitles/' + id,
        "json": true
    })
    .then((response) => {

    });
};

exports.health = () => {
    return new Promise((resolve) => {
        request({
            "encoding": 'utf8',
            "method": 'GET',
            "uri": s2tURL + '/health',
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
