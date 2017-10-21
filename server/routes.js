const express = require('express');
const passport = require('passport');
const uuidv1 = require('uuid/v1');
const Readable = require('stream').Readable;
const service = require('node-health-service').Service;

const router = express.Router();

// Data sources
const AudioSchema = require('./data/database/_schemas/audio_schema');
const sharedDb = require('./data/database');
const userDb = require('./data/local_db/userDb');
const cache = require('./data/cache');

// Services
const uas = require('./services/uas');
const s2t = require('./services/s2t');
console.log('looking for uas at', uas.url);
console.log('looking for s2t at', s2t.url);

var service_config = {
	"uas": {
		"probe": "ping",
		"url": uas.url + '/reachable'
	},
	"s2t": {
		"probe": "ping",
		"url": s2t.url + '/reachable'
	}
};

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
	sharedDb.audioQuery({})
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

	sharedDb.audioQuery({
		"source": { $in: ['synthesized', 'uploaded', '.youtube'] }	
	}, limit)
	.then((infos) => {
		res.json({ "ids": infos.map((datum) => datum.id) });
	})
	.catch((err) => {
		res.status(500).send(err);
	});
});

router.get('/api/audio/:id', (req, res) => {
	var id = req.params.id;
	sharedDb.getAudio(id)
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
	sharedDb.audioQuery({ "id": id })
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
		res.status(500).json({ "err": err });
	});
});

router.get('/api/health', service.route(service_config));

router.post('/api/upload_audio', (req, res) => {
	// check update and notify shared members
	var file = req.files.file;
	var id = uuidv1();

	var reader = new Readable();
	reader.push(file.data);
	reader.push(null);
	sharedDb.audioSave([new AudioSchema({
		"id": id,
		"source": "uploaded",
		"title": file.name,
		"audio": reader
	})])
	.then((ids) => {
		// assert ids.length > 0
		res.json({ "id": ids[0] });
	})
	.catch((err) => {
		res.status(500).send(err);
	});
});

router.post('/api/audio_meta/:id', (req, res) => {
	var id = req.params.id;
	var name = req.body.name;
	sharedDb.updateTitle(id, name)
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

// ===== S2T SERVICES =====
router.get('/api/audio_subtitles/:id', (req, res) => {
	var id = req.params.id;
	s2t.subtitles(id)
	.then((transcript) => {
		res.json(transcript);
	})
	.catch((err) => {
		console.log(err);
		res.status(500).send(err);
	});
});

router.post('/api/synthesis', (req, res) => {
	var script = req.body.script;
	s2t.synthesize(script)
	.then((meta) => {
		res.json(meta);
	})
	.catch((err) => {
		console.log(err);
		res.status(500).send(err);
	});
});

// ===== UAS SERVICES =====
router.get('/api/front_page', (req, res) => {
	cache.getPopularToday()
	.then((existing_ids) => {
		if (!existing_ids) {
			return uas.front_page()
			.then((uas_ids) => {
				cache.setPopularToday(uas_ids);
				return uas_ids;
			});
		}
		return existing_ids;
	})
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
	uas.youtube_search(id)
	.then((yid) => {
        // search for yid in shared database
        return sharedDb.getAudio(yid);
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
