// Deps
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');

const default_port = '8000';
const default_host = '0.0.0.0';
const hostServer = process.env.SERV_HOST || '127.0.0.1';
const hostPort = process.env.SERV_PORT || '8080';

// Create HTTP server.
const app = express();
const server = http.createServer(app);

const db = require('./db/central_mongo.js');

// Parse POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || default_port;
app.set('port', port);

app.get('/vid_wordmap/:cacheIds', (req, res) => {
	var word_map = { "intro": 'hello friendo' };
	var cacheIds = req.params.cacheIds;
	var stream = db.getCache(cacheIds);
	if (stream) {
		// process audio speech 2 text + timestamp
		console.log('existing stream! ' + cacheIds);
	}
	else {
		// process error...
		console.log('non-existent stream! ' + cacheIds);
	}

	res.json(word_map);
});

server.listen(port, default_host, () => {
	console.log(`s2t API running on localhost:${port}`)
});
