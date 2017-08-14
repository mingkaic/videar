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

// Parse POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || default_port;
app.set('port', port);

app.get('/vid_wordmap', (req, res) => {
	word_map = { "intro": 'hello friendo' };
	vidIds = JSON.parse(req.body.vidIds);
	console.log('we get ids: ' + vidIds);

	// search db for videos

	// process audio speech 2 text + timestamp

	res.json(word_map);
});

server.listen(port, default_host, () => {
	console.log(`s2t API running on localhost:${port}`)
});
