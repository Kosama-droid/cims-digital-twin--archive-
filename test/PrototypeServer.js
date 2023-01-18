//Prototype 1 - Database server for Canada.js
import canada from "../app/canada.js";

import fs from 'fs'; //allows us to work with filesystem
//Express
import express from 'express';
import bodyParser from 'body-parser'; //parses body of request when using POST request 
const app = express();
app.listen(3000);
console.log("Server is connected ...")
//mongoDB
import mongodb from 'mongodb';
import MongoClient from 'mongodb';
import mongoose from 'mongoose';
//pug
import pug from 'pug';

//middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("templates");
app.set('view engine', 'pug');
app.use(express.urlencoded({extended:true}));
app.use(express.json());

import cors from 'cors';
app.use(cors())

import path from 'path';
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
let reqpath = path.join(__dirname, "../"); //using static and commonJS apparently
app.use(express.static(reqpath));

//using schema 
import Place from "./placeModel.js";
import Object from "./objectModel.js";

//connecting to database
mongoose.connect('mongodb://127.0.0.1/cimsTest', {useNewUrlParser: true, useUnifiedTopology: true}); //not sure this creates the db with name 'cimsTest' like I originally thought.

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to database'));

//staticaly/hardcoding the places of canada.js in the db
function insertPlaces(){
    for(var proTerm in canada.provinces) {
        //console.log("province: ", proTerm);
        for(var city in canada.provinces[proTerm].cities){
            //console.log("city: ",city);
            for(var place in canada.provinces[proTerm].cities[city].places){
                //console.log("place: ", place);
                let p = new Place ({
                    name: canada.provinces[proTerm].cities[city].places[place].name,
                    id: canada.provinces[proTerm].cities[city].places[place].id,
                    placeGeojson: canada.provinces[proTerm].cities[city].places[place].placeGeojson.features[0].geometry,
                    city: canada.provinces[proTerm].cities[city].name
                })
                //for(let geoJ in canada.provinces[proTerm].cities[city].places[place]){
                
                console.log(canada.provinces[proTerm].cities[city].places[place].placeGeojson.features);
                console.log(canada.provinces[proTerm].cities[city].places[place].placeGeojson.features[0].geometry);
                
                p.save(function (err, result) {
                    if (err) return err;
                    //console.log("inserting places - ", p);
                })
            }
        }
    } 
}


//adding objects to the db from canada.js
function insertObjects(){
    for(var proTerm in canada.provinces) {
        //console.log("province: ", proTerm);
        for(var city in canada.provinces[proTerm].cities){
            //console.log("city: ",city);
            for(var place in canada.provinces[proTerm].cities[city].places){
                //console.log("place: ", place);
                for(var o in canada.provinces[proTerm].cities[city].places[place].objects){
                    //console.log("object: ", o);
                    let object = new Object ({
                        name: canada.provinces[proTerm].cities[city].places[place].objects[o].name,
                        ifcFileName: canada.provinces[proTerm].cities[city].places[place].objects[o].ifcFileName
                    })

                    object.save(function (err, result) {
                        if (err) return err;
                
                        console.log("inserting object - ", object);
                    })
                }
            }
        }
    }
}

// Place.insertMany( [
//     {
//        name: "Central Park",
//        location: { type: "Point", coordinates: [ -73.97, 40.77 ] },
//        category: "Parks"
//     },
//     {
//        name: "Sara D. Roosevelt Park",
//        location: { type: "Point", coordinates: [ -73.9928, 40.7193 ] },
//        category: "Parks"
//     },
//     {
//        name: "Polo Grounds",
//        location: { type: "Point", coordinates: [ -73.9375, 40.8303 ] },
//        category: "Stadiums"
//     }
//  ] )

//Place.index( { location: "2dsphere" } );


Place.find((err, data) => {
    if (err) {
        res.status(400);
        res.write("GetPlaces: Server error");
        res.end();
        return console.log("GetPlaces: Server error");
    }
    console.log("Place find: data", data);
})

//showing the places in db
let showInitPlaces = function (){
    Place.find((err, data) => {
        if (err) {
            return console.log("GetPlaces: Server error", err);
        }
        console.log("Places inserted: ", data);
    }) 
}

//deleting all the places
function deleteAllPlaces(){
    Place.deleteMany(function (err){
        if(err) handleError(err);
        console.log("deleted all places");
    }); 
}

//deleting all the objects
function deleteAllObjects(){
    Object.deleteMany(function (err){
        if(err) handleError(err);
        console.log("deleted all objects");
    }); 
}

async function asyncInitPlaces(){
    deleteAllPlaces();
    deleteAllObjects();
    insertObjects();
    insertPlaces();  
}

asyncInitPlaces();

//GETs - information requested by the client
app.get("/getPlaces", (req, res) => {

    console.log('getNames request received.')
    Place.find((err, data) => {
        if (err) {
            res.status(400);
            res.write("GetPlaces: Server error");
	        res.end();
            return console.log("GetPlaces: Server error");
        }
        //console.log("Place find: data", data);
    
        res.status(200);
        res.setHeader("Content-Type", "application/JSON");
	    res.send(data);
    })
})

app.get("/places/:placeID", (req, res) => {

    console.log(req.params.placeID);
    let placeID = req.params.placeID.split(':')[1];

    console.log('getOnePlace request received.')

    Place.findOne({id: placeID}, (err, data) => {
        if (err) {
            res.status(400);
            res.write("GetOnePlace: Server error");
	        res.end();
            return console.log("GetOnePlace: Server error");
        }
        console.log("Place find: data", data);
    
        res.status(200);
        res.setHeader("Content-Type", "application/JSON");
	    res.send(data);
    })
})

app.get("/getObjects", (req, res) => {

    console.log('getObjects request received.')
    Object.find((err, data) => {
        if (err) {
            res.status(400);
            res.write("GetObjects: Server error");
	        res.end();
            return console.log("GetObjects: Server error");
        }
        //console.log("Object find: data", data);
    
        res.status(200);
        res.setHeader("Content-Type", "application/JSON");
	    res.send(data);
    })
})

//POSTs - information sent by the client
app.post("/postNewPlace", (req, res) => {

    /*if (err) {
        return console.error(err.message);
    }*/

    var postedPlace = req.body;
    console.log("received new place");
    console.log("req.body: postedPlace -", postedPlace); //printing the new Place data

    let newPlace = new Place({
        name: postedPlace.name,
        id: postedPlace.id,
        geoJson: postedPlace.geoJson,
        city: postedPlace.city
    })

    //Saving new place in db
    newPlace.save(function (err, result) {
        if (err) {
            res.status(400);
            res.write("postNewPlace: Server error - cant save the place");
	        res.end();
            return console.log("postNewPlace: Server error - cant save the place", err);
        }

        //making sure that the newPlace is in db
        // Place.findOne({id = id}, (err, data) => {
        //     if (err) {
        //         return console.log("Place not found");
        //     }

        //     console.log("Place find: data", data);
        // })
        

        console.log("inserted");
    })

    res.status(200);
    res.send()
})

app.post("/postNewObject", (req, res) => {

    var postedObject = req.body;
    console.log("received new object");
    console.log("req.body: postedPlace -", postedObject); 

    let newObject = new Object({
        name: postedObject.name,
        ifcFileName: postedObject.ifcFileName
    })

    //Saving new object in db
    newObject.save(function (err, result) {
        if (err) {
            res.status(400);
            res.write("postNewObject: Server error - cant save the object");
	        res.end();
            return console.log("postNewObject: Server error - cant save the object", err);
        }

        //making sure that the newPlace is in db
        Object.find((err, data) => {
            if (err) {
                return console.log("Object not found");
            }

            console.log("Object find: data", data);
        })
        
        console.log("inserted");
    })

    res.status(200);
    res.send()
})

