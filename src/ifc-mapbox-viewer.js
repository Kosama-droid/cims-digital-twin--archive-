import { canada } from "../static/data/canada.js";
import { icons } from "../static/icons.js";
import { mapStyles } from "../static/map-styles.js";
import { models } from "../static/data/cdc-models.js";

import { IFCLoader } from "../node_modules/web-ifc-three";
import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
// import { IfcViewerAPI } from '../node_modules/web-ifc-viewer';
import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Matrix4,
  Vector3,
} from "../node_modules/three";

const siteLoc = { lng: -75.69435, lat: 45.38435 };
let provinceSelect = document.getElementById("province-select"); // Select Cities
let citySelect = document.getElementById("city-select"); // Select Cities
let siteSelect = document.getElementById("site-select"); // Select Site
let buildingSelect = document.getElementById("building-select"); // Select Building
let current = { province: "", city: "",  site: "", building: ""}

mapboxgl.accessToken =
  "pk.eyJ1Ijoibmljby1hcmVsbGFubyIsImEiOiJjbDU2bTA3cmkxa3JzM2luejI2dnd3bzJsIn0.lKKSghBtWMQdXszpTJN32Q";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: mapStyles[3].url,
  center: [-98.74, 56.415], // starting position [lng, lat]
  zoom: 3, // starting zoom
  pitch: 0,
  antialias: true,
  // projection: "globe", // display the map as a 3D globe
});
// Day sky
map.on("style.load", () => {
  map.setFog({}); // Set the default atmosphere style
});
// Select map style 🗺️ ___________________________________________________
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
document.getElementById("style-select").addEventListener("change", function () {
  const selectedStyle = styleNames.indexOf(this.value);
  const url = mapStyles[selectedStyle].url;
  map.setStyle(url);
});

// Go To Site 🏢 ___________________________________________________
const goTo = document.getElementById("go-to");
let toggleGoTo = true;
goTo.onclick = function () {
  if (toggleGoTo) {
    this.setAttribute("title", "Go to Canada");
    document.getElementById("go-to-icon").setAttribute("d", icons.worldIcon);
    // Fly To Downsview flyTo(viewer, -79.47, 43.73, 1000, -45.0, 0);
    // Fly to Carleton
    flyTo(map, siteLoc.lng, siteLoc.lat);
    provinceSelect.style.display = "none";
    citySelect.style.display = "none";
    siteSelect.style.display = "none";
    buildingSelect.style.display = "inline-block";
    removeGeojson(map, current.province, "province");
    removeGeojson(map, current.city, "city");
  } else {
    this.setAttribute("title", "Go to site");
    document.getElementById("go-to-icon").setAttribute("d", icons.goToIcon);
    // Fly to Canada
    flyTo(map, -98.74, 56.415, 3, 0);
    provinceSelect.style.display = "inline-block";
    citySelect.style.display = "none";
    siteSelect.style.display = "none";
    buildingSelect.style.display = "none";
  }
  toggleGoTo = !toggleGoTo;
};

// Select province or Territory 🍁
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
  provinceSelect.appendChild(option);
});
document
  .getElementById("province-select")
  .addEventListener("change", function () {
    const provinceIndex = provinceNames.indexOf(this.value);
    const provinceCode = provinces[provinceIndex].code;
    current.province = provinces[provinceIndex].term;
    // GET PROVINCE GEOJSON 🌐
    getJson(
      "https://geogratis.gc.ca/services/geoname/en/geonames.geojson?concise=PROV&province=" +
        provinceCode
    ).then((provinceGeojson) => {
      loadGeojson(map, provinceGeojson, current.province);
      provinceSelect.style.display = "none";
      citySelect.style.display = "inline-block";
    });
  // GET CITY 🏙️
  const cityNames = [];
  getJson(
    "https://geogratis.gc.ca/services/geoname/en/geonames.json?province=" +
      provinceCode +
      "&concise=CITY"
  ).then((jsonCity) => {
    const cities = jsonCity.items;
    cities.sort((a, b) => a.name.localeCompare(b.name));
    let citySelect = document.getElementById("city-select");
    while (citySelect.childElementCount > 1) {
      citySelect.removeChild(citySelect.lastChild);
    } //Clear cities
    cities.forEach((city) => {
      cityNames.push(city.name);
      let option = document.createElement("option");
      option.innerHTML = city.name;
      citySelect.appendChild(option);
    });
    citySelect = document.getElementById("city-select");
    citySelect.addEventListener("change", function () {
      const cityIndex = cityNames.indexOf(this.value);
      city = cities[cityIndex];
      const { latitude, longitude } = city;
      current.city = city.name
      console.log(current.city)
      // GET CITY GEOJSON 🌐
      getJson(
        "https://geogratis.gc.ca/services/geoname/en/geonames.geojson?q=" +
        current.city +
          "&concise=CITY&province=" +
          provinceCode
      ).then((cityGeojson) => {
        removeGeojson(map, current.province)
        citySelect.style.display = "none";
        siteSelect.style.display = "inline-block";
        loadGeojson(map, cityGeojson, current.city);
        siteSelect = document.getElementById("site-select");
        siteSelect.addEventListener("click", function () {
          removeGeojson(map, current.city)
        });
      });
    });
  });
});

const modelOrigin = [siteLoc.lng, siteLoc.lat];
const modelAltitude = 15;
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

const THREE = window.THREE;
// configuration of the custom layer for a 3D model per the CustomLayerInterface

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

    // use the three.js GLTF loader to add the 3D model to the three.js scene
    //   const gltfloader = new GLTFLoader();
    // gltfloader.load(
    // '../static/public-glb/CDC-MASSES.glb',
    // (gltf) => {
    // this.scene.add(gltf.scene);
    // }
    // );
    // this.map = map;

    for (const model of models) {
      let buildingName = model.name;
      buildingName = buildingName.toUpperCase();
      buildingName = buildingName.replace(/ /g, "_");
      buildingName = buildingName.replace("BUILDING", "BLDG");
      const ifcFile = `CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-${buildingName}-AS_FOUND.ifc`;
      model.ifc = ifcFile;
    }
    // Get the URL parameter
    const currentURL = window.location.href;
    const url = new URL(currentURL);
    const currentModelID = url.searchParams.get("id");

    // Get the current model
    const currentModel = models.find((model) => model.code == currentModelID);

    const pageTitle = document.getElementById("model-title");

    // Sets up the IFC loading
    const ifcLoader = new IFCLoader();
    ifcLoader.ifcManager.setWasmPath("wasm/");

    if (currentModel !== undefined) {
      pageTitle.innerHTML = currentModel.name;
      const ifcFile = `../static/public_ifc/${currentModel.ifc}`;
      ifcLoader.load(ifcFile, (ifcModel) => {
        this.scene.add(ifcModel);
      });
    } else {
      pageTitle.innerHTML = "IFC Model";
    }
    // Load IFC file
    const input = document.getElementById("file-input");
    input.addEventListener(
      "change",
      (changed) => {
        const file = changed.target.files[0];
        var ifcURL = URL.createObjectURL(file);
        ifcLoader.load(ifcURL, (ifcModel) => this.scene.add(ifcModel));
      },
      false
    );
    this.map = map;

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
    this.map.triggerRepaint();
  },
};

map.on("style.load", () => {
  map.addLayer(customLayer, "waterway-label");
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

async function loadGeojson(map, geojson, id ) {
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
  const bbox = turf.bbox(geojson);
  map.fitBounds(bbox);
}

function removeGeojson(map, id, type) {
  try {
    map.removeLayer(`${id}-fill`);
    map.removeLayer(`${id}-outline`);
    map.removeSource(id);
  }
  catch {
    console.log("nothing to remove")
  }
}
