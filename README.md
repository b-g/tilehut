mini-mbtiles-server
===================

1. `npm install`
2. Run `node server.js`
3. Copy a .mbtiles file in the root directory, e.g.: ./abc.mbtiles
3. The tiles are served via http://localhost:3000/abc/3/1/2.png

Based on Tobin Bradley's nice [tutorial](https://www.youtube.com/watch?v=CwAQSKsSQhI) on [mbtiles-server](https://github.com/tobinbradley/mbtiles-server) with a few minor modifications.

## Setup vector tiles

### 1. Get meta information for tileset

**Example:** 

     localhost:8080/tiles_vector/meta.json

**Scheme:**

     location_on_server/name_of_tileset/meta.json


Returns a json-file which contains the meta information of the tileset, e.g. layers, name, maximum and minimum zoom levels, etc.
   

MapBox equivalent is something like `http://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6-dev.json?access_token=some-access-token`

### 2. Add tileset information to meta.json

Save the meta information as `meta.json` or something that suits you. Add an array called "tiles" containing the path to your tiles. Your new meta.json should look something like that.

	...
    "minzoom":0,
    "name":"world",
    "tiles":[
        "localhost:8080/tiles_vector/{z}/{x}/{y}.vector.pbf"
    ],
    "vector_layers":[ 
        ... 
    ],
    ...
    
MapBox reference <https://github.com/mapbox/tilejson-spec/tree/master/2.1.0>
    
### 3. Style your map
Check the MapBox reference under <https://www.mapbox.com/mapbox-gl-style-spec/>
