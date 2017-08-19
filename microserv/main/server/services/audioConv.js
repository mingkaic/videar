const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

const ytSetting = {
	vidFormat: 'mp4',
	quality: 'lowest',
	audioFormat: 'mp3'
}

exports.ytExtract = (vidId) => {
	const requestUrl = 'http://www.youtube.com/watch?v=' + vidId;
	var video = ytdl(requestUrl, {filter: (format) => {
		return format.container === ytSetting.vidFormat && format.audioEncoding;
	}, quality: ytSetting.quality});
	return ffmpeg(video).format(ytSetting.audioFormat)
	.on('error', (err) => {
        console.log(err);
	});
};

exports.partition = (audioBuffer, start, duration) => {
	return ffmpeg(audioBuffer)
	.seekInput(start-0.5)
	.format('wav')
	.duration(duration+0.5)
	.on('error', (err) => {
		console.log(err);
	});
};
