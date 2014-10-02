Tilehut
=======

## Setup

1. `npm install`
2. Run `node server.js`
3. Copy a .mbtiles file in the data folder, e.g.: ./data/abc.mbtiles
3. The tiles are served via http://localhost:3000/abc/3/1/2.png

Based on Tobin Bradley's nice [tutorial](https://www.youtube.com/watch?v=CwAQSKsSQhI) on [mbtiles-server](https://github.com/tobinbradley/mbtiles-server) with a few minor modifications.

## Tileset Meta Information
**Example Path:** `localhost:8080/tiles_vector/meta.json`

**Scheme:** `location_on_server/name_of_tileset/meta.json`
     
**Note:**
Adding `?vectortileflag=true` to meta.json path (e.g. "localhost:8080/tiles_vector/meta.json?vectortileflag=true") adds the "tiles"-array to the json. This array includes the path to your tiles, which is necessary for using vector maps in Mapbox GL JS.

MapBox reference <https://github.com/mapbox/tilejson-spec/tree/master/2.1.0>
    
## Style your map

**Raster Maps:** [Tilemill](https://www.mapbox.com/tilemill/)

**Vector Maps:** [Style reference for Mapbox GL](https://www.mapbox.com/mapbox-gl-style-spec/)
