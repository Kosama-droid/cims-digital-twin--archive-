import { canada } from "../static/data/canada.js";
import { icons } from "../static/icons.js";
import { mapStyles } from "../static/map-styles.js";
import { models } from "../static/data/cdc-models.js";

initMapbox();

/* Mapbox renders maps and map tiles with Web Mercator projection 
using the EPSG:3857 projected coordinate system 
(sometimes called EPSG:900913)*/

function initMapbox() {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoibmljby1hcmVsbGFubyIsImEiOiJjbDU2bTA3cmkxa3JzM2luejI2dnd3bzJsIn0.lKKSghBtWMQdXszpTJN32Q";
  const map = new mapboxgl.Map({
    container: "mapboxContainer", // container ID
    style: mapStyles[0].url,
    center: [-98.74, 56.415], // starting position [lng, lat]
    zoom: 4, // starting zoom
    antialias: true,
    projection: "globe", // display the map as a 3D globe
  });
  // Day sky
  map.on("style.load", () => {
    map.setFog({}); // Set the default atmosphere style
  });

  // Select map style 🗺️
  let styleNames = [];
  mapStyles.forEach((style) => {
    styleNames.push(style.name);
  });
  styleNames.sort((a, b) => a.localeCompare(b));
  mapStyles.sort((a, b) => a.name.localeCompare(b.name));
  const styleSelect = document.getElementById("style-select");
  mapStyles.forEach((mapStyle) => {
    let option = document.createElement("option");
    option.innerHTML = mapStyle.name;
    styleSelect.appendChild(option);
  });
  document
    .getElementById("style-select")
    .addEventListener("change", function () {
      const selectedStyle = styleNames.indexOf(this.value);
      const url = mapStyles[selectedStyle].url;
      map.setStyle(url);
    });
  // Select province or Territory 🍁
  const provinceNames = [];
  const provinces = canada.provinces;
  const territories = canada.territories;
  territories.forEach((territory) => {
    provinces.push(territory);
  });
  const provinceSelect = document.getElementById("province-select");
  provinces.forEach((province) => {
    let option = document.createElement("option");
    option.innerHTML = province.provinceName;
    provinceNames.push(province.provinceName);
    provinceSelect.appendChild(option);
  });
  document
    .getElementById("province-select")
    .addEventListener("change", function () {
      const pIndex = provinceNames.indexOf(this.value);
      const pCode = provinces[pIndex].code;
      // GET PROVINCE GEOJSON 🌐
      getJson(
        "https://geogratis.gc.ca/services/geoname/en/geonames.geojson?concise=PROV&province=" +
          pCode
      ).then((pGeojson) => {
        console.log(pGeojson);
        map.addSource(pGeojson);
        console.log(map);
        citySelect.style.display = "inline-block";
      });
    });

  // Go To Site 🏢
  const goTo = document.getElementById("go-to");
  let toggleGoTo = true;
  goTo.onclick = function () {
    if (toggleGoTo) {
      this.setAttribute("title", "Go to Canada");
      document.getElementById("go-to-icon").setAttribute("d", icons.worldIcon);
      // Fly To Downsview flyTo(viewer, -79.47, 43.73, 1000, -45.0, 0);
      // Fly to Carleton
      flyTo(map, -75.697, 45.384);
      provinceSelect.style.display = "none";
      citySelect.style.display = "none";
      siteSelect.style.display = "none";
      buildingSelect.style.display = "inline-block";
    } else {
      this.setAttribute("title", "Go to site");
      document.getElementById("go-to-icon").setAttribute("d", icons.goToIcon);
      // Fly to Canada
      flyTo(map, -98.74, 56.415, 4, 0);
      provinceSelect.style.display = "inline-block";
      citySelect.style.display = "none";
      siteSelect.style.display = "none";
      buildingSelect.style.display = "none";
    }
    toggleGoTo = !toggleGoTo;
  };

  let modelNames = [];
  models.forEach((model) => {
    modelNames.push(model.name);
  });
  console.log(modelNames)
  modelNames.sort((a, b) => a.localeCompare(b));
  models.sort((a, b) => a.name.localeCompare(b.name));
  const buildingSelect = document.getElementById("building-select");
  models.forEach((model) => {
    let option = document.createElement("option");
    option.innerHTML = model.name;
    buildingSelect.appendChild(option);
  });
  document
    .getElementById("building-select")
    .addEventListener("change", function () {
      const selectedModel = modelNames.indexOf(this.value);
    });
}

// Toggle Nav bar
const locationBar = document.getElementById("location");
const locationButton = document.getElementById("close-nav-bar");
let toggleLocationBar = false;
locationButton.onclick = function () {
  locationBar.style.display = toggleLocationBar ? "inline-block" : "none";
  locationButton.style.transform = toggleLocationBar ? "" : "rotate(180deg)";
  const navBar = document.getElementById("nav-bar");
  navBar.style.backgroundColor = toggleLocationBar ? "" : "#FFFFFF00";
  navBar.style.boxShadow = toggleLocationBar ? "" : "none";
  toggleLocationBar = !toggleLocationBar;
};

let citySelect = document.getElementById("city-select"); // Select Cities
let siteSelect = document.getElementById("site-select"); // Select Site
let buildingSelect = document.getElementById("building-select"); // Select Building

// FUNCTIONS _____________________________________________________________________________________________________

function flyTo(map, lng, lat, zoom = 15, pitch = 50) {
  map.flyTo({
    center: [lng, lat],
    zoom: zoom,
    pitch: pitch,
    duration: 2000,
  });
}

async function getJson(path) {
  let response = await fetch(path);
  let json = await response.json();
  return json;
}

//   async function loadGeojson(geojson, viewer) {
//     const fillPromise = Cesium.GeoJsonDataSource.load(geojson, {
//       fill: Cesium.Color.fromBytes(251, 184, 41, 50),
//       clampToGround: true,
//     });
//     fillPromise.then(function (dataSource) {
//       viewer.dataSources.add(dataSource);
//       const entities = dataSource.entities.values;
//       viewer.flyTo(entities);
//     });
//   }
