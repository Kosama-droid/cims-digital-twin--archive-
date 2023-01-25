import mongoose from "mongoose";
import GeoJson from "mongoose-geojson-schema";
var Schema = mongoose.Schema;

var schema = new mongoose.Schema({
	point: mongoose.Schema.Types.Point,
	multipoint: mongoose.Schema.Types.MultiPoint,
	linestring: mongoose.Schema.Types.LineString,
	multilinestring: mongoose.Schema.Types.MultiLineString,
	polygon: mongoose.Schema.Types.Polygon,
	multipolygon: mongoose.Schema.Types.MultiPolygon,
	geometry: mongoose.Schema.Types.Geometry,
	geometrycollection: mongoose.Schema.Types.GeometryCollection,
	feature: mongoose.Schema.Types.Feature,
	featurecollection: mongoose.Schema.Types.FeatureCollection
});

var db = mongoose.connection;
var model = db.model('GeoJSON', schema);

// //creating schema for place geojson object 
// var placeGeojson = new Schema ({
//     "type" : {
//         "type": String,
//         "default": "FeatureCollection"
//     },
//     "features": {
//         "id": {type: String},
//         "type": {type: String, default: "Feature"},
//         "properties": {type: Object},
//         "geometry": {
//             "type": {
//                 "type": String, 
//                 "enum": [
//                     "Point",
//                     "MultiPoint",
//                     "LineString",
//                     "MultiLineString",
//                     "Polygon",
//                     "MultiPolygon"
//                 ]
//             }
//         },
//         "coordinates": [[]]
//     }
// })

//creating schema for place
var placeSchema = new Schema ({
    name: { type: String, required: true },
    id: { type: String, required: false },
    city: {type: String, required: false},
    placeGeojson: {type: String, required: false}
});

const Place = mongoose.model("place", placeSchema);
export default Place;