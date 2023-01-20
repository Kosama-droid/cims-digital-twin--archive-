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
                    //placeGeojson: canada.provinces[proTerm].cities[city].places[place].placeGeojson.features[0].geometry,
                    featureCollection: canada.provinces[proTerm].cities[city].places[place].placeGeojson,
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

function testInsertPlace(){
    Place.insertMany( [ {
        name: "Carleton University",
        id: "CDC",
        placeGeojson: {
            "type": "FeatureCollection",
            features: {
                "id": "19dc5ef9a24233ad4afb7d1302c22fdd",
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "coordinates": [
                        [
                            [
                                -75.70130847450181,
                                45.37885250495145
                            ],
                            [
                                -75.70137939763889,
                                45.37980901336084
                            ],
                            [
                                -75.70135583631776,
                                45.38030630124288
                            ],
                            [
                                -75.70121704393954,
                                45.38090837256641
                            ],
                            [
                                -75.70099854247466,
                                45.381450056900064
                            ],
                            [
                                -75.70060484922253,
                                45.38211641055423
                            ],
                            [
                                -75.70008737069259,
                                45.382740714944276
                            ],
                            [
                                -75.69969929631793,
                                45.383175040095466
                            ],
                            [
                                -75.69929194863562,
                                45.38371277931921
                            ],
                            [
                                -75.69907805981924,
                                45.38429189332331
                            ],
                            [
                                -75.69904478398492,
                                45.38497602583672
                            ],
                            [
                                -75.69909336044309,
                                45.38548029251106
                            ],
                            [
                                -75.6994998225633,
                                45.38680240419842
                            ],
                            [
                                -75.70011820026312,
                                45.38878531622905
                            ],
                            [
                                -75.7002494447103,
                                45.38930514072814
                            ],
                            [
                                -75.70027488697272,
                                45.389913266598825
                            ],
                            [
                                -75.70020978237254,
                                45.390320257103326
                            ],
                            [
                                -75.69991595080752,
                                45.39103030132526
                            ],
                            [
                                -75.69928511310589,
                                45.39176861547989
                            ],
                            [
                                -75.69745214270708,
                                45.39302028113309
                            ],
                            [
                                -75.69715753292641,
                                45.3928071905959
                            ],
                            [
                                -75.69697423870397,
                                45.392731520039945
                            ],
                            [
                                -75.69666199972447,
                                45.39271181280864
                            ],
                            [
                                -75.69610568392059,
                                45.39269918139857
                            ],
                            [
                                -75.69594219066164,
                                45.39261117859749
                            ],
                            [
                                -75.69585120968469,
                                45.3924036810036
                            ],
                            [
                                -75.69461507875333,
                                45.39066590208398
                            ],
                            [
                                -75.6945059837744,
                                45.390383927163384
                            ],
                            [
                                -75.6941746011501,
                                45.39000217643874
                            ],
                            [
                                -75.69394714656697,
                                45.38970033356594
                            ],
                            [
                                -75.6938289521502,
                                45.38966713194219
                            ],
                            [
                                -75.69341664964327,
                                45.389191421075566
                            ],
                            [
                                -75.69146908788343,
                                45.38660483584843
                            ],
                            [
                                -75.69078456297177,
                                45.385769988059224
                            ],
                            [
                                -75.68970345999874,
                                45.384380532804244
                            ],
                            [
                                -75.68921669174163,
                                45.38364185916316
                            ],
                            [
                                -75.69052848069794,
                                45.38338634467138
                            ],
                            [
                                -75.69168681496268,
                                45.38313720286405
                            ],
                            [
                                -75.69237930149794,
                                45.383126369212846
                            ],
                            [
                                -75.69314049029308,
                                45.38278895973005
                            ],
                            [
                                -75.69426419539025,
                                45.38240829319673
                            ],
                            [
                                -75.69534383363259,
                                45.382040244235895
                            ],
                            [
                                -75.69707765965103,
                                45.38146712807199
                            ],
                            [
                                -75.69828190237799,
                                45.38057272292363
                            ],
                            [
                                -75.69984594718966,
                                45.37931447009083
                            ],
                            [
                                -75.70028173459652,
                                45.37886926361392
                            ],
                            [
                                -75.70130847450181,
                                45.37885250495145
                            ]
                        ]
                    ],
                    "type": "Polygon"
                }
            },
        },
    }
    ] )
}

async function asyncInitPlaces(){
    await deleteAllPlaces();
    await testInsertPlace();
    showInitPlaces;
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

