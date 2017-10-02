const express = require('express');
const passport = require('passport');

const router = express.Router();

// Data sources
const audDb = require('../database/audDb');
const userDb = require('../database/userDb');
const vidDb = require('../database/vidDb');
const wordDb = require('../database/wordDb');
const cache = require('../database/redisCache');

// Services
const uas = require('../services/uas');

const converter = require('../services/audioConv');
const synthesize = require('../services/synthesize');

// ===== AUTHENTICATION =====
router.get('/api/users', (req, res) => {
	userDb.getAllUsers()
	.then((users) => {
		users = users.map((usr) => {
			return usr.id_;
		});
		res.json(usrs);
	});
});

router.get('/api/users/:id', (req, res) => {
	var id = req.params.id;
	userDb.getUser(id)
	.then((user) => {
		user = user.username;
		res.json(user);
	})
});

router.post('/api/users', (req, res) => {
	userDb.setUser(req.body)
	.then(() => {
		passport.authenticate('local')(req, res, () => {
			res.json({"status": 'Rigstration successful'});
		});
	})
	.catch((err) => {
		res.status(500).json({ "err": err });
	});
});

router.post('/api/authenticate', (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(401).json({
				"err": info
			});
		}
		req.logIn(user, (err) => {
			if (err) {
				return res.status(500).json({
					"err": 'Could not log in user'
				});
			}
			res.json({
				"name": user.username,
				"id": user._id
			});
		})
	})(req, res, next);
});

// unimplemented
router.put('/api/users/:id', (req, res) => {
	var id = req.params.id;
	userDb.updateUser(id, req.body);
});

// unimplemented
router.delete('/api/users/:id', (req, res) => {
	var id = req.params.id;
	userDb.rmUser(id);
});

// ===== SERVICES =====
function dbCheckStreamExist(vidId, exists, notexist) {
	vidDb.getVidStream(vidId)
	.then((streamInfo) => {
		if (streamInfo === null) {
			notexist();
		}
		else {
			exists(streamInfo);
		}
	});
}

router.get('/api/audio_subtitles/:id', (req, res) => {
	var vidId = req.params.id;
	wordDb.getTranscript(vidId)
	.then((transcriptInfo) => {
		console.log('getting transcript ' + transcriptInfo);
		var status = "none";
		var subtitle = "";
		console.log("TRANSCRIPT INFO ", transcriptInfo);
		if (transcriptInfo) {
			status = "partial";
			if (0 > transcriptInfo.startTime) {
				status = "complete";
			}
			subtitle = transcriptInfo.subtitles
			.map((wordObj) => wordObj.word)
			.join(' ');
		}
		res.json({"status": status, "subtitle": subtitle});
	})
	.catch((err) => {
		console.log(err);
		res.status(500).send(err);
	});
});

router.put('/api/synthesize', (req, res) => {
	var synthId = req.body.synthId;
	const context = "synthId";

	// todo: move this functionality somewhere else
	cache.hasKey(context, synthId)
	.then((existence) => {
		if (1 !== existence) {
			cache.setCacheKey(context, synthId, "set");
			console.log("synthesizing for request " + synthId);
			// synthesis handles params validation
			// params should be of form 
			return synthesize.synthesize(req.body.params)
			.then((result) => {
				var missing = result.missing;
				var synth = result.stream;
				if (synth) {
					// add to vidDb
					// vidDb.setSynthStream(synthId, synth);
					console.log('streaming synth');
					var outStream = ss.createStream();
					ss(socket).emit('synthesized-audio', synthId, outStream);
					synth.pipe(outStream);
					synth.on('end', () => {
						console.log('synthStream complete');
					});
				}
				else {
					console.log('missing synthstream');
				}
				cache.deCache(context, synthId);
				// reply about missing words
				res.json({ "missing": missing || [] });
			});
		}
		else {
			console.log("synthesizing for request " + synthId + " in progress");
		}
	})
	.catch((err) => {
		console.log(err);
		res.status(500).send(err);
	});
});

router.post('/api/audio_subtitles/:id', (req, res) => {
	var vidId = req.params.id;
	var reqId = req.body.reqId;
	const context = "subtitles";
	cache.hasKey(context, reqId)
	.then((existence) => {
		if (1 !== existence) {
			console.log('processing subtitles for vidId ' + vidId);
			synthesize.processSubtitles(vidId)
			.then((transcript) => {
				cache.deCache(context, reqId);
				var status = "none";
				var subtitle = "";
				if (transcript) {
					status = "complete";
					subtitle = transcript
					.map((wordObj) => wordObj.word)
					.join(' ');
				}
				res.json({"status": status, "subtitle": subtitle});
			})
			.catch((err) => {
				console.log(err);
				cache.deCache(context, reqId);
				res.status(500).send(err);
			});
		}
		else {
			console.log("processing subtitles for request " + reqId + " in progress");
		}
	})
	.catch((err) => {
		console.log(err);
		res.status(500).send(err);
	});
});


// ===== GENERAL AUDIO INTERFACES =====
router.get('/api/all_audio', (req, res) => {
	audDb.all()
	.then((infos) => {
		res.json(infos);
	})
	.catch((err) => {
		console.log(err);
		res.status(500).send(err);
	});
});

router.get('/api/uploaded/:limit', (req, res) => {
	var limit = parseInt(req.params.limit);

	console.log(limit); // IMPLEMENT
	res.json({ "ids": [] });
});

router.get('/api/audio/:id', (req, res) => {
	var id = req.params.id;
	audDb.get(id)
	.then((audio) => {
		if (audio) {
			audio.pipe(res);
		}
		else {
			res.status(404).json({ "err": "audio not found" });
		}
	})
	.catch((err) => {
		res.status(500).json({ "err": err });
	});
});

router.get('/api/audio_meta/:id', (req, res) => {
	var id = req.params.id;
	audDb.metadata(id)
	.then((data) => {
		if (data) {
			res.json(data);
		}
		else { 											// todo: look into why this happens
			res.status(404).json({ "err": "metadata for " + id + " not found"});
		}
	})
	.catch((err) => {
		res.status(500).json({ "err": err });
	});
});

router.post('/api/upload_audio', (req, res) => {
	// check update and notify shared members
	console.log('upload audio called'); 				// todo: implement
	res.json({ "id": "ABCDEFG" });
});

router.post('/api/audio_meta/:id', (req, res) => {
	var id = req.params.id;
	var name = req.body.name;
	audDb.updateTitle(id, name)
	.then((success) => {
		if (success) {
			res.status(400).send("success");
		}
		else {
			res.status(404).send("audio not found");
		}
	})
	.catch((err) => {
		res.status(500).send(err);
	});
});

// ===== UAS SERVICES =====
router.get('/api/front_page', (req, res) => { 			// todo: cache front-page to lower traffic to uas
	uas.front_page()
	.then((audio_ids) => {
		// check update and notify shared members

		res.json({ "ids": audio_ids });
	})
	.catch((err) => {
		res.status(500).json({ "err": err });
	});
});

router.post('/api/youtube', (req, res) => {
	var id = req.body.id;
	console.log('searching for ' + id);
	uas.youtube_search(id)
	.then((audio) => {
		// check update and notify shared members

		if (audio) {
			audio.pipe(res);
		}
		else {
			res.status(404).json({ "err": "audio not found" });
		}
	})
	.catch((err) => {
		res.status(500).json({ "err": err });
	});
});

router.post('/api/search', (req, res) => {
	var word = req.body.word;
	uas.audio_search(word)
	.then((audio_ids) => {
		// check update and notify shared members

		res.json({ "ids": audio_ids });
	})
	.catch((err) => {
		res.status(500).json({ "err": err });
	});
});

module.exports = router;
