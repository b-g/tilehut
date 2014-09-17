var PORT = process.env.OPENSHIFT_INTERNAL_PORT || process.env.OPENSHIFT_NODEJS_PORT  || 3000;
var IPADDRESS = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var express = require("express")
  , app = express()
  , MBTiles = require('mbtiles')
  , path = require("path")
  , fs = require('fs')
  ;

var tilesDir = process.env.OPENSHIFT_DATA_DIR || __dirname;

app.get('/', function(req, res){
  res.send('hello! tilehut bellow');
});

app.get('/:s/:z/:x/:y.*', function(req, res) {
  var mbtilesfile = path.join(tilesDir, req.param('s') + '.mbtiles');
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
            // leave this out for no caching - default is 1 month
            "Cache-Control": "public, max-age=2592000"
          });
          res.send(tile);
        }
      });
    });
  } else {
    return internalError(res, "mbtiles file doesn't exist -> "+mbtilesfile);
  }
});

var server = require('http').createServer(app);
server.listen(PORT, IPADDRESS, function() {
  var url = "http://" + server.address().address +":"+ server.address().port;
  console.log('Serving HTTP on', url);
});
