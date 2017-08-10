"use strict";

var path = require('path');

var config = {
  PORT: process.env.PORT || 8000,
  IPADDRESS: process.env.IP || '0.0.0.0',
  TILES_DIR: process.env.MY_DATA_DIR || path.join(__dirname, '/data'),
  MAP_DIR: path.join(__dirname, '/static/map'),
}

module.exports = config;
