import mongoose from "mongoose";
//const { DefaultLoadingManager } = require("three");
const Schema = mongoose.Schema;

//using schema 
import place from "./placeModel.js";

// We create a schema for Objects
let objectSchema = Schema({
    name: { type: String, required: true },
    //id: { type: String, required: true },
    ifcFileName: {type : String, required: false},
    city: {type: String, required: false},
    place: {type: String, required: false}
    //place: {type: place, required: false} //maybe just the name of place?
    //owner: {type: owner, required: false}
});

const Object = mongoose.model("Object", objectSchema);
export default Object;