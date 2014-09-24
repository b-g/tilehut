var express = require("express")
  , app = express()
  , MBTiles = require('mbtiles')
  , path = require("path")
  , fs = require('fs')
  ;

var PORT = process.env.OPENSHIFT_INTERNAL_PORT || process.env.OPENSHIFT_NODEJS_PORT  || 3000
  , IPADDRESS = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'
  , TILES_DIR = process.env.OPENSHIFT_DATA_DIR || __dirname
  ;

var mbtilesfile = null;

app.get('/', function(req, res){
  res.send('hello! tilehut bellow');
});

// middleware to check whether mbtilesfile exists
app.use('/:s', function(req, res, next) {
  mbtilesfile = path.join(TILES_DIR, req.param('s') + '.mbtiles');
  fs.exists(mbtilesfile, function (exists) {
    if (!exists) {
      return internalError(null, req, res, 404, "cannot initialize MBTiles object");
    }
    next();
  });
});

app.get('/:s/:z/:x/:y.*', function(req, res) {
  new MBTiles(mbtilesfile, function(err, mbtiles) {
    if (err) { internalError(err, req, res, 500, "cannot initialize MBTiles object") };
    mbtiles.getTile(req.param('z'), req.param('x'), req.param('y'), function(err, tile, headers) {
      if (err) { internalError(err, req, res, 404, "tile rendering error") };
      res.set(headers);
      res.send(tile);
    });
  });
});

app.get('/:s/metadata.json', function(req, res) {
  new MBTiles(mbtilesfile, function(err, mbtiles) {
    if (err) { internalError(err, req, res, 500, "cannot initialize MBTiles object") };
    mbtiles.getInfo(function(err, info) {
      if (err) { internalError(err, req, res, 404, "cannot get metadata") };
      res.send(info);
    });
  });
});

var server = require('http').createServer(app);
server.listen(PORT, IPADDRESS, function() {
  console.log('Tilehut on http://%s:%s', server.address().address, server.address().port);
});

function internalError(err, req, res, statusNum, errorMsg) {
  console.error('%s %s %s', req.url, errorMsg, err);
  return res.sendStatus(statusNum);
};
