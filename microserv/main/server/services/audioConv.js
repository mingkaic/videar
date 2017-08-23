const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const stream = require('stream');
const buffer = require("stream-buffer");

const ytSetting = {
	vidFormat: 'mp4',
	quality: 'lowest',
	audioFormat: 'mp3'
}

const temporary = __dirname + "/temporary.mp3";

exports.ytExtract = (vidId) => {
	const requestUrl = 'http://www.youtube.com/watch?v=' + vidId;
	var video = ytdl(requestUrl, {filter: (format) => {
		return format.container === ytSetting.vidFormat && format.audioEncoding;
	}, quality: ytSetting.quality});
	return ffmpeg(video)
	.format(ytSetting.audioFormat)
	.on('error', (err) => {
        console.log(err);
	});
};

exports.format = (audioStream, format) => {
	return ffmpeg(audioStream).format(format);
}

exports.partition = (audioBuffer, start, duration) => {
	return ffmpeg(audioBuffer)
	.seekInput(start-0.5)
	.format('wav')
	.duration(duration+0.5)
	.on('error', (err) => {
		console.log(err);
	});
};

// todo: improve to prevent actually reading to file before duration
exports.getDuration = (audioStream) => {
	var buffed = audioStream.pipe(buffer());
	buffed.getStream = () => {
		var pass = new stream.PassThrough();
		buffed.replay(pass);
		pass.resume();
		return pass;
	}
	var ws = fs.createWriteStream(temporary);
	ffmpeg(buffed.getStream())
	.format('mp3')
	.pipe(ws)
	.on('error', (err) => {
		console.log(err);
	});

	return new Promise((resolve, reject) => {
		console.log('promising to get duration');
		ws.on('finish', () => {
			console.log('evaluating mp3 duration');
			ffmpeg.ffprobe(temporary, (err, metadata) => {
				var duration = metadata.format.duration;
				if (err) {
					reject(err);
				}
				else {
					resolve([duration, buffed]);
				}
			});
		})
		.on('error', (err) => {
			reject(err);
		});
	});
}
