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

/* hardcode of places into collection -

let CDC = new place({
        name: "Carleton University",
        id: "CDC",
        city: "Ottawa",
        geojson: {
            "type": "FeatureCollection",
            "features": [
                {
                    "id": "19dc5ef9a24233ad4afb7d1302c22fdd",
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Polygon",
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
                        ]
                    }
                }
            ]
        }
    })

    CDC.save(function (err, result) {
        if (err) return err;

        console.log("inserting HM");
    })

    CDC.createIndex( { "location.features.geometry": "2dsphere" } )

    let PB = new place({
        name: "Parliament Buildings",
        id: "PB",
        city: "Ottawa",
        geojson:{
            "type": "FeatureCollection",
            "features": [
                {
                    "id": "831f9f555ad3d8115f769ca78c465561",
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "coordinates": [
                            [
                                [
                                    -75.70058467451888,
                                    45.42260036234234
                                ],
                                [
                                    -75.69618595051583,
                                    45.424634511219125
                                ],
                                [
                                    -75.69764315462844,
                                    45.425839176485795
                                ],
                                [
                                    -75.69941009882106,
                                    45.42670848160412
                                ],
                                [
                                    -75.70203058545846,
                                    45.425548388065494
                                ],
                                [
                                    -75.70184052996606,
                                    45.42347511350695
                                ],
                                [
                                    -75.70058467451888,
                                    45.42260036234234
                                ]
                            ]
                        ],
                        "type": "Polygon"
                    }
                }
            ]
        }
    })
    PB.save(function (err, result) {
        if (err) return err;

        console.log("inserting HM");
    })

    let HM = new place({
        name: "Holocaust Memorial",
        id: "HM",
        city: "Ottawa",
        geojson: {
            "type": "FeatureCollection",
            "features": [
                {
                    "id": "307f55f714e878dde104d8973136b51e",
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "coordinates": [
                            [
                                [
                                    -75.71491590178672,
                                    45.41698002845348
                                ],
                                [
                                    -75.71464766918312,
                                    45.41655393854717
                                ],
                                [
                                    -75.71457406851601,
                                    45.41654557912591
                                ],
                                [
                                    -75.71422363992023,
                                    45.416755971268
                                ],
                                [
                                    -75.71401412213122,
                                    45.41693605252604
                                ],
                                [
                                    -75.71382226553547,
                                    45.41719511432956
                                ],
                                [
                                    -75.71390492394325,
                                    45.41724690869236
                                ],
                                [
                                    -75.71491590178672,
                                    45.41698002845348
                                ]
                            ]
                        ],
                        "type": "Polygon"
                    }
                }
            ]
        }
    })
    HM .save(function (err, result) {
        if (err) return err;

        console.log("inserting HM");
    })

    let CWM = new place({
        name: "Canadian War Museum",
        id: "CWM",
        city: "Ottawa",
        geojson:{
            "type": "FeatureCollection",
            "features": [
                {
                    "id": "a81013213db16dc5e252535b2ee7df8a",
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "coordinates": [
                            [
                                [
                                    -75.71910117684025,
                                    45.416158814682234
                                ],
                                [
                                    -75.71822407078501,
                                    45.41637611122215
                                ],
                                [
                                    -75.71697521859993,
                                    45.41671799004075
                                ],
                                [
                                    -75.71600229860272,
                                    45.416865959431846
                                ],
                                [
                                    -75.71537721815065,
                                    45.41710286391398
                                ],
                                [
                                    -75.71570115269357,
                                    45.41782001356884
                                ],
                                [
                                    -75.7161059042506,
                                    45.41803090054583
                                ],
                                [
                                    -75.7168524387219,
                                    45.417922629637985
                                ],
                                [
                                    -75.71788721990461,
                                    45.417721374052945
                                ],
                                [
                                    -75.71805674475873,
                                    45.4176064565508
                                ],
                                [
                                    -75.71817954477861,
                                    45.41734370567136
                                ],
                                [
                                    -75.71887019951822,
                                    45.41696137889409
                                ],
                                [
                                    -75.71908112282426,
                                    45.41689135611921
                                ],
                                [
                                    -75.71906940222242,
                                    45.416722871131554
                                ],
                                [
                                    -75.71898736670684,
                                    45.41659145861519
                                ],
                                [
                                    -75.71910117684025,
                                    45.416158814682234
                                ]
                            ]
                        ],
                        "type": "Polygon"
                    }
                }
            ]
        }
    })
    CWM.save(function (err, result) {
        if (err) return err;

        console.log("inserting CWM");
    })

    let NAC = new place({
        name: "National Art Center",
        id: "NAC",
        city: "Ottawa",
        geojson:{
            "type": "FeatureCollection",
            "features": [
                {
                    "id": "6a8c00c7e3209902e7d0dd4e287de0c8",
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "coordinates": [
                            [
                                [
                                    -75.6939802337543,
                                    45.42263014482796
                                ],
                                [
                                    -75.69338335245256,
                                    45.4226637110942
                                ],
                                [
                                    -75.69335299051819,
                                    45.42275357648472
                                ],
                                [
                                    -75.69220265027006,
                                    45.423269568441754
                                ],
                                [
                                    -75.69219645104698,
                                    45.42334290407973
                                ],
                                [
                                    -75.69292826762099,
                                    45.423640855725694
                                ],
                                [
                                    -75.69312806070646,
                                    45.423585059598196
                                ],
                                [
                                    -75.6937298398983,
                                    45.42387628403725
                                ],
                                [
                                    -75.69463521824039,
                                    45.423890345663665
                                ],
                                [
                                    -75.69459973192858,
                                    45.42346243444695
                                ],
                                [
                                    -75.69467928403964,
                                    45.42342430176964
                                ],
                                [
                                    -75.6939802337543,
                                    45.42263014482796
                                ]
                            ]
                        ],
                        "type": "Polygon"
                    }
                }
            ]
        }
    })
    NAC.save(function (err, result) {
        if (err) return err;

        console.log("inserting NAC");
    })

    let DA = new place({
        name: "Downsview Airport",
        id: "DA",
        city: "Toronto",
        geojson: {
            "type": "FeatureCollection",
            "features": [
                {
                    "id": "bbff1e2cf048645e60439b4c522a1dc6",
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "coordinates": [
                            [
                                [
                                    -79.47408358730912,
                                    43.73290037722845
                                ],
                                [
                                    -79.46970150684537,
                                    43.73390466994161
                                ],
                                [
                                    -79.4701534911874,
                                    43.735496883169276
                                ],
                                [
                                    -79.46958897417998,
                                    43.73567038633507
                                ],
                                [
                                    -79.46951846547161,
                                    43.735894778860086
                                ],
                                [
                                    -79.46965975560144,
                                    43.73666970695797
                                ],
                                [
                                    -79.46877095067724,
                                    43.73681241293863
                                ],
                                [
                                    -79.46823501854546,
                                    43.737107980275226
                                ],
                                [
                                    -79.46793881811665,
                                    43.73717931573913
                                ],
                                [
                                    -79.4682637757364,
                                    43.73793323433421
                                ],
                                [
                                    -79.46560792517863,
                                    43.73864738217961
                                ],
                                [
                                    -79.4644747283333,
                                    43.73873584817542
                                ],
                                [
                                    -79.46379427430642,
                                    43.73849702481175
                                ],
                                [
                                    -79.45929207894135,
                                    43.73444535186508
                                ],
                                [
                                    -79.4589478013873,
                                    43.73378646640822
                                ],
                                [
                                    -79.45832818127322,
                                    43.733786371608886
                                ],
                                [
                                    -79.45739245024491,
                                    43.73307312087917
                                ],
                                [
                                    -79.45669128255089,
                                    43.73271401769787
                                ],
                                [
                                    -79.45298755501138,
                                    43.73346787471823
                                ],
                                [
                                    -79.45302531649084,
                                    43.73401357354095
                                ],
                                [
                                    -79.45283650909269,
                                    43.73423185167766
                                ],
                                [
                                    -79.45717991812592,
                                    43.73825027066556
                                ],
                                [
                                    -79.46293954778936,
                                    43.743472742484414
                                ],
                                [
                                    -79.46098603220916,
                                    43.74491058627413
                                ],
                                [
                                    -79.46493884095794,
                                    43.748776361639415
                                ],
                                [
                                    -79.46541479228455,
                                    43.74926119113471
                                ],
                                [
                                    -79.46567494908615,
                                    43.74955984024078
                                ],
                                [
                                    -79.46802538083102,
                                    43.749099421300286
                                ],
                                [
                                    -79.4694411446012,
                                    43.74887312336904
                                ],
                                [
                                    -79.47435655650091,
                                    43.753543793783734
                                ],
                                [
                                    -79.47438383602703,
                                    43.755497891711826
                                ],
                                [
                                    -79.47530408201027,
                                    43.75538089582011
                                ],
                                [
                                    -79.48114363026924,
                                    43.754012625974866
                                ],
                                [
                                    -79.4826029630279,
                                    43.753035415638095
                                ],
                                [
                                    -79.48282265621481,
                                    43.750532316327565
                                ],
                                [
                                    -79.48260688690695,
                                    43.748487576655606
                                ],
                                [
                                    -79.48216660024431,
                                    43.746474509797196
                                ],
                                [
                                    -79.47989970117017,
                                    43.746792233139786
                                ],
                                [
                                    -79.47914598483447,
                                    43.7451743975941
                                ],
                                [
                                    -79.47692816640144,
                                    43.74562062370174
                                ],
                                [
                                    -79.47408358730912,
                                    43.73290037722845
                                ]
                            ]
                        ],
                        "type": "Polygon"
                    }
                }
            ]
        }
    })
    DA.save(function (err, result) {
        if (err) return err;

        console.log("inserting DA");
    })

*/