var express = require("express"),
    app = express(),
    config = require('./config'),
MBTiles = require('mbtiles'),
    path = require("path"),
    fs = require('fs');


/* ----- this is the tile service ------ */
var TileService = function(query) {
    this.q = query;
};

TileService.prototype.getInfo = function(done) {
    this._initMBTiles(function(err, mbtiles) {
        if (err) return done(err);
        mbtiles.getInfo(function(err, info) {
            if (err) return done(new Error("cannot get metadata"));
            console.log(info);
            done(null, info);
        });
    });
};

TileService.prototype.getTile = function(done) {
    var that = this;
    console.log(that.q.params);
    that._initMBTiles(function(err, mbtiles) {
        if (err) return done(err);
        mbtiles.getTile(that.q.params.z, that.q.params.x, that.q.params.y, function(err, tile, headers) {
            if (err) return done(err);
            done(null, tile, headers);
        });
    });
};

TileService.prototype._initMBTiles = function(done) {
    var mbtilesfile = path.join(config.TILES_DIR, this.q.params.ts + '.mbtiles');
    console.log(mbtilesfile);
    fs.exists(mbtilesfile, function(exists) {
        if (!exists) return done(new Error("cannot find MBTiles file on server: " + mbtilesfile));
        new MBTiles(mbtilesfile, function(err, mbtiles) {
            if (err) return done(new Error("cannot initialize MBTiles object"));
            done(null, mbtiles);
        });
    });
};

/* ------- the route handlers -------- */

var handlers = {
  getTile: function(req, res, next) {
    var tileService = new TileService(req);
    tileService.getTile(function(err, tile, headers) {
      if (err) res.status(404).send(err.message);
      res.set(headers);
      res.send(tile);
    });
  },
  getInfo: function(req, res, next) {
    var tileService = new TileService(req);
    tileService.getInfo(function(err, info) {
      if (err) return next(err);
      res.json(info);
    });
  },
  ping: function(req, res, next){
  	res.send("tileservice says pong");
  }
};


app.route('/ping').get(handlers.ping);
app.route('/data/:ts/:z/:x/:y.*').get(handlers.getTile);
app.route('/data/:ts/meta.json').get(handlers.getInfo);



//http://localhost:8000/data/de_berlin_1_100/10/8.580322/48.173413
/*
{"scheme":"tms","basename":"de_berlin_1_100.mbtiles","id":"de_berlin_1_100","filesize":111284224,"name":"de_berlin_1_100.mbtiles","description":"de_berlin_1_100.mbtiles","version":"1","minzoom":0,"maxzoom":14,"center":[8.580322,48.173413,14],"bounds":[5.85608,47.29663,25.223128,60.256121],"type":"overlay","format":"pbf","vector_layers":[{"id":"de_berlin_1_100","description":"","minzoom":0,"maxzoom":14,"fields":{"n":"Number"}}]}
*/
//http://localhost:8000/data/test/14/88.593321/47.049833
/*
{"scheme":"tms","basename":"test.mbtiles","id":"test","filesize":11542528,"name":"test.mbtiles","description":"test.mbtiles","version":"2","minzoom":0,"maxzoom":14,"center":[-106.138916,34.912962,14],"bounds":[-106.171875,-39.368279,88.59375,68.007571],"type":"overlay","format":"pbf","vector_layers":[{"id":"mapgeojson","description":"","minzoom":0,"maxzoom":14,"fields":{}}]}
*/

app.listen(config.PORT, config.IPADDRESS, function() {
    console.log('Tilehut on http://%s:%s', config.IPADDRESS, config.PORT);
});
