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

app.get('/', function(req, res){
  res.send('hello! tilehut bellow');
});

app.get('/:s/:z/:x/:y.*', function(req, res) {
  var mbtilesfile = path.join(TILES_DIR, req.param('s') + '.mbtiles');
  fs.exists(mbtilesfile, function (exists) {
    if (!exists) {
      console.error("mbtiles file doesn't exist -> path: "+mbtilesfile);
      return res.sendStatus(404);
    }
    new MBTiles(mbtilesfile, function(err, mbtiles) {
      if (err) {
        console.error("cannot initialize MBTiles object -> "+err);
        return res.sendStatus(500);
      }
      mbtiles.getTile(req.param('z'), req.param('x'), req.param('y'), function(err, tile, headers) {
        if (err) {
          console.error('tile rendering error -> url: ' + req.originalUrl + ', error: ' + err);
          return res.sendStatus(404);
        }
        res.set(headers);
        res.send(tile);
      });
    });
  });
});

var server = require('http').createServer(app);
server.listen(PORT, IPADDRESS, function() {
  var url = "http://" + server.address().address +":"+ server.address().port;
  console.log('Serving HTTP on ', url);
});
