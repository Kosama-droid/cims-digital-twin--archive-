import { canada } from "../static/data/canada.js";
import { icons } from "../static/icons.js";
import { mapStyles } from "../static/map-styles.js";
import { models } from "../static/data/cdc-models.js";

import { IFCLoader } from "../node_modules/web-ifc-three";
import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
// import { IfcViewerAPI } from '../node_modules/web-ifc-viewer';
import {
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Matrix4,
  Vector3,
} from "../node_modules/three";

// GLOBAL OBJECTS 🌎  _________________________________________________________________________________________
const selectors = Array.from(document.getElementById("selectors").children);
const toolbar = Array.from(document.getElementById("toolbar").children);

isolateSelector(selectors, "province-select", "style-select");
isolateSelector(toolbar, "go-to", "lng", "lat")

const province = {},
  city = {},
  site = {},
  building = { loaded: {}, listed: {}, order: {} },
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
  center: [lng.canada, lat.canada], // starting position [lng, lat]
  zoom: 4, // starting zoom
  pitch: 0,
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
  } else {
    map.current.removeLayer("OSM-buildings");
  }
  toggleOSM = !toggleOSM;
};
// Building select menu 🏢 _______________________________________________________
const modelNames = [];
const listedBuildings = document.getElementById("listed-buildings");
const loadedBuildings = document.getElementById("loaded-buildings");
models.forEach((model) => {
  modelNames.push(model.name);
});
models.forEach((model) => {
  let option = document.createElement("option");
  option.setAttribute("id", model.code);
  building.listed[model.code] = model.name;
  option.innerHTML = model.name;
  listedBuildings.appendChild(option);
});
sortChildren(listedBuildings);
document
.getElementById("building-select")
.addEventListener("change", function () {
  isolateSelector(selectors, "building-select", "file-input");
  for (const model of models) {
    let buildingName = model.name;
    buildingName = buildingName.toUpperCase();
    buildingName = buildingName.replace(/ /g, "_");
    buildingName = buildingName.replace("BUILDING", "BLDG");
    const ifcFile = `CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-${buildingName}-AS_FOUND.ifc`;
    model.ifc = ifcFile;
  }
  let index = modelNames.indexOf(this.value);
  building.current = models[index];
  let currentOption = document.getElementById(building.current.code);
  if (!(building.current.code in building.loaded)) {
    delete building.listed[building.current.code];
    building.loaded[building.current.code] = building.current.name;
    loadedBuildings.appendChild(currentOption);
    sortChildren(loadedBuildings);
  } else {
    delete building.loaded[building.current.code];
    building.listed[building.current.code] = building.current.name;
    listedBuildings.appendChild(currentOption);
    sortChildren(listedBuildings);
  }
});


// Go To Site 🛬___________________________________________________
const goTo = document.getElementById("go-to");
let toggleGoTo = true;
goTo.onclick = function () {
  if (toggleGoTo) {
    // Select Building
    isolateSelector(selectors, "building-select", "file-input", "style-select");
    isolateSelector(toolbar, "perspective", "osm", "go-to", )
    this.setAttribute("title", "Go to Canada");
    document.getElementById("go-to-icon").setAttribute("d", icons.worldIcon);
    
    if (document.getElementById("lng").value !== ""){
      lng.current = document.getElementById("lng").value;
    };
    if (document.getElementById("lat").value !== ""){
      lat.current = document.getElementById("lat").value;
    };
    
    flyTo(map.current, lng.current, lat.current);
    if (map.current.getSource("geoJson") !== undefined) {
      map.current.removeLayer("geoJson-fill");
      map.current.removeLayer("geoJson-outline");
      map.current.removeSource("geoJson");
    }
  } else {
    this.setAttribute("title", "Go to site");
    document.getElementById("go-to-icon").setAttribute("d", icons.goToIcon);
    // Fly to Canada
    flyTo(map.current, lng.canada, lat.canada, 3, 0);
    isolateSelector(selectors, "province-select", "style-select");
    isolateSelector(toolbar, "go-to", "lng", "lat")
  }
  toggleGoTo = !toggleGoTo;
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
          isolateSelector(toolbar, "osm", "go-to", "lng", "lat")
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

const modelOrigin = [lng.current, lat.current];
const modelAltitude = 80;
const modelRotate = [Math.PI / 2, 0, 0];

const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
  modelOrigin,
  modelAltitude
);

const modelTransform = {
  translateX: modelAsMercatorCoordinate.x,
  translateY: modelAsMercatorCoordinate.y,
  translateZ: modelAsMercatorCoordinate.z,
  rotateX: modelRotate[0],
  rotateY: modelRotate[1],
  rotateZ: modelRotate[2],
  /* Since the 3D model is in real world meters, a scale transform needs to be
   * applied since the CustomLayerInterface expects units in MercatorCoordinates.
   */
  scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
};

// THREE JS 3️⃣  ________________________________________________________________________
const THREE = window.THREE;
// configuration of the custom layer for a 3D model per the CustomLayerInterface
const customLayer = {
  id: "3d-model",
  type: "custom",
  renderingMode: "3d",
  onAdd: function (map, gl) {
    this.camera = new PerspectiveCamera();
    this.scene = new Scene();

    // create two three.js lights to illuminate the model
    const directionalLight = new DirectionalLight(0xffffff);
    directionalLight.position.set(0, -70, 100).normalize();
    this.scene.add(directionalLight);

    const directionalLight2 = new DirectionalLight(0xffffff);
    directionalLight2.position.set(0, 70, 100).normalize();
    this.scene.add(directionalLight2);
    scene.current = this.scene;

    // three.js GLTF loader
    if (false) {
      const gltfloader = new GLTFLoader();
      gltfloader.load("../static/public-glb/CDC-MASSES.glb", (gltf) => {
        this.scene.add(gltf.scene);
      });
    }

    // Sets up the IFC loading
    const ifcLoader = new IFCLoader();
    ifcLoader.ifcManager.setWasmPath("wasm/");

    document
      .getElementById("building-select")
      .addEventListener("change", function () {
        console.log(building);
        if (building.current.code in building.loaded) {
          const ifcFile = `../static/public-ifc/${building.current.ifc}`;
          ifcLoader.load(ifcFile, (ifcModel) => {
            ifcModel.name = building.current.code;
            scene.current.add(ifcModel);
          });
        } else {
          console.log("listed")
          let mesh = scene.current.getObjectByName(building.current.code);
          scene.current.remove(mesh);
        }
        // Load IFC file
        const input = document.getElementById("file-input");
        input.addEventListener("change", (changed) => {
          const file = changed.target.files[0];
          var ifcURL = URL.createObjectURL(file);
          ifcLoader.load(ifcURL, (ifcModel) => scene.current.add(ifcModel));
        });
      });
    this.map = map.current;

    // use the Mapbox GL JS map canvas for three.js
    this.renderer = new WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true,
    });

    this.renderer.autoClear = false;
  },
  render: function (gl, matrix) {
    const rotationX = new Matrix4().makeRotationAxis(
      new Vector3(1, 0, 0),
      modelTransform.rotateX
    );
    const rotationY = new Matrix4().makeRotationAxis(
      new Vector3(0, 1, 0),
      modelTransform.rotateY
    );
    const rotationZ = new Matrix4().makeRotationAxis(
      new Vector3(0, 0, 1),
      modelTransform.rotateZ
    );

    const m = new Matrix4().fromArray(matrix);
    const l = new Matrix4()
      .makeTranslation(
        modelTransform.translateX,
        modelTransform.translateY,
        modelTransform.translateZ
      )
      .scale(
        new Vector3(
          modelTransform.scale,
          -modelTransform.scale,
          modelTransform.scale
        )
      )
      .multiply(rotationX)
      .multiply(rotationY)
      .multiply(rotationZ);

    this.camera.projectionMatrix = m.multiply(l);
    this.renderer.resetState();
    this.renderer.render(this.scene, this.camera);
    map.current.triggerRepaint();
  },
};

map.current.on("style.load", () => {
  map.current.addLayer(customLayer, "waterway-label");
});

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
  map.addLayer(
    {
      id: "OSM-buildings",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 13,
      paint: {
        "fill-extrusion-color": "#aaa",
        // 'interpolate' expression to smooth zoom transition
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          13,
          0,
          15.05,
          ["get", "height"],
        ],
        "fill-extrusion-base": [
          "interpolate",
          ["linear"],
          ["zoom"],
          13,
          0,
          15.05,
          ["get", "min_height"],
        ],
        "fill-extrusion-opacity": opacity,
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
