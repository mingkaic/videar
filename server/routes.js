const express = require('express');
const passport = require('passport');
const uuidv1 = require('uuid/v1');
const grpc = require('shared_grpc');
const db = require('shared_mongodb_api');

// Local data sources
const userDb = require('./local_db/userDb');
const cache = require('./cache');

const router = express.Router();
const Readable = require('stream').Readable;

const AudioSchema = db.AudioSchema;
const grpcSchemas = grpc.schemas;

const services = [ 's2t', 'uas' ];

// ===== AUTHENTICATION =====
router.get('/api/users', (req, res) => {
	userDb.getAllUsers()
	.then((users) => {
		users = users.map((usr) => {
			return usr.id_;
		});
		res.json(users);
	})
	.catch((err) => {
		res.status(500).send(err);
	});
});

router.get('/api/users/:id', (req, res) => {
	var id = req.params.id;
	userDb.getUser(id)
	.then((user) => {
		user = user.username;
		res.json(user);
	})
	.catch((err) => {
		res.status(500).send(err);
	});
});

router.post('/api/users', (req, res) => {
	userDb.setUser(req.body)
	.then(() => {
		passport.authenticate('local')(req, res, () => {
			res.json({"status": 'Rigstration successful'});
		});
	})
	.catch((err) => {
		res.status(500).send(err);
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
	res.status(405).send("unimplemented put of users");
});

// unimplemented
router.delete('/api/users/:id', (req, res) => {
	var id = req.params.id;
	userDb.rmUser(id);
	res.status(405).send("unimplemented deletion of users");
});

// ===== GENERAL AUDIO INTERFACES =====
router.get('/api/all_audio', (req, res) => {
	db.audio.query({})
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

	db.audio.query({
		"source": { $in: ['synthesized', 'uploaded', '.youtube'] }	
	}, limit)
	.then((infos) => {
		res.json(infos);
	})
	.catch((err) => {
		res.status(500).send(err);
	});
});

router.get('/api/audio/:id', (req, res) => {
	var id = req.params.id;
	db.audio.get(id)
	.then((audio) => {
		if (audio) {
			audio.pipe(res);
		}
		else {
			res.status(404).json({ "err": "audio not found" });
		}
	})
	.catch((err) => {
		res.status(500).send(err);
	});
});

router.post('/api/audio', (req, res) => {
	// check update and notify shared members
	var file = req.files.file;
	var id = uuidv1();

	var reader = new Readable();
	reader.push(file.data);
	reader.push(null);
	var meta = null;
	db.audio.save([new AudioSchema({
		"id": id,
		"source": 'UPLOADED',
		"title": file.name,
		"audio": reader
	})], (audiometa) => {
		meta = audiometa;
	}, () => {
		res.json(meta);
	});
});

router.get('/api/audio_meta/:id', (req, res) => {
	var id = req.params.id;
	db.audio.query({ "id": id })
	.then((info) => {
		if (info.length > 0) {
			res.json(info[0]);
		}
		else {											// todo: look into why this happens
			res.status(404).json({
				"err": "metadata for " + id + " not found"
			});
		}
	})
	.catch((err) => {
		res.status(500).send(err);
	});
});

router.post('/api/audio_meta/:id', (req, res) => {
	var id = req.params.id;
	var name = req.body.name;
	db.audio.updateTitle(id, name)
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

router.get('/api/health', (req, res) => {
	Promise.all(services.map((servname) => {
		var cli = grpc[servname + '_cli'];
		return cli.reachable()
		.then((status) => {
			if (status !== 'SERVING') {
				return cli.lastError()
				.then((err) => {
					return {
						"name": servname,
						"ok": false,
						"error": err.msg
					};
				});
			}
			return { "name": servname, "ok": true, "error": null };
		})
		.catch((err) => {
			return { "name": servname, "ok": false, "error": err };
		});
	}))
	.then((statuses) => {
		var msg = {};
		statuses.forEach((status) => {
			msg[status.name] = status;
		});
		res.json(msg);
	})
	.catch((err) => {
		console.log(err);
		res.status(500).send(err);
	});
});

// ===== CAPTION OPERATIONS =====
router.get('/api/audio_subtitles/:id', (req, res) => {
	var id = req.params.id;
	var request = new grpcSchemas.AudioRequest({ "id": id });
	grpc.uas_cli.getCaption(request)
	.then((captions) => {
		if (captions.length === 0) {
			return grpc.s2t_cli.processCaptions(request);
		}
		return captions;
	})
	.then((captions) => {
		captions.forEach((captionSegment) => {
			captionSegment.id = id;	
		});
		res.json(captions);
	})
	.catch((err) => {
		console.log(err);
		res.status(500).send(err);
	});
});

router.post('/api/synthesis', (req, res) => {
	var script = req.body.script.map((mixedCaption) => 
		new grpcSchemas.MixedCaptionRequest(mixedCaption));
	grpc.s2t_cli.processAudioSynthesis(script)
	.then((audiometa) => {
		res.json(audiometa);
	})
	.catch((err) => {
		console.log(err);
		res.status(500).send(err);
	});
});

// ===== AUDIO OPERATIONS =====
router.get('/api/front_page', (req, res) => {
	cache.getPopularToday()
	.then((existing_ids) => {
		if (!existing_ids) {
			return grpc.uas_cli.getPopular();
		}
		return db.audio.query({ "id": { $in: existing_ids } });
	})
	.then((audiometas) => {
		res.json(audiometas);
	})
	.catch((err) => {
		res.status(500).send(err);
	});
});

router.post('/api/youtube', (req, res) => {
	var id = req.body.id;
	var searchParam = new grpcSchemas.SearchParams({
		"query": id,
		"response_limit": 1,
		"source": 'YOUTUBE'
	});

	grpc.uas_cli.search(searchParam)
	.then((audiometas) => {
		if (audiometas.length < 1) {
			res.status(404).json({ "err": "audio not found" });
		}
		var id = audiometas[0].id;
		return db.audio.get(id);
	})
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
		res.status(500).send(err);
	});
});

router.post('/api/search', (req, res) => {
	var word = req.body.word;

	var searchParam = new grpcSchemas.SearchParams({
		"query": word,
		"response_limit": 100,
		"source": 'AUDIOSEARCH'
	});

	grpc.uas_cli.search(searchParam)
	.then((audiometas) => {
		// check update and notify shared members

		res.json(audiometas)
	})
	.catch((err) => {
		res.status(500).send(err);
	});
});

module.exports = router;
