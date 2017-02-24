"use strict";

var config = require('./config');
var MBTiles = require('mbtiles');
var path = require('path');
var fs = require('fs');


var TileService = function(query) {
	this.q = query;
};

TileService.prototype.getInfo = function(done) {
  this._initMBTiles(function(err, mbtiles) {
    if (err) return done(err);
    mbtiles.getInfo(function(err, info) {
      if (err) return done(new Error('cannot get metadata'));
      done(null, info);
    });
  });
};

TileService.prototype.getTile = function(done) {
  var that = this;
  that._initMBTiles(function(err, mbtiles) {
    if (err) return done(err);
    mbtiles.getTile(that.q.params.z, that.q.params.x, that.q.params.y, function(err, tile, headers) {
      if (err) return done(err);
      done(null, tile, headers);
    });
  });
};

TileService.prototype.getGrid = function(done) {
  var that = this;
  that._initMBTiles(function(err, mbtiles) {
    if (err) return done(err);
    mbtiles.getGrid(that.q.params.z, that.q.params.x, that.q.params.y, function(err, tile, headers) {
      if (err) return done(err);
      done(null, tile, headers);
    });
  });
};

TileService.prototype._initMBTiles = function(done) {
  var mbtilesfile = path.join(config.TILES_DIR, this.q.params.ts + '.mbtiles');
  fs.exists(mbtilesfile, function (exists) {
    if (!exists) return done(new Error('cannot find MBTiles file on server: ' + mbtilesfile));
    new MBTiles(mbtilesfile, function(err, mbtiles) {
      if (err) return done(new Error('cannot initialize MBTiles object'));
      done(null, mbtiles);
    });
  });
};

module.exports = TileService;
