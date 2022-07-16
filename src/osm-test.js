import { canada } from "../static/data/canada.js";
import { icons } from "../static/icons.js";
import { mapStyles } from "../static/map-styles.js";
import { models } from "../static/data/cdc-models.js";

// GLOBAL OBJECTS 🌎  _________________________________________________________________________________________
const selectors = Array.from(document.getElementById("selectors").children);
const toolbar = Array.from(document.getElementById("toolbar").children);

isolateSelector(selectors, "province-select", "style-select");
isolateSelector(toolbar, "go-to", "lng", "lat", "osm");

const province = {},
  city = {},
  site = {},
  map = {},
  scene = {},
  geoJson = { fill: "", outline: "" },
  lng = { canada: -98.74 },
  lat = { canada: 56.415 };

// By default Carleton University → // Downsview  lng = -79.47, lat = 43.73
lng.current = -75.69435;
lat.current = 45.38435;

// MAPBOX 🗺️📦 _________________________________________________________________________________________
mapboxgl.accessToken =
  "pk.eyJ1Ijoibmljby1hcmVsbGFubyIsImEiOiJjbDU2bTA3cmkxa3JzM2luejI2dnd3bzJsIn0.lKKSghBtWMQdXszpTJN32Q";
map.current = new mapboxgl.Map({
  container: "map", // container ID
  style: mapStyles[1].url,
  center: [lng.current, lat.current], // starting position [lng, lat]
  zoom: 15, // starting zoom
  pitch: 50,
  antialias: true,
  projection: "globe", // display the map as a 3D globe
});
// Day sky
map.current.on("style.load", () => {
  // Set the default atmosphere style
  // add sky styling with `setFog` that will show when the map is highly pitched
  map.current.setFog({
    "horizon-blend": 0.3,
    color: "#f8f0e3",
    "high-color": "#add8e6",
    "space-color": "#d8f2ff",
    "star-intensity": 0.0,
  });
  addTerrain(map.current);
});

map.current.on('mousemove', (e) => {
    document.getElementById('info').innerHTML =
    // `e.point` is the x, y coordinates of the `mousemove` event
    // relative to the top-left corner of the map.
    JSON.stringify(e.point) +
    '<br />' +
    // `e.lngLat` is the longitude, latitude geographical position of the event.
    JSON.stringify(e.lngLat.wrap());
    });

// Select map style 🗺️🎨 ___________________________________________________
const styleNames = [];
const styleSelect = document.getElementById("style-select");
mapStyles.forEach((style) => {
  styleNames.push(style.name);
});
mapStyles.forEach((mapStyle) => {
  let option = document.createElement("option");
  option.innerHTML = mapStyle.name;
  styleSelect.appendChild(option);
});
sortChildren(styleSelect);
styleSelect.addEventListener("change", function () {
  const selectedStyle = styleNames.indexOf(this.value);
  const url = mapStyles[selectedStyle].url;
  map.current.setStyle(url);
  map.current.setTerrain({ source: "mapbox-dem", exaggeration: 1 });
});

// GUI 🖱️ _____________________________________________________________
// Toggle Nav bar _____________________
const locationBar = document.getElementById("selectors");
const locationButton = document.getElementById("close-nav-bar");
let toggleLocationBar = false;
const osmButton = document.getElementById("osm");
let toggleOSM = true;
locationButton.onclick = function () {
  locationBar.style.display = toggleLocationBar ? "inline-block" : "none";
  locationButton.style.transform = toggleLocationBar ? "" : "rotate(180deg)";
  const navBar = document.getElementById("nav-bar");
  navBar.style.backgroundColor = toggleLocationBar ? "" : "#FFFFFF00";
  navBar.style.boxShadow = toggleLocationBar ? "" : "none";
  toggleLocationBar = !toggleLocationBar;
};
// Show OSM buildings 🏢
osmButton.onclick = function () {
  let layer = map.current.getLayer("OSM-buildings");
  if (toggleOSM) {
    loadOSM(map.current, 0.9);
    this.setAttribute("title", "Hide OSM Buildings");
    console.log(map.current.getSource('composite'))
  } else {
    map.current.removeLayer("OSM-buildings");
  }
  toggleOSM = !toggleOSM;
};

// Select province or Territory 🍁 _________________________________________________________
const provinceNames = [];
const provinces = canada.provinces;
const territories = canada.territories;
territories.forEach((territory) => {
  provinces.push(territory);
});
provinces.forEach((province) => {
  let option = document.createElement("option");
  option.innerHTML = province.provinceName;
  provinceNames.push(province.provinceName);
  document.getElementById("province-select").appendChild(option);
});
document
  .getElementById("province-select")
  .addEventListener("change", function () {
    province.index = provinceNames.indexOf(this.value);
    province.code = provinces[province.index].code;
    province.term = provinces[province.index].term;
    // GET PROVINCE GEOJSON 🍁🌐 ___________________________
    getJson(
      "https://geogratis.gc.ca/services/geoname/en/geonames.geojson?concise=PROV&province=" +
        province.code
    ).then((provinceGeojson) => {
      geoJson.current = provinceGeojson;
      let id = province.term;
      loadGeojson(map.current, geoJson.current, "geoJson");
      geoJson.source = map.current.getSource("geoJson");
      geoJson.fill = map.current.getLayer("geoJson-fill");
      geoJson.outline = map.current.getLayer("geoJson-outline");
      isolateSelector(selectors, "city-select", "style-select");
    });

    // GET CITY 🏙️ _____________________________________________________________________________
    const cityNames = [];
    const citySelect = document.getElementById("city-select");
    getJson(
      "https://geogratis.gc.ca/services/geoname/en/geonames.json?province=" +
        province.code +
        "&concise=CITY"
    ).then((jsonCity) => {
      const cityItems = jsonCity.items;
      let selectedCity = "";
      while (citySelect.childElementCount > 1) {
        citySelect.removeChild(citySelect.lastChild);
      } //Clear cityItems
      cityItems.forEach((cityItem) => {
        cityNames.push(cityItem.name);
        let option = document.createElement("option");
        option.innerHTML = cityItem.name;
        citySelect.appendChild(option);
        sortChildren(citySelect);
      });
      citySelect.addEventListener("change", function () {
        const selectedCityIndex = cityNames.indexOf(this.value);
        selectedCity = cityItems[selectedCityIndex];
        city.name = selectedCity.name;
        // GET CITY GEOJSON 🏙️🌐 _________________________
        getJson(
          "https://geogratis.gc.ca/services/geoname/en/geonames.geojson?q=" +
            city.name +
            "&concise=CITY&province=" +
            province.code
        ).then((cityGeojson) => {
          isolateSelector(selectors, "site-select", "style-select");
          isolateSelector(toolbar, "osm", "go-to", "lng", "lat");
          geoJson.current = cityGeojson;
          geoJson.bbox = turf.bbox(cityGeojson);
          map.current.fitBounds(geoJson.bbox);
          geoJson.source.setData(geoJson.current);
          document
            .getElementById("site-select")
            .addEventListener("click", function () {
              removeGeojson(map.current, "geoJson");
            });
        });
      });
    });
  });

// FUNCTIONS _____________________________________________________________________________________________________

async function getJson(path) {
  let response = await fetch(path);
  let json = await response.json();
  return json;
}

async function loadGeojson(map, geojson, id) {
  const source = { type: "geojson", data: geojson };
  map.addSource(id, source);
  // Add a new layer to visualize the polygon.
  map.addLayer({
    id: `${id}-fill`,
    type: "fill",
    source: id, // reference the data source
    layout: {},
    paint: {
      "fill-color": "#0080ff", // blue color fill
      "fill-opacity": 0.1,
    },
  });
  // Add a black outline around the polygon.
  map.addLayer({
    id: `${id}-outline`,
    type: "line",
    source: id,
    layout: {},
    paint: {
      "line-color": "#000",
      "line-width": 2,
    },
  });
  geoJson.bbox = turf.bbox(geojson);
  map.fitBounds(geoJson.bbox);
}

function removeGeojson(map, geoJson) {
  if (map.getSource("geoJson") !== undefined) {
    map.removeLayer("geoJson-fill");
    map.removeLayer("geoJson-outline");
    map.removeSource("geoJson");
  }
}

function isolateSelector(selectors, ...keys) {
  selectors.forEach((selector) => {
    if (keys.includes(selector.id)) {
      selector.style.display = "inline-block";
    } else {
      selector.style.display = "none";
    }
  });
}
// ADD DEM TERRAIN 🏔️
function addTerrain(map) {
  map.addSource("mapbox-dem", {
    type: "raster-dem",
    url: "mapbox://mapbox.mapbox-terrain-dem-v1",
    tileSize: 512,
    maxzoom: 14,
  });
  // add the DEM source as a terrain layer with exaggerated height
  map.setTerrain({ source: "mapbox-dem", exaggeration: 1 });
}

// LOAD OSM BUILDING 🏢
function loadOSM(map, opacity = 0.9) {
  // Insert the layer beneath any symbol layer.
  const layers = map.getStyle().layers;
  const labelLayerId = layers.find(
    (layer) => layer.type === "symbol" && layer.layout["text-field"]
  ).id;  

  // perc2color(((["get", "height"] - 3) * 100) / (66 - 3))
  map.addLayer(
    {
      id: "OSM-buildings",
      source: "composite",
      effects: ['shadows'],
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 13,
      paint: {
        "fill-extrusion-color":  
        ["match", 
        ["get", "height"],
        [3,66,], 
        "#aaa",
        "#aaa",
    ],
        "fill-extrusion-height": 
        ["match", 
        ["get", "height"],
        [3,66], 
        ["*", 1, ["get", "height"]],
        ["*", 1, ["get", "height"]],
    ],
        "fill-extrusion-base": ["get", "min_height"],
        "fill-extrusion-opacity": 0.9,
      },
    },
    labelLayerId
  );
}

function sortChildren(parent) {
  const items = Array.prototype.slice.call(parent.children);
  items.sort(function (a, b) {
    return a.textContent.localeCompare(b.textContent);
  });
  items.forEach((item) => {
    const itemParent = item.parentNode;
    let detatchedItem = itemParent.removeChild(item);
    itemParent.appendChild(detatchedItem);
  });
}

function perc2color(perc) {
  let r,
    g,
    b = 0;
  if (perc < 50) {
    r = 255;
    g = Math.round(5.1 * perc);
  } else {
    g = 255;
    r = Math.round(510 - 5.1 * perc);
  }
  let h = r * 0x10000 + g * 0x100 + b * 0x1;
  return "#" + ("000000" + h.toString(16)).slice(-6);
}

