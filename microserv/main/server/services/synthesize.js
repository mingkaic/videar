const request = require('request-promise');

const s2tHost = process.env.SPEECH_HOST || '127.0.0.1';
const s2tPort = process.env.SPEECH_PORT || '8000';

const speechURL = 'http://' + s2tHost + ':' + s2tPort;

module.exports = function (synParam) {
    // params must be of form: { "script" : "...", "vidIds" : ["vid1", "vid2", ...] }
	script = synParam.script;
    vidIds = synParam.vidIds;
    if (typeof(script) !== "string" || typeof(vidIds) != "object") {
        throw "bad synthesis parameter: " + synParam;
    }

    // check which ids have maps on db
    // var wordmapPromise;

    return request({ 
        "url": speechURL + '/vid_wordmap', 
        "form": { "vidIds": JSON.stringify(vidIds) }, 
        "json": true
    })
    .then((response) => {
        console.log('result from wordmap: ' + JSON.stringify(response)).vidIds;
        return;
    })
    .catch(function (err) {
        // handle: if we can't reach speech to text announce s2t container is down
        console.log(err);
    });
};
