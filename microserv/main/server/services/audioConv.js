const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const stream = require('stream');
const buffer = require("stream-buffer");
const streamconcat = require('stream-concat'); // unsaved

const ytSetting = {
	vidFormat: 'mp4',
	quality: 'lowest',
	audioFormat: 'mp3'
};

const temporary = __dirname + "/temporary.mp3";
const offset = 0.5;

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

// untested
exports.format = (audioStream, format) => {
	return ffmpeg(audioStream).format(format);
};

exports.partition = (audioBuffer, start, duration) => {
	return ffmpeg(audioBuffer)
	.seekInput(start-offset)
	.format('wav')
	.duration(duration+offset)
	.on('error', (err) => {
		console.log(err);
	});
};

// untested
exports.chunkByTime = (audioStream, times) => {
	if (!(times instanceof Array)) {
		times = [times];
	}
	var buffed = audioStream.pipe(buffer());

	times.forEach((time) => {
		var startSec = time.start / 1000;
		var durSec = (time.end - time.start) / 1000;

		var chunkStrIn = new stream.PassThrough();
		var chunkStrOut = new stream.PassThrough();
		buffed.replay(chunkStrIn);
		chunkStrIn.resume();
		ffmpeg(chunkStrIn).seekInput(startSec-offset).format('mp3').duration(durSec).pipe(chunkStrOut);
		chunkStrOut.resume();

		time['audio'] = chunkStrOut;
	});
};

exports.concat = (chunks) => {
	return new streamconcat(chunks);
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
};
