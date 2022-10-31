const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//using schema 
const place = require("./placeModel.js");

// We create a schema for place
let objectSchema = Schema({
    name: { type: String, required: true },
    id: { type: String, required: true },
    geoJson: {type : Array, required: true},
    city: {type: String, required: true},
    place: {type: place, required: false} //maybe just the name of place?
});

const object = mongoose.model("object", objectSchema);
module.exports = object;