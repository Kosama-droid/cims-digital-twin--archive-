import mongoose from "mongoose";
const Schema = mongoose.Schema;

// We create a schema for place
let placeSchema = Schema({
    name: { type: String, required: true },
    id: { type: String, required: false },
    placeGeoJson: {type : Array, required: false},
    city: {type: String, required: false}
});

const Place = mongoose.model("place", placeSchema);
export default Place;