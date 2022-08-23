import icons from '../icons'

const lngRange = 0.03;
const latRange = 0.03;

export default canada = {
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
        sites: {},
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
        sites: {},
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
        sites: {},
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
        sites: {},
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
        sites: {},
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
          sites: {
            CDC: {
              name: "Carleton University",
              id: "CDC",
              coordinates: {
                lat: 45.38435,
                lng: -75.69435,
                msl: 80,
                zoom: 15,
              },
              logo: "../assets/ON/Ottawa/CDC/cu_logo.jfif",
              gltfPath: "../assets/ON/Ottawa/CDC/glb/ON_Ottawa_CDC_",
              gltfMasses: {
                url: "../assets/ON/Ottawa/CDC/glb/ON-Ottawa-cu-masses.glb",
                position: { x: 0, y: 0, z: 0 },
              },
              buildings: {
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
                P9: {
                  name: "Parking Garage P9",
                  ifcFileName:
                    "CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-PARKING_GARAGE_P9-AS_FOUND.ifc",
                },
                PS: {
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
              ifcPath:
                "https://cimsprojects.ca/CDC/CIMS-WebApp/assets/ontario/ottawa/carleton/ifc/",
              jsonPropertiesPath: "../assets/ON/Ottawa/CDC/json/ON_Ottawa_CDC_",
            },
            PB: {
              name: "Parliament Buildings",
              coordinates: {
                lat: 45.42521,
                lng: -75.70011,
                msl: 85,
                zoom: 16,
              },
              logo: "../assets/ON/Ottawa/PB/canda-gov.png",
              gltfMasses: {
                url: "../assets/ON/Ottawa/PB/glb/buildings-downtown.glb",
                position: { x: 0, y: 0, z: 0 },
              },
            },
            HM: {
              name: "Holocaust Memorial",
              coordinates: {
                lat: 45.41716147946148,
                lng: -75.71449380975366,
                msl: 53,
                zoom: 16,
              },
              logo: "../assets/ON/Ottawa/HM/ncc-logo.jpg",
            },
            NAC: {
              name: "National Art Centre",
              coordinates: {
                lat: 45.42391168154506,
                lng: -75.69351075230375,
                msl: 53,
                zoom: 16,
              },
              logo: "../assets/ON/Ottawa/NAC/nac-logo.jpg",
            },
          },
          layers: {
            busStops: setLayer("busStops", 
              "OCTranspo bus stops",
              "../assets/ON/Ottawa/json/ON-Ottawa-busStops.json",
              "#CE343B",
              ocTranspo
            ),
            trees: setLayer('trees', 
              "Ottawa trees",
              "../assets/ON/Ottawa/json/ON-Ottawa-trees.json",
              "green",
              ottawaTrees
            ),
          },
        },
        Toronto: {
          name: "Toronto",
          sites: {
            DA: {
              name: "Downsview Airport",
              id: "DA",
              location: "ON-TO-DA",
              coordinates: {
                lat: 43.73519,
                lng: -79.474102,
                msl: 188,
                zoom: 16,
              },
              logo: "../assets/ON/Toronto/DA/northcrest_logo.jfif",
              gltfMasses: {
                url: "../assets/ON/Toronto/DA/glb/ON-Toronto-DA-masses.gltf",
                position: { x: 0, y: 0, z: 0 },
              },
              ifcPath: "../assets/ON/Toronto/DA/ifc/",
              gltfPath: "../assets/ON/Toronto/DA/glb/ON_Toronto_DA_",
              jsonPropertiesPath: "../assets/ON/Toronto/DA/json/ON_Toronto_da_",
              buildings: {
                Admin: {
                  name: "Admin, Data, Cafe, Superstore, Bays 1-6",
                  ifcFileName: "ON-Toronto-DA-admin.ifc",
                },
                b7_10: {
                  name: "Bays 7 to 10",
                  ifcFileName: "ON-Toronto-DA-b7-10.ifc",
                },
                b11: {
                  name: "Bay 11",
                  ifcFileName: "ON-Toronto-DA-b11.ifc",
                },
                b12: {
                  name: "Bay 12",
                  ifcFileName: "ON-Toronto-DA-b12.ifc",
                },
              },
            },
          },
          layers: {
            trees: setLayer('trees', 
              "Toronto trees",
              "../assets/ON/Toronto/geojson/ON-Toronto-trees.geojson",
              "green",
              torontoTrees
            ),
            bikes: setLayer('bikes', 
              "Bicycle parking",
              "../assets/ON/Toronto/geojson/ON-Toronto-bike_parking.geojson",
              "orange"
            ),
            busStops: setLayer('busStops', 
              "Transit shelter",
              "../assets/ON/Toronto/geojson/ON-Toronto-transit_shelter.geojson",
              "yellow"
            ),
            litter: setLayer('litter', 
            "Litter Receptacles",
            "../assets/ON/Toronto/geojson/ON-Toronto-litter_receptacle.geojson",
            "blue"
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
        sites: {},
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
        sites: {},
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
        sites: {},
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
        sites: {},
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
        sites: {},
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
        sites: {},
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
  let layer = {
    id: id,
    name: layerName,
    // color : Math. floor(Math. random()*16777215), // random color
    color: color,
    svg: icons[id] ? icons[id]: `<h1>${layerName[0]}</h1>`,
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
      title: `<b>${layerName}</b> <br> ID: ${ID}}`,
    };
  });
  let geojson = await setGeojson(items);
  return geojson;
}

async function torontoTrees(site) {
  let json = await getJson(
    "../assets/ON/Toronto/geojson/ON-Toronto-trees.geojson"
  );
  let trees = {};
  let features = json.features;
  let { lng, lat } = site.coordinates;
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

async function ottawaTrees(site) {
  let json = await getJson("../assets/ON/Ottawa/json/ON-Ottawa-trees.json");
  let trees = {};
  let features = json.features;
  let { lng, lat } = site.coordinates;
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

async function ocTranspo(site) {
  let json = await getJson("../assets/ON/Ottawa/json/ON-Ottawa-busStops.json");
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
