"use strict";

var express = require('express');
var app = exports.app = express();

var config = require('./config');
var TileService = require('./TileService');


var routeHandlers = {
  getTile: function(req, res, next) {
    var tileService = new TileService(req);
    tileService.getTile(function(err, tile, headers) {
      if (err) return res.status(404).send(err.message);
      res.set(headers);
      res.send(tile);
    });
  },
  getGrid: function(req, res, next) {
    var tileService = new TileService(req);
    tileService.getGrid(function(err, tile, headers) {
      if (err) return res.status(404).send(err.message);
      res.set(headers);
      res.send(tile);
    });
  },
  getInfo: function(req, res, next) {
    var tileService = new TileService(req);
    tileService.getInfo(function(err, info) {
      if (err) return res.status(404).send(err.message);
      res.json(info);
    });
  },
  ping: function(req, res, next){
    res.send('tilehut says pong!');
  },
  // openshift expects to get a valid response from '/' (health status)
  healthStatus: function(req, res, next){
    res.send(':)');
  },
};

// TODO Cache-Control: setting

app.disable('x-powered-by');
app.use('*', function(req, res, next) {
  // set CORS response header
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

app.use('/:ts/map', express.static(config.MAP_DIR));

app.route('/:ts/:z/:x/:y.*grid.json$').get(routeHandlers.getGrid);
app.route('/:ts/:z/:x/:y.*').get(routeHandlers.getTile);
app.route('/:ts/meta.json').get(routeHandlers.getInfo);
app.route('/ping').get(routeHandlers.ping);
app.route('/').get(routeHandlers.healthStatus);

app.listen(config.PORT, config.IPADDRESS, function() {
  console.info('Tilehut on http://%s:%s', config.IPADDRESS, config.PORT);
});
