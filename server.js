var express = require("express")
	, app = express()
	, MBTiles = require('mbtiles')
	, path = require("path")
	, fs = require('fs')
	;

var PORT = process.env.OPENSHIFT_NODEJS_PORT  || 8000
	, IPADDRESS = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'
	, TILES_DIR = process.env.OPENSHIFT_DATA_DIR || path.join(__dirname, 'data')
	;

app.use('*', function(req, res, next) {
	next();
	// set CORS response header AFTER the get functions ...
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
});

app.use('/:ts/map', express.static(path.join(__dirname, '/static/map')));

app.get('/ping', function(req, res){
	res.send('tilehut says pong!');
});

app.get('/:ts/:z/:x/:y.*grid.json$', function(req, res) {
	initMBTiles(req, res, function(mbtiles) {
		mbtiles.getGrid(req.param('z'), req.param('x'), req.param('y'), function(err, tile, headers) {
			if (err) handleError(err, req, res, 404, "tile utf8 grid error");
			res.set(headers);
			res.send(tile);
		});
	});
});

app.get('/:ts/:z/:x/:y.*', function(req, res) {
	initMBTiles(req, res, function(mbtiles) {
		mbtiles.getTile(req.param('z'), req.param('x'), req.param('y'), function(err, tile, headers) {
			if (err) handleError(err, req, res, 404, "tile rendering error");
			res.set(headers);
			res.send(tile);
		});
	});
});


app.get('/:ts/meta.json', function(req, res) {
	initMBTiles(req, res, function(mbtiles) {
		mbtiles.getInfo(function(err, info) {
			if (err) handleError(err, req, res, 404, "cannot get metadata");
			res.send(info);
		});
	});
});


var initMBTiles = function(req, res, cb) {
	var mbtilesfile = path.join(TILES_DIR, req.param('ts') + '.mbtiles');
	fs.exists(mbtilesfile, function (exists) {
		if (!exists) return handleError(null, req, res, 404, "cannot find MBTiles file on server: "+mbtilesfile);
		new MBTiles(mbtilesfile, function(err, mbtiles) {
			if (err) return handleError(err, req, res, 500, "cannot initialize MBTiles object");
			cb(mbtiles);
		});
	});
};

var handleError = function(err, req, res, statusCode, msg) {
	console.error('%s %s %s', req.url, msg, err || '');
	return res.sendStatus(statusCode);
};

app.listen(PORT, IPADDRESS, function() {
	console.log('Tilehut on http://%s:%s', IPADDRESS, PORT);
});
