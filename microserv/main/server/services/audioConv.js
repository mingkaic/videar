const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

const ytSetting = {
	vidFormat: 'mp4',
	quality: 'lowest',
	audioFormat: 'wav'
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

exports.convert = (audioStream) => {
    return ffmpeg(audioStream)
    .format('wav')
    .on('error', (err) => {
        console.log(err);
    });
}
