const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// We create a schema for place
let placeSchema = Schema({
    name: { type: String, required: true },
    id: { type: String, required: true },
    geoJson: {type : Array, required: true}
});

const place = mongoose.model("place", placeSchema);
module.exports = place;