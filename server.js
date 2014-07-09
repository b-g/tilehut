var express = require("express"),
  app = express(),
  MBTiles = require('mbtiles'),
  p = require("path"),
  fs = require('fs');

// path to the mbtiles; default is the server.js directory
var tilesDir = __dirname;

app.get('/', function(req, res){
  res.send('hello! mini-mbtiles-server bellow');
});

app.get('/:s/:z/:x/:y.*', function(req, res) {
  var mbtilesfile = p.join(tilesDir, req.param('s') + '.mbtiles');
  if (fs.existsSync(mbtilesfile)) {
    new MBTiles(mbtilesfile, function(err, mbtiles) {
      if (err) return internalError(res, err);   
      mbtiles.getTile(req.param('z'), req.param('x'), req.param('y'), function(err, tile, headers) {
        if (err) {
          var msg = 'tile rendering error -> ' + req.originalUrl + ' ' + err;
          console.error(msg);
          res.status(404).send(msg);
        } else {
          res.set({
            "Content-Type": "image/png",
            // "Cache-Control": "public, max-age=2592000"  // leave this out for no caching - default is 1 month
          });
          res.send(tile);
        }
      });
    });
  } else {
    return internalError(res, "mbtiles file doesn't exist -> "+mbtilesfile);
  }
});

var server = app.listen(3000, function() {
  console.log('Serving HTTP on http://localhost:%d/', server.address().port);
});

function internalError(res, err) {
  if (err) console.error(err);
  res.send(500, 'internal server error');
}