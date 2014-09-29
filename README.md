mini-mbtiles-server
===================

1. `npm install`
2. Run `node server.js`
3. Copy a .mbtiles file in the root directory, e.g.: ./abc.mbtiles
3. The tiles are served via http://localhost:3000/abc/3/1/2.png

Based on Tobin Bradley's nice [tutorial](https://www.youtube.com/watch?v=CwAQSKsSQhI) on [mbtiles-server](https://github.com/tobinbradley/mbtiles-server) with a few minor modifications.

## Get meta-information for vector tiles

### Get meta information

**Example:** `localhost:8080/berlin_vector/meta.json`
    
**Scheme:** `location_on_server/name_of_tileset/meta.json`
    
- "location_on_server" is the url to your server/localhost
- "name_of_tileset" is the name of the .MBtiles file on your server

Returns a json file which contains the meta information of the tileset, e.g. layers, name, maximum and minimum zoom levels, etc.
   

MapBox equivalent is something like `http://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6-dev.json?access_token=some-access-token`

### Use meta information

Save the meta information as `meta.json` or something that suits you and add the path of your tileset to it.

    "tiles":[
        "localhost:8080/name_of_tileset/{z}/{x}/{y}.vector.pbf"
    ]
    
Result is somthing like this:

    {
       "scheme":"tms",
       "basename":"berlin_vector.mbtiles",
       "id":"berlin_vector",
       "filesize":2457600,
       "center":[
          0,
          0,
          1
       ],
       "description":"berlin",
       "format":"pbf",
       "maxzoom":5,
       "minzoom":0,
       "name":"berlin",
       "tiles":[
          "http://0.0.0.0:8080/berlin_vector/{z}/{x}/{y}.vector.pbf"
       ],
       "vector_layers":[ 
           ... 
       ],
       "bounds":[
          -180,
          -85.05112877980659,
          180,
          85.0511287798066
       ]
    }

MapBox reference <https://github.com/mapbox/tilejson-spec/tree/master/2.1.0>
    
## Style your map
Check the MapBox reference under <https://www.mapbox.com/mapbox-gl-style-spec/>
