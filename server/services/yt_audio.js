const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

const decoder = require('lame').Decoder
const speaker = require('speaker')

const setting = {
    vidFormat: 'mp4',
    quality: 'lowest',
    audioFormat: 'mp3'
}

module.exports = function(vidId, audioStream) {
    const requestUrl = 'http://www.youtube.com/watch?v=' + vidId;
    var video = ytdl(requestUrl, {filter: (format) => {
        return format.container === setting.vidFormat && format.audioEncoding;
    }, quality: setting.quality});
    var audio = ffmpeg(video);
    var mp3 = audio.format(setting.audioFormat);
    mp3.pipe(audioStream);
};
