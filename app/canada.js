import icons from "./icons";

const lngRange = 0.025;
const latRange = 0.025;

const canada = {
  lng: -98.74,
  lat: 56.415, 
  bbox: [-130, 65, -65, 47],
  provinces: {
    AB: {
      name: "Alberta",
      code: 48,
      term: "AB",
      concise: "PROV",
      coordinates: {
        lat: 55,
        lng: -115,
      },
      cities: {},
    },
    BC: {
      name: "British Columbia",
      code: 59,
      term: "BC",
      concise: "PROV",
      coordinates: {
        lat: 53.726669,
        lng: -127.647621,
      },
      cities: {
        places: {},
      },
    },
    MB: {
      name: "Manitoba",
      code: 46,
      term: "MB",
      concise: "PROV",
      coordinates: {
        lat: 56.415211,
        lng: -98.739075,
      },
      cities: {
        places: {},
      },
    },
    NB: {
      name: "New Brunswick",
      code: 13,
      term: "NB",
      concise: "PROV",
      coordinates: {
        lat: 46.49839,
        lng: -66.159668,
      },
      cities: {
        places: {},
      },
    },
    NL: {
      name: "Newfoundland and Labrador",
      code: 10,
      term: "NL",
      concise: "PROV",
      coordinates: {
        lat: 53.135509,
        lng: -57.660435,
      },
      cities: {
        places: {},
      },
    },
    NS: {
      name: "Nova Scotia",
      code: 12,
      term: "NS",
      concise: "PROV",
      coordinates: {
        lat: 45,
        lng: -63,
      },
      cities: {
        places: {},
      },
    },
    ON: {
      name: "Ontario",
      code: 35,
      term: "ON",
      concise: "PROV",
      coordinates: {
        lat: 47.75,
        lng: -84.83333,
      },
      cities: {
        Ottawa: {
          name: "Ottawa",
          places: {
            CDC: {
              name: "Carleton University",
              id: "CDC",
              placeGeojson: {
                "type": "FeatureCollection",
                "features": [
                    {
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
                    }
                ]
            },
              coordinates: {
                lat: 45.38435,
                lng: -75.69435,
                msl: 80,
              },
              gltfPath: "assets/ON/Ottawa/CDC/glb/ON_Ottawa_CDC_",
              gltfMasses: {
                url: "assets/ON/Ottawa/CDC/glb/ON-Ottawa-cu-masses.glb",
              },
              objects: {
                MB: {
                  name: "Maintenance and Grounds Building",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-MAINTENANCE_AND_GROUNDS_BLDG-AS_FOUND.ifc",
                },
                AC: {
                  name: "Athletics Alumni and Fieldhouse",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-ATHLETICS_ALUMNI_AND_FIELDHOUSE-AS_FOUND.ifc",
                },
                DT: {
                  name: "Dunton Tower",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-DUNTON_TOWER-AS_FOUND.ifc",
                },
                NB: {
                  name: "Nesbitt Biology Building",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-NESBITT_BIOLOGY_BLDG-AS_FOUND.ifc",
                },
                AA: {
                  name: "Building 22",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-BLDG_22-AS_FOUND.ifc",
                },
                AR: {
                  name: "Arise",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-ARISE-AS_FOUND.ifc",
                },
                AP: {
                  name: "Azrieli Pavilion",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-AZRIELI_PAVILION-AS_FOUND.ifc",
                },
                AT: {
                  name: "Azrieli Theatre",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-AZRIELI_THEATRE-AS_FOUND.ifc",
                },
                CB: {
                  name: "Canal Building",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-CANAL_BLDG-AS_FOUND.ifc",
                },
                HS: {
                  name: "Health Sciences Building",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-HEALTH_SCIENCES_BLDG-AS_FOUND.ifc",
                },
                HP: {
                  name: "Hezberg Laboratories",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-HEZBERG_LABORATORIES-AS_FOUND.ifc",
                },
                LA: {
                  name: "Loeb Building",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-LOEB_BLDG-AS_FOUND.ifc",
                },
                ME: {
                  name: "Mackenzie",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-MACKENZIE-AS_FOUND.ifc",
                },
                ML: {
                  name: "Macodrum Library",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-MACODRUM_LIBRARY-AS_FOUND.ifc",
                },
                MC: {
                  name: "Minto Centre",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-MINTO_CENTRE-AS_FOUND.ifc",
                },
                NI: {
                  name: "Nicol Building",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-NICOL_BLDG-AS_FOUND.ifc",
                },
                PA: {
                  name: "Paterson Hall",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-PATERSON_HALL-AS_FOUND.ifc",
                },
                RB: {
                  name: "River Building",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-RIVER_BLDG-AS_FOUND.ifc",
                },
                SR: {
                  name: "Social Sciences Research Building",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-SOCIAL_SCIENCES_RESEARCH_BLDG-AS_FOUND.ifc",
                },
                SA: {
                  name: "Southam Hall and Kailash Mital Theatre",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-SOUTHAM_HALL_AND_KAILASH_MITAL_THEATRE-AS_FOUND.ifc",
                },
                SC: {
                  name: "Steacie Building",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-STEACIE_BLDG-AS_FOUND.ifc",
                },
                SD: {
                  name: "Stormont and Dundas House",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-STORMONT_AND_DUNDAS_HOUSE-AS_FOUND.ifc",
                },
                TB: {
                  name: "Tory Building",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-TORY_BLDG-AS_FOUND.ifc",
                },
                UC: {
                  name: "University Centre",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-UNIVERSITY_CENTRE-AS_FOUND.ifc",
                },
                VS: {
                  name: "Vsim Building",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-VSIM_BLDG-AS_FOUND.ifc",
                },
                FR: {
                  name: "Frontenac House",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-FRONTENAC_HOUSE-AS_FOUND.ifc",
                },
                GH: {
                  name: "Glengarry House",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-GLENGARRY_HOUSE-AS_FOUND.ifc",
                },
                LH: {
                  name: "Lanark House",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-LANARK_HOUSE-AS_FOUND.ifc",
                },
                LE: {
                  name: "Leeds House",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-LEEDS_HOUSE-AS_FOUND.ifc",
                },
                LX: {
                  name: "Lennox and Addington House",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-LENNOX_AND_ADDINGTON_HOUSE-AS_FOUND.ifc",
                },
                PH: {
                  name: "Prescott House",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-PRESCOTT_HOUSE-AS_FOUND.ifc",
                },
                RH: {
                  name: "Renfrew House",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-RENFREW_HOUSE-AS_FOUND.ifc",
                },
                CO: {
                  name: "Residence Commons",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-RESIDENCE_COMMONS-AS_FOUND.ifc",
                },
                RU: {
                  name: "Russell and Grenville House",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-RUSSELL_AND_GRENVILLE_HOUSE-AS_FOUND.ifc",
                },
                SP: {
                  name: "St Patricks Building",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-ST_PATRICKS_BLDG-AS_FOUND.ifc",
                },
                IH: {
                  name: "Ice House",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-ICE_HOUSE-AS_FOUND.ifc",
                },
                TC: {
                  name: "Tennis Centre",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-TENNIS_CENTRE-AS_FOUND.ifc",
                },
                PG9: {
                  name: "Parking Garage P9",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-PARKING_GARAGE_P9-AS_FOUND.ifc",
                },
                PG: {
                  name: "Parking Garage P18",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-PARKING_GARAGE_P18-AS_FOUND.ifc",
                },
                SS: {
                  name: "Bronson Sub-Station",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-BRONSON_SUB-STATION-AS_FOUND.ifc",
                },
                TT: {
                  name: "CTTC Bldg",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-CTTC_BLDG-AS_FOUND.ifc",
                },
                UH: {
                  name: "CHEER",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-CHEER-AS_FOUND.ifc",
                },
                CC: {
                  name: "Colonel By Child Care Centre",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-COLONEL_BY_CHILD_CARE_CENTRE-AS_FOUND.ifc",
                },
                RO: {
                  name: "Robertson Hall",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-ROBERTSON_HALL-AS_FOUND.ifc",
                },
              },
              context: {
                Z1: {
                  name: "Exterior Zone 1",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-EXTERIOR_ZONE_1-AS_FOUND.ifc",
                },
                Z2: {
                  name: "Exterior Zone 2",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-EXTERIOR_ZONE_2-AS_FOUND.ifc",
                },
                Z3: {
                  name: "Exterior Zone 3",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-EXTERIOR_ZONE_3-AS_FOUND.ifc",
                },
                Z4: {
                  name: "Exterior Zone 4",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-EXTERIOR_ZONE_4-AS_FOUND.ifc",
                },
                RD: {
                  name: "Roads",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-ROADS-AS_FOUND.ifc",
                },
                TU: {
                  name: "Tunnels",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-TUNNELS-AS_FOUND.ifc",
                },
              },
              ifcPath: "assets/ON/Ottawa/CDC/ifc/",
              jsonPropertiesPath: "assets/ON/Ottawa/CDC/json/ON_Ottawa_CDC_",
            },
            PB: {
              name: "Parliament Buildings",
              id: "PB",
              placeGeojson:{
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
            },
              coordinates: {
                lat: 45.42521,
                lng: -75.70011,
                msl: 85,
              },
              gltfMasses: {
                url: "assets/ON/Ottawa/PB/glb/ON-Ottawa-PB.glb",
              },
              ifcPath: "assets/ON/Ottawa/PB/objects/",
              gltfPath: "assets/ON/Ottawa/PB/glb/ON_Ottawa_PB_",
              jsonPropertiesPath: "assets/ON/Ottawa/PB/json/ON_Ottawa_PB_",
              objects: {
                CB: {
                  name: "Centre Block",
                },
                EB: {
                  name: "East Block",
                },
                LOP: {
                  name: "Library of Parliament",
                },
                PT: {
                  name: "Peace Tower",
                  ifcFileName: "ON-Ottawa-PB-PT.ifc",
                },
                WB: {
                  name: "West Block",
                },
              },
            },
            HM: {
              name: "Holocaust Memorial",
              id: "HM",
              placeGeojson: {
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
            },
              coordinates: {
                lat: 45.41681,
                lng: -75.71448,
                msl: 56.1,
              },
              logo: "assets/ON/Ottawa/HM/ncc-logo.jpg",
              gltfMasses: {
                url: "assets/ON/Ottawa/HM/glb/ON-Ottawa-HM.glb",
              },
              ifcPath: "assets/ON/Ottawa/HM/objects/HM/ifc/",
              gltfPath: "assets/ON/Ottawa/HM/glb/ON_Ottawa_HM_",
              jsonPropertiesPath: "assets/ON/Ottawa/HM/json/ON_Ottawa_HM_",
              objects: {
                HM: {
                  name: "Holocaust Memorial",
                  ifcFileName: "ON-Ottawa-HM.ifc",
                },
              },
            },
            /*CWM: {
              name: "Canadian War Museum",
              id: "CWM",
              placeGeojson:{
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
            },
              coordinates: {
                lat: 45.4172408,
                lng: -75.71729,
                msl: 56.1,
              },
              logo: "assets/ON/Ottawa/CWM/cwm-logo.png",
              gltfMasses: {
                url: "assets/ON/Ottawa/CWM/glb/ON-Ottawa-CWM.glb",
              },
              gltfPath: "assets/ON/Ottawa/CWM/glb/ON_Ottawa_CWM_",
              jsonPropertiesPath: "assets/ON/Ottawa/CWM/json/ON_Ottawa_CWM_",
              objects: {
                CWM: {
                  name: "Canadian War Museum",
                },
              },
            },*/
            NAC: {
              name: "National Art Centre",
              placeGeojson:{
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
            },
              coordinates: {
                lat: 45.42391168154506,
                lng: -75.69351075230375,
                msl: 53,
              },
              objects:{}
            },
          },
          layers: {
            busStops: setLayer(
              "busStops",
              "OCTranspo bus stops",
              "assets/ON/Ottawa/json/ON-Ottawa-busStops.json",
              "#CE343B",
              ocTranspo
            ),
            trees: setLayer(
              "trees",
              "Ottawa trees",
              "assets/ON/Ottawa/json/ON-Ottawa-trees.json",
              "green",
              ottawaTrees
            ),
          },
        },
        Toronto: {
          name: "Toronto",
          places: {
            DA: {
              name: "Downsview Airport",
              id: "DA",
              placeGeojson: {
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
            } ,
              location: "ON-TO-DA",
              coordinates: {
                lat: 43.73519,
                lng: -79.474102,
                msl: 188,
              },
              gltfMasses: {
                url: "assets/ON/Toronto/DA/glb/ON-Toronto-DA-masses.gltf",
              },
              ifcPath: "assets/ON/Toronto/DA/ifc/",
              gltfPath: "assets/ON/Toronto/DA/glb/ON_Toronto_DA_",
              jsonPropertiesPath: "assets/ON/Toronto/DA/json/ON_Toronto_da_",
              objects: {
                admin: {
                  name: "Admin, Data, Cafe, Superstore, Bays 1-6",
                  ifcFileName: "ON_Toronto_DA_admin.ifc",
                },
                b7_10: {
                  name: "Bays 7 to 10",
                  ifcFileName: "ON_Toronto_DA_b7_10.ifc",
                },
                b11: {
                  name: "Bay 11",
                  ifcFileName: "ON_Toronto_DA_b11.ifc",
                },
                b12: {
                  name: "Bay 12",
                  ifcFileName: "ON_Toronto_DA_b12.ifc",
                },
              },
            },
          },
          layers: {
            trees: setLayer(
              "trees",
              "Toronto trees",
              "assets/ON/Toronto/geojson/ON-Toronto-trees.geojson",
              "green",
              torontoTrees
            ),
            bikes: setLayer(
              "bikes",
              "Bicycle parking",
              "assets/ON/Toronto/geojson/ON-Toronto-bike_parking.geojson",
              "orange"
            ),
            busStops: setLayer(
              "busStops",
              "Transit shelter",
              "assets/ON/Toronto/geojson/ON-Toronto-transit_shelter.geojson",
              "yellow"
            ),
            litter: setLayer(
              "litter",
              "Litter Receptacles",
              "assets/ON/Toronto/geojson/ON-Toronto-litter_receptacle.geojson",
              "blue"
            ),
            wc: setLayer(
              "wc",
              "Public Washrooms",
              "assets/ON/Toronto/geojson/ON-Toronto-public_washroom.geojson",
              "#eeeeee"
            ),
            bench: setLayer(
              "bench",
              "Benches",
              "assets/ON/Toronto/geojson/ON-Toronto-bench.geojson",
              "#a17c4c"
            ),
          },
        },
      },
    },
    PE: {
      name: "Prince Edward Island",
      code: 11,
      term: "PE",
      concise: "PROV",
      coordinates: {
        lat: 46.25,
        lng: -63,
      },
      cities: {
        places: {},
      },
    },
    QC: {
      name: "Quebec",
      code: 24,
      term: "QC",
      concise: "PROV",
      coordinates: {
        lat: 52.9399,
        lng: -73.5491,
      },
      cities: {
        places: {},
      },
    },
    SK: {
      name: "Saskatchewan",
      code: 47,
      term: "SK",
      concise: "PROV",
      coordinates: {
        lat: 55,
        lng: -106,
      },
      cities: {
        places: {},
      },
    },
    NT: {
      name: "Northwest Territories",
      code: 61,
      term: "NT",
      concise: "TERR",
      coordinates: {
        lat: 64.26667,
        lng: -119.18333,
      },
      cities: {
        places: {},
      },
    },
    NU: {
      name: "Nunavut",
      code: 62,
      term: "NU",
      concise: "TERR",
      coordinates: {
        lat: 64.15,
        lng: -95.5,
      },
      cities: {
        places: {},
      },
    },
    YU: {
      name: "Yukon",
      code: 60,
      term: "YU",
      concise: "TERR",
      coordinates: {
        lat: 63.63333,
        lng: -135.76666,
      },
      cities: {
        places: {},
      },
    },
  },
};

async function getJson(path) {
  let response = await fetch(path);
  let json = await response.json();
  return json;
}

async function setGeojson(items) {
  const geojson = { type: "FeatureCollection" };
  geojson.features = [];
  for (let key in items) {
    let item = items[key];
    geojson.features.push({
      type: "Feature",
      id: `${item.id}`,
      geometry: {
        type: "Point",
        coordinates: [item.coordinates[0], item.coordinates[1]],
      },
      properties: {
        name: `${item.name}`,
        title: `${item.title}`,
      },
    });
  }
  return geojson;
}

async function setLayer(id, layerName, url, color, funct) {
  let infoText = info(
    `<b>${layerName}</b> <br>click on markers to see details`
  );
  let layer = {
    id: id,
    name: layerName,
    // color : Math. floor(Math. random()*16777215), // random color
    color: color,
    svg: icons[id]
      ? `${icons[id]}${infoText}`
      : `<h1>${layerName[0]}${info}</h1>`,
  };
  !funct
    ? (layer.geojson = async () => await geojsonLayer(layerName, url))
    : (layer.geojson = funct);
  return layer;
}

async function geojsonLayer(layerName, url) {
  let json = await getJson(url);
  let items = {};
  let features = json.features;
  features.forEach((feature) => {
    let { ID } = feature.properties;
    if (ID === "" || !ID) return;
    if (!feature.geometry) return;
    items[ID] = {
      id: ID,
      name: `${layerName}: ${ID}`,
      coordinates: feature.geometry.coordinates,
      title: `<b>${layerName}</b> <br> ID: ${ID}`,
    };
  });
  let geojson = await setGeojson(items);
  return geojson;
}

async function torontoTrees(place) {
  let json = await getJson(
    "assets/ON/Toronto/geojson/ON-Toronto-trees.geojson"
  );
  let trees = {};
  let features = json.features;
  let { lng, lat } = place.coordinates;
  let geojson;
  features.forEach((feature) => {
    if (!feature.geometry) return;
    let fLng = feature.geometry.coordinates[0];
    let fLat = feature.geometry.coordinates[1];
    if (
      fLng > lng - lngRange &&
      fLng < lng + lngRange &&
      fLat < lat + latRange &&
      fLat > lat - latRange
    ) {
      trees[feature.properties._id] = {
        id: feature.properties._id,
        name: feature.properties.COMMON_NAME,
        coordinates: feature.geometry.coordinates,
        title: `<b>Tree specie:</b> ${
          feature.properties.COMMON_NAME
        }<br> <b>DBH:</b> ${parseFloat(feature.properties.DBH_TRUNK).toFixed(
          2
        )}`,
      };
    }
  });
  geojson = await setGeojson(trees);
  return geojson;
}

async function ottawaTrees(place) {
  let json = await getJson("assets/ON/Ottawa/json/ON-Ottawa-trees.json");
  let trees = {};
  let features = json.features;
  let { lng, lat } = place.coordinates;
  features.forEach((feature) => {
    if (!feature.geometry) return;
    let fLng = feature.geometry.coordinates[0];
    let fLat = feature.geometry.coordinates[1];
    if (
      fLng > lng - lngRange &&
      fLng < lng + lngRange &&
      fLat < lat + latRange &&
      fLat > lat - latRange
    ) {
      trees[feature.properties.OBJECTID] = {
        id: feature.properties.OBJECTID,
        name: feature.properties.SPECIES,
        coordinates: feature.geometry.coordinates,
        title: `<b>Tree specie:</b> ${
          feature.properties.SPECIES
        }<br> <b>DBH:</b> ${parseFloat(feature.properties.DBH).toFixed(2)}`,
      };
    }
  });
  return await setGeojson(trees);
}

async function ocTranspo(place) {
  let json = await getJson("assets/ON/Ottawa/json/ON-Ottawa-busStops.json");
  let busStops = {};
  json.forEach((busStop) => {
    busStops[busStop.stop_code] = {
      id: busStop.stop_code,
      name: busStop.stop_name,
      coordinates: [busStop.stop_lon, busStop.stop_lat],
      title: `<b>Stop code:</b> ${busStop.stop_code}<br> <b>Stop Name:</b> ${busStop.stop_name}`,
    };
    return busStops;
  });
  return await setGeojson(busStops);
}

function info(info) {
  return `<span class="info-text">${info}</span>`;
}

export default canada;