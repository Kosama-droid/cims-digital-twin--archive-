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
const siteLoc = { lng: -75.69435, lat: 45.38435 };
const selectors = Array.from(document.getElementById("selectors").children);

isolateSelector(selectors, "province-select", "style-select");

const province = {},
  city = {},
  site = {},
  building = {},
  map = {},
  scene = {},
  geoJson = { fill: "", outline: "" },
  lng = { current: -98.74 },
  lat = { current: 56.415 },
  style = {};

// MAPBOX 🗺️📦 _________________________________________________________________________________________
mapboxgl.accessToken =
  "pk.eyJ1Ijoibmljby1hcmVsbGFubyIsImEiOiJjbDU2bTA3cmkxa3JzM2luejI2dnd3bzJsIn0.lKKSghBtWMQdXszpTJN32Q";
map.current = new mapboxgl.Map({
  container: "map", // container ID
  style: mapStyles[1].url,
  center: [lng.current, lat.current], // starting position [lng, lat]
  zoom: 4, // starting zoom
  pitch: 0,
  antialias: true,
  projection: "globe", // display the map as a 3D globe
});
// Day sky
map.current.on("style.load", () => {
  map.current.setFog({});
  loadOSM(map.current);
  addTerrain(map.current); // Set the default atmosphere style
});

// Select map style 🗺️🎨 ___________________________________________________
let styleNames = [];
mapStyles.forEach((style) => {
  styleNames.push(style.name);
});
styleNames.sort((a, b) => a.localeCompare(b));
mapStyles.sort((a, b) => a.name.localeCompare(b.name));
mapStyles.forEach((mapStyle) => {
  let option = document.createElement("option");
  option.innerHTML = mapStyle.name;
  document.getElementById("style-select").appendChild(option);
});
document.getElementById("style-select").addEventListener("change", function () {
  const selectedStyle = styleNames.indexOf(this.value);
  const url = mapStyles[selectedStyle].url;
  map.current.setStyle(url);
});

// Go To Site 🛬___________________________________________________
const goTo = document.getElementById("go-to");
let toggleGoTo = true;
goTo.onclick = function () {
  if (toggleGoTo) {
    // Select Building
    isolateSelector(selectors, "building-select", "file-input");
    this.setAttribute("title", "Go to Canada");
    document.getElementById("go-to-icon").setAttribute("d", icons.worldIcon);
    // Fly To Downsview flyTo(viewer, -79.47, 43.73, 1000, -45.0, 0);
    // Fly to Carleton
    flyTo(map.current, siteLoc.lng, siteLoc.lat);
    if (map.current.getSource("geoJson") !== undefined) {
      map.current.removeLayer("geoJson-fill");
      map.current.removeLayer("geoJson-outline");
      map.current.removeSource("geoJson");
    }
  } else {
    this.setAttribute("title", "Go to site");
    document.getElementById("go-to-icon").setAttribute("d", icons.goToIcon);
    // Fly to Canada
    flyTo(map.current, -98.74, 56.415, 3, 0);
    isolateSelector(selectors, "province-select");
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
    getJson(
      "https://geogratis.gc.ca/services/geoname/en/geonames.json?province=" +
        province.code +
        "&concise=CITY"
    ).then((jsonCity) => {
      const cityItems = jsonCity.items;
      let selectedCity = "";
      cityItems.sort((a, b) => a.name.localeCompare(b.name));
      while (document.getElementById("city-select").childElementCount > 1) {
        document
          .getElementById("city-select")
          .removeChild(document.getElementById("city-select").lastChild);
      } //Clear cityItems
      cityItems.forEach((cityItem) => {
        cityNames.push(cityItem.name);
        let option = document.createElement("option");
        option.innerHTML = cityItem.name;
        document.getElementById("city-select").appendChild(option);
      });
      document
        .getElementById("city-select")
        .addEventListener("change", function () {
          const selectedCyteIndex = cityNames.indexOf(this.value);
          selectedCity = cityItems[selectedCyteIndex];
          city.name = selectedCity.name;
          // GET CITY GEOJSON 🏙️🌐 _________________________
          getJson(
            "https://geogratis.gc.ca/services/geoname/en/geonames.geojson?q=" +
              city.name +
              "&concise=CITY&province=" +
              province.code
          ).then((cityGeojson) => {
            isolateSelector(selectors, "site-select", "style-select");
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

// GUI 🖱️ _____________________________________________________________
// Toggle Nav bar _____________________
const locationBar = document.getElementById("selectors");
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

const modelOrigin = [siteLoc.lng, siteLoc.lat];
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

// THREE JS 3️⃣ __________________________________________________________________
const THREE = window.THREE;
// configuration of the custom layer for a 3D model per the CustomLayerInterface
const customLayer = {
  id: "3d-model",
  type: "custom",
  renderingMode: "3d",
  onAdd: function (map, gl) {
    camera.current = new PerspectiveCamera();
    scene.current = new Scene();

    // create two three.js lights to illuminate the model
    const directionalLight = new DirectionalLight(0xffffff);
    directionalLight.position.set(0, -70, 100).normalize();
    scene.current.add(directionalLight);

    const directionalLight2 = new DirectionalLight(0xffffff);
    directionalLight2.position.set(0, 70, 100).normalize();
    scene.current.add(directionalLight2);
    scene.current = scene.current;

    // use the three.js GLTF loader to add the 3D model to the three.js scene
    //   const gltfloader = new GLTFLoader();
    // gltfloader.load(
    // '../static/public-glb/CDC-MASSES.glb',
    // (gltf) => {
    // scene.current.add(gltf.scene);
    // }
    // );
    // map.current = map;

    // Building select menu 🏢 _______________________________________________________
    let modelNames = [];
    models.forEach((model) => {
      modelNames.push(model.name);
    });
    modelNames.sort((a, b) => a.localeCompare(b));
    models.sort((a, b) => a.name.localeCompare(b.name));
    models.forEach((model) => {
      console.log(model);
      let option = document.createElement("option");
      option.innerHTML = model.name;
      document.getElementById("building-select").appendChild(option);
    });
    document
      .getElementById("building-select")
      .addEventListener("change", function () {
        building.current = models[modelNames.indexOf(this.value)];
        for (const model of models) {
          let buildingName = model.name;
          buildingName = buildingName.toUpperCase();
          buildingName = buildingName.replace(/ /g, "_");
          buildingName = buildingName.replace("BUILDING", "BLDG");
          const ifcFile = `CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-${buildingName}-AS_FOUND.ifc`;
          model.ifc = ifcFile;
        }
        let pageTitle = document.getElementById("model-title");

        // Sets up the IFC loading
        const ifcLoader = new IFCLoader();
        ifcLoader.ifcManager.setWasmPath("wasm/");

        // pageTitle.innerHTML = currentModel.name;
        pageTitle.innerHTML = building.current.name;
        const ifcFile = `../static/public-ifc/${building.current.ifc}`;
        ifcLoader.load(ifcFile, (ifcModel) => {
          console.log(ifcFile);
          scene.current.add(ifcModel);
        });
        // Load IFC file
        const input = document.getElementById("file-input");
        input.addEventListener("change", (changed) => {
          const file = changed.target.files[0];
          var ifcURL = URL.createObjectURL(file);
          ifcLoader.load(ifcURL, (ifcModel) => scene.current.add(ifcModel));
        });
      });
    // map.current = map;

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

    camera.current.projectionMatrix = m.multiply(l);
    this.renderer.resetState();
    this.renderer.render(scene.current, camera.current);
    map.current.triggerRepaint();
  },
};

map.current.on("style.load", () => {
  // map.current.addLayer(customLayer, "waterway-label");
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
  map.on("load", () => {
    map.addSource("mapbox-dem", {
      type: "raster-dem",
      url: "mapbox://mapbox.mapbox-terrain-dem-v1",
      tileSize: 512,
      maxzoom: 14,
    });
    // add the DEM source as a terrain layer with exaggerated height
    map.setTerrain({ source: "mapbox-dem", exaggeration: 1 });

    // add sky styling with `setFog` that will show when the map is highly pitched
    map.setFog({
      "horizon-blend": 0.3,
      color: "#f8f0e3",
      "high-color": "#add8e6",
      "space-color": "#d8f2ff",
      "star-intensity": 0.0,
    });
  });
}

// LOAD OSM BUILDING 🏢
function loadOSM(map, hide) {
  map.on("load", () => {
    const hide = [];
    // Insert the layer beneath any symbol layer.
    const layers = map.getStyle().layers;
    const labelLayerId = layers.find(
      (layer) => layer.type === "symbol" && layer.layout["text-field"]
    ).id;

    // The 'building' layer in the Mapbox Streets
    // vector tileset contains building height data
    // from OpenStreetmap.
    map.addLayer(
      {
        id: "add-3d-buildings",
        source: "composite",
        "source-layer": "building",
        filter: ["==", "extrude", "true"],
        type: "fill-extrusion",
        minzoom: 13,
        paint: {
          "fill-extrusion-color": "#aaa",

          // Use an 'interpolate' expression to
          // add a smooth transition effect to
          // the buildings as the user zooms in.
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
          "fill-extrusion-opacity": 0.9,
        },
      },
      labelLayerId
    );
  });
}
