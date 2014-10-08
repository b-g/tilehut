Tilehut
=======

## Introduction
Tiles are awesome ... Some kind of introduction here


## 5 Minute Installation
1. Login to **[OpenShift](https://www.openshift.com/)** and create a **new application**
2. Set Application Type as **"NodeJS"** 
3. Use `https://github.com/b-g/tilehut/` as **source code** for your Application
4. Connect via **FTP** to OpenShift and **add a tileset** into the folder `/app-root/data/`
5. **Inspect your map** using `application-youropenshiftdomain.rhcloud.com/tileset/map`

Based on Tobin Bradley's nice [tutorial](https://www.youtube.com/watch?v=CwAQSKsSQhI) on [mbtiles-server](https://github.com/tobinbradley/mbtiles-server) with a few minor modifications.

## Need Some Help?
We prepared a [tutorial](https://github.com/b-g/tilehut/tree/master/tutorial) which the covers everything step-by-step. Starting from creating a tileset, to using OpenShift and using you tileset. 

## Details

### Scheme
The tiles are served via `application-youropenshiftdomain.rhcloud.com/tileset/1/1/1.png`

### Tileset Meta Information
Example Path: `localhost:8080/tiles_vector/meta.json`

Scheme: `server/name_of_tileset/meta.json`
     
**Note:**
Adding `?vectortileflag=true` to meta.json path (e.g. "localhost:8080/tiles_vector/meta.json?vectortileflag=true") adds the "tiles"-array to the json. This array includes the path to your tiles, which is necessary for using vector maps in Mapbox GL JS.

MapBox reference <https://github.com/mapbox/tilejson-spec/tree/master/2.1.0>