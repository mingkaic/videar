const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

const setting = {
	vidFormat: 'mp4',
	quality: 'lowest',
	audioFormat: 'mp3'
}

module.exports = (vidId) => {
	const requestUrl = 'http://www.youtube.com/watch?v=' + vidId;
	var video = ytdl(requestUrl, {filter: (format) => {
		return format.container === setting.vidFormat && format.audioEncoding;
	}, quality: setting.quality});
	var audio = ffmpeg(video);
	return audio.format(setting.audioFormat);
};
