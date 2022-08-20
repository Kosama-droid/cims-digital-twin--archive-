let icons = {
  busStops:
    '<path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm-3.5 18h-1.167c-.322 0-.583-.261-.583-.583v-.584c-.309 0-.606-.123-.825-.341-.219-.219-.342-.516-.342-.825v-4.667c-.322 0-.583-.261-.583-.583v-1.75c0-.322.261-.584.583-.584v-2.333c0-.966.784-1.75 1.75-1.75h9.334c.966 0 1.75.784 1.75 1.75v2.333c.322 0 .583.262.583.584v1.75c0 .322-.261.583-.583.583v4.667c0 .309-.123.606-.342.825-.219.218-.516.341-.825.341v.584c0 .322-.261.583-.583.583h-1.167c-.322 0-.583-.261-.583-.583v-.584h-5.834v.584c0 .322-.261.583-.583.583zm-.875-4.083c.483 0 .875.392.875.875s-.392.875-.875.875-.875-.392-.875-.875.392-.875.875-.875zm8.75 0c.483 0 .875.392.875.875s-.392.875-.875.875-.875-.392-.875-.875.392-.875.875-.875zm-2.917.583h-2.916c-.161 0-.292.131-.292.292 0 .161.131.291.292.291h2.916c.161 0 .292-.13.292-.291 0-.161-.131-.292-.292-.292zm3.792-7.292c0-.161-.131-.291-.292-.291h-9.916c-.161 0-.292.13-.292.291v4.959s1.807.583 5.25.583 5.25-.583 5.25-.583v-4.959zm-2.917-2.041h-4.666v.583h4.666v-.583z"/>',
  trees:
    '<path d="M13 24h-2v-4.829c-.695-.173-1.413-.502-1.951-.895-.5.15-1.019.225-1.549.225-3.033 0-5.5-2.505-5.5-5.584 0-1.283.421-2.494 1.197-3.477-.195-.496-.297-1.025-.297-1.565 0-2.025 1.403-3.721 3.298-4.12 1.042-2.27 3.301-3.755 5.802-3.755 2.501 0 4.761 1.485 5.803 3.756 1.894.398 3.297 2.094 3.297 4.119 0 .54-.102 1.07-.296 1.565.776.983 1.196 2.193 1.196 3.477 0 3.079-2.468 5.584-5.5 5.584-.528 0-1.046-.075-1.545-.224-.518.387-1.224.734-1.955.908v4.815zm-3.45-8.081c.948 1.371 2.191 1.384 2.506 1.384.341 0 1.567-.075 2.395-1.384.701.416 2.891 1.161 4.494-.438 1.389-1.392 1.615-4.14-.617-5.726 1.118-1.212.803-2.311.567-2.824-.343-.748-1.085-1.334-2.524-1.293-.416-1.98-2.462-3.638-4.371-3.638-1.894 0-3.986 1.616-4.37 3.638-1.245-.028-2.052.523-2.368 1.007-.325.5-.667 1.812.41 3.11-2.188 1.862-1.99 4.352-.616 5.726 1.866 1.864 4.011.648 4.494.438z"/>',
};

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
              logo: "../assets/ON/Ottawa/CU/cu_logo.jfif",
              gltfPath: "../assets/ON/Ottawa/CU/glb/ON_Ottawa_CDC_",
              gltfMasses: {
                url: "../assets/ON/Ottawa/CU/glb/ON-Ottawa-cu-masses.glb",
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
              jsonPropertiesPath: "../assets/ON/Ottawa/CU/json/ON_Ottawa_CDC_",
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
            busStops: {
              name: "OCTranspo bus stops",
              logo: "../assets/ON/Ottawa/oc-logo.jpg",
              svg: icons.busStops,
              color: "#CE343B",
              geojson: getJson(
                "../assets/ON/Ottawa/json/ON-Ottawa-busStops.json"
              )
                .then((json) => {
                  let busStops = {};
                  json.forEach((busStop) => {
                    busStops[busStop.stop_code] = {
                      id: busStop.stop_code,
                      name: busStop.stop_name,
                      coordinates: [busStop.stop_lon, busStop.stop_lat],
                      title: `<b>Stop code:</b> ${busStop.stop_code}<br> <b>Stop Name:</b> ${busStop.stop_name}`,
                    };
                  });
                  return busStops;
                })
                .then((items) => {
                  return setGeojson(items);
                }),
                children: "",
            },
            trees: {
              name: "Ottawa trees",
              url: "",
              svg: icons.trees,
              color: "green",
              geojson: (site) => getJson("../assets/ON/Ottawa/json/ON-Ottawa-trees.json")
              .then((json) => {
                let trees = {};
                let features = json.features;
                let {lng, lat} = site.coordinates;
                features.forEach((feature) => {
                  if (!feature.geometry) return
                  let fLng = feature.geometry.coordinates[0];
                  let fLat = feature.geometry.coordinates[1];
                  if (fLng > lng - lngRange &&
                    fLng < lng + lngRange &&
                    fLat < lat + latRange &&
                    fLat > lat - latRange) {
                      trees[feature.properties.OBJECTID] = {
                        id: feature.properties.OBJECTID,
                        name: feature.properties.SPECIES,
                        coordinates: feature.geometry.coordinates,
                        title: `<b>Tree specie:</b> ${feature.properties.SPECIES}<br> <b>DBH:</b> ${parseFloat(feature.properties.DBH).toFixed(2)}`,
                      };
                    }
                  });
                  return trees;
                })
                .then((items) => {
                  return setGeojson(items);
                }),
            },
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
                url: "../assets/ON/Toronto/DA/glb/ON-Toronto-da-masses.gltf",
                position: { x: 0, y: 0, z: 0 },
              },
              ifcPath: "../assets/ON/Toronto/DA/ifc/",
              gltfPath: "../assets/ON/Toronto/DA/glb/ON_Toronto_da_",
              jsonPropertiesPath: "../assets/ON/Toronto/DA/json/ON_Toronto_da_",

              buildings: {
                Admin: {
                  name: "Admin, Data, Cafe, Superstore, Bays 1-6",
                  ifcFileName: "ON-Toronto-DA-admin.ifc",
                },
                b7_10: {
                  name: "Bays 7 to 10",
                  ifcFileName: "ON-Toronto-DA-b7_10.ifc",
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
            // busStops: infoMessage('⚠️ No bus stops data on this city'),
            trees: {
              name: "Toronto trees",
              url: "",
              svg: icons.trees,
              color: "green",
              geojson: (site) => getJson("../assets/ON/Toronto/geojson/ON-Toronto-trees.geojson")
                .then((json) => {
                  let trees = {};
                  let features = json.features;
                  let {lng, lat} = site.coordinates;
                  features.forEach((feature) => {
                    if (!feature.geometry) return
                    let fLng = feature.geometry.coordinates[0];
                    let fLat = feature.geometry.coordinates[1];
                    if (fLng > lng - lngRange &&
                      fLng < lng + lngRange &&
                      fLat < lat + latRange &&
                      fLat > lat - latRange) {
                      trees[feature.properties._id] = {
                        id: feature.properties._id,
                        name: feature.properties.COMMON_NAME,
                        coordinates: feature.geometry.coordinates,
                        title: `<b>Tree specie:</b> ${feature.properties.COMMON_NAME}<br> <b>DBH:</b> ${parseFloat(feature.properties.DBH_TRUNK).toFixed(2)}`,
                      };
                    }
                  });
                  return trees;
                })
                .then((items) => {
                  return setGeojson(items);
                }),
            },
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

function setGeojson(items) {
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

function infoMessage(message, seconds = 6) {
  let container = document.getElementById("message");
  container.innerHTML = message;
  container.classList.remove("hidden");
  setTimeout(() => container.classList.add("hidden"), seconds * 1000);
}