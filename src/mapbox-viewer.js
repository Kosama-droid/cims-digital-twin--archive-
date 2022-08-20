import canada from "../static/data/canada.js";
import { mapStyles } from "../static/map-styles.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  AmbientLight,
  DirectionalLight,
  Scene,
  Group,
  PerspectiveCamera,
  WebGLRenderer,
  Matrix4,
  Vector3,
  Vector4,
  AxesHelper,
  Raycaster,
} from "three";

// import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

import {
getJson,
sortChildren,
isolateSelector, 
hideElementsById,
closeNavBar,
selectedButton,
unhideElementsById,
highlightMaterial,
createOptions
} from "../modules/cims-dt-api"


// GLOBAL OBJECTS 🌎  _________________________________________________________________________________________
const selectors = Array.from(document.getElementById("selectors").children);
const toolbar = Array.from(document.getElementById("toolbar").children);

hideElementsById(
  "city-select",
  "site-select",
  "building-select",
  "osm",
  "trees",
  "bus-stops"
);

let scene,
  map,
  three,
  camera,
  renderer,
  raycaster,
  intersections,
  gltfMasses,
  sites,
  siteMarkers;

// Favourite sites ⭐⭐⭐⭐⭐⭐⭐
let carleton = canada.provinces.ON.cities.Ottawa.sites.CDC;
let parliament = canada.provinces.ON.cities.Ottawa.sites.PB;
let downsview = canada.provinces.ON.cities.Toronto.sites.DA;
let def = carleton;

let province = { term: "ON" };
let city = { name: "Ottawa" };
let site = { id: "CDC" };
let building = { id: "VS" };

// Selectors 🧲
const buildingSelector = document.getElementById("building-select");

// Layers 🍰
const layerButton = document.getElementById("layers");
let layersToggle = true;
layerButton.onclick = () => {
  layersToggle = !layersToggle;
  selectedButton(layerButton, layersToggle);
  layersToggle
    ? document.getElementById("toolbar").classList.remove("hidden")
    : document.getElementById("toolbar").classList.add("hidden");
};

// Buses 🚍
const busStopButton = document.getElementById("bus-stops");
let busStopToggle = false;
toggleCustomLayer(
  busStopButton,
  busStopToggle,
  "busStops"
);

// Trees 🌳
const treesButton = document.getElementById("trees");
let treesToggle = false;
toggleCustomLayer(
  treesButton,
  treesToggle,
  "trees"
);

// Set model oringin from WGS coordinates to Three (0,0,0)
let modelOrigin,
  modelAltitude,
  modelRotate,
  modelAsMercatorCoordinate,
  modelTransform;
setModelOrigin(def);

let previousSelection = {
  mesh: null,
  material: null,
};

const mouse = new Vector4(-1000, -1000, 1, 1);

let locGeojason = { source: { id: false } };
let masses = [];
let lng = { canada: canada.lng, current: def.coordinates.lng },
  lat = { canada: canada.lat, current: def.coordinates.lat };

closeNavBar();

// Setting Mapbox 🗺️📦
mapbox()

// Open Street Map buildings 🏢🏢🏢
const osmButton = document.getElementById("osm");
let toggleOSM = true;

// Select map style 🗺️🎨 
const styleSelect = document.getElementById("style-select");
createOptions(styleSelect, mapStyles)
styleSelect.addEventListener("change", function (event) {
  let style = event.target[event.target.selectedIndex].id;
  const url = mapStyles[style].url;
  map.setStyle(url);
  event.target.selectedIndex = 0;
});

// Navigate Canada 🛬🍁 _________________________________________________________
flyToCanada();
// Province ➡️________________
let provinceSelector = document.getElementById("province-select");
createOptions(provinceSelector, canada.provinces);
provinceSelector.addEventListener("change", (event) => {
  removeMarker(siteMarkers);
  let term = event.target[event.target.selectedIndex].id;
  province = canada.provinces[term];
  let url = `https://geogratis.gc.ca/services/geoname/en/geonames.geojson?concise=${province.concise}&province=${province.code}`;
  locGeojason = getGeojson(province, url, map, locGeojason);
  getCities(province.code);
  unhideElementsById("city-select");
  event.target.selectedIndex = 0;
});
// City ➡️________________
document.getElementById("city-select").addEventListener("change", (event) => {
  removeMarker(siteMarkers);
  let cityName = event.target[event.target.selectedIndex].id;
  city = canada.provinces[province.term].cities[cityName];
  if (!city) city = { name: cityName };
  url = `https://geogratis.gc.ca/services/geoname/en/geonames.geojson?q=${cityName}&concise=CITY&province=${province.code}`;
  locGeojason = getGeojson(cityName, url, map, locGeojason);
  if (!city.hasOwnProperty("sites")) {
    unhideElementsById("province-select");
    infoMessage(`⚠️ No sites at ${cityName}`);
  } else {
    hideElementsById("province-select", "building-select");
    unhideElementsById("site-select");
    sites = city.sites;
    siteMarkers = siteMarker(sites);
    createOptions(siteSelector, sites);
  }
  event.target.selectedIndex = 0;
});

// Site ➡️________________
let siteSelector = document.getElementById("site-select");
createOptions(siteSelector, sites);
siteSelector.addEventListener("change", (event) => {
  sites = city.sites;
  removeMarker(siteMarkers);
  removeGeojson(locGeojason);
  id = event.target[event.target.selectedIndex].id;
  site = sites[id];
  setSite(site, province.term, city.name);
  event.target.selectedIndex = 0;
});

// THREE JS 3️⃣  ________________________________________________________________________
// configuration of the custom layer for a 3D models per the CustomLayerInterface
const customLayer = {
  id: "three-scene",
  type: "custom",
  renderingMode: "3d",
  onAdd: function (map, gl) {
    camera = new PerspectiveCamera();
    scene = new Scene();
    const axes = new AxesHelper(10);
    axes.material.depthTest = false;
    axes.renderOrder = 3;
    scene.add(axes);

    // Go To Site 🛬__________________________________________________
    const goToButton = document.getElementById("go-to");
    goToButton.addEventListener("click", () => {
      goTo(def);
    });

    // create three.js lights to illuminate the model
    const lightColor = 0xffffff;
    const ambientLight = new AmbientLight(lightColor, 0.2);
    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(lightColor, 0.9);
    directionalLight.position.set(0, 400, 600).normalize();
    scene.add(directionalLight);

    // use the Mapbox GL JS map canvas for three.js
    renderer = new WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true,
    });
    renderer.autoClear = false;

    raycaster = new Raycaster();
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

    camera.projectionMatrix = m.multiply(l);
    renderer.resetState();
    renderer.render(scene, camera);
    map.triggerRepaint();

    const freeCamera = map.getFreeCameraOptions();
    let cameraPosition = new Vector4(
      freeCamera.position.x,
      freeCamera.position.y,
      freeCamera.position.z,
      1
    );
    cameraPosition.applyMatrix4(l.invert());
    let direction = mouse
      .clone()
      .applyMatrix4(camera.projectionMatrix.clone().invert());
    direction.divideScalar(direction.w);
    raycaster.set(cameraPosition, direction.sub(cameraPosition).normalize());

    intersections = raycaster.intersectObjects(masses);

    setIntesections()

    renderer.render(scene, camera);
  },
};

map.on("dblclick", () => {
  if (!gltfMasses || !gltfMasses.selected) return;
  building.id = gltfMasses.selected.id;
  openBimViewer(building);
});
closeBimViewer();

map.on("wheel", () => {
  removeGeojson(locGeojason);
});

map.on("style.load", function () {
  map.addLayer(customLayer, "waterway-label");
  if (three) setSite(site, province.term, city.name);
});

document.addEventListener("keydown", (event) => {
  three = true;
  const keyName = event.key;
  if (keyName === "c") {
    province = canada.provinces.ON;
    city = province.cities.Ottawa;
    site = carleton;
    setSite(site, "ON", "Ottawa");
    return;
  }
  if (keyName === "p") {
    province = canada.provinces.ON;
    city = province.cities.Ottawa;
    site = parliament;
    setSite(site, "ON", "Ottawa");
    return;
  }
  if (keyName === "d") {
    province = canada.provinces.ON;
    city = province.cities.Ottawa;
    site = downsview;
    setSite(site, "ON", "Toronto");
    return;
  }
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

function flyToSite(site, pitch = 50) {
  map.flyTo({
    center: [site.coordinates.lng, site.coordinates.lat],
    zoom: site.coordinates.zoom,
    pitch: pitch,
    duration: 2000,
  });
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
  locGeojason.bbox = turf.bbox(geojson);
  map.fitBounds(locGeojason.bbox);
}

function removeGeojson(locGeojason) {
  if (map.getSource(locGeojason.source.id)) {
    map.removeLayer(locGeojason.fill.id);
    map.removeLayer(locGeojason.outline.id);
    map.removeSource(locGeojason.source.id);
  }
  locGeojason = { source: { id: false } };
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
// let osmHeight = 1 *
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
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      // filter: ["{elementId} === 671842709", "extrude", "false"],
      type: "fill-extrusion",
      minzoom: 13,
      paint: {
        "fill-extrusion-color": "#aaa",
        "fill-extrusion-height": ["get", "height"],
        "fill-extrusion-base": ["get", "min_height"],
        "fill-extrusion-opacity": opacity,
      },
    },
    labelLayerId
  );
}

// Raycasting
function getMousePosition(event) {
  mouse.x = (event.point.x / map.transform.width) * 2 - 1;
  mouse.y = 1 - (event.point.y / map.transform.height) * 2;
}

function hasNotCollided(intersections) {
  return intersections.length === 0;
}

function highlightItem(item) {
  item.object.material = highlightMaterial;
  item.object.visible = true;
  gltfMasses.selected = item;
  gltfMasses.selected.id = item.object.name;
}

function isPreviousSeletion(item) {
  return previousSelection.mesh === item.object;
}

function restorePreviousSelection() {
  if (previousSelection.mesh) {
    previousSelection.mesh.material = previousSelection.material;
    previousSelection.mesh.visible = false;
    previousSelection.mesh = null;
    previousSelection.material = null;
  }
}

function savePreviousSelectio(item) {
  previousSelection.mesh = item.object;
  previousSelection.material = item.object.material;
}

function openBimViewer(building) {
  hideSelectors();
  let bimContainer;
  bimContainer = document.getElementById("bim-container");
  bimViewer = document.getElementById("bim-viewer");
  if (!bimViewer) {
    bimViewer = document.createElement("iframe");
    bimViewer.setAttribute("id", "bim-viewer");
    bimViewer.classList.add("bim-viewer");
    bimContainer.appendChild(bimViewer);
  }
  let url = `./bim-viewer.html?id=${province.term}/${city.name}/${site.id}/${building.id}`;
  bimViewer.setAttribute("src", url);
  document.getElementById("close-bim-viewer").classList.remove("hidden");
}

function getCities(provinceCode) {
  citySelect = document.getElementById("city-select");
  getJson(
    `https://geogratis.gc.ca/services/geoname/en/geonames.json?province=${provinceCode}&concise=CITY`
  ).then((jsonCity) => {
    const cityItems = jsonCity.items;
    while (citySelect.childElementCount > 1) {
      citySelect.removeChild(citySelect.lastChild);
    }
    cityItems.forEach((cityItem) => {
      let cityName = cityItem.name;
      let option = document.createElement("option");
      option.innerHTML = cityName;
      option.setAttribute("id", cityName);
      citySelect.appendChild(option);
      sortChildren(citySelect);
    });
  });
}

function infoMessage(message, seconds = 6) {
  let container = document.getElementById("message");
  container.innerHTML = message;
  container.classList.remove("hidden");
  setTimeout(() => container.classList.add("hidden"), seconds * 1000);
}

function getGeojson(id, url, map, locGeojason) {
  removeGeojson(locGeojason);
  locGeojason = { fill: "", outline: "" };
  getJson(url).then((geojson) => {
    locGeojason.current = geojson;
    loadGeojson(map, locGeojason.current, `${id}-locGeojason`);
    locGeojason.source = map.getSource(`${id}-locGeojason`);
    locGeojason.fill = map.getLayer(`${id}-locGeojason-fill`);
    locGeojason.outline = map.getLayer(`${id}-locGeojason-outline`);
  });
  return locGeojason;
}

function loadBldsGltf(site) {
  site.id = site.id;
  const group = new Group();
  group.name = `${site.id}-buildings`;
  const gltfloader = new GLTFLoader();
  let buildings = site.buildings;
  let buildingGltf;
  let loadingContainer = document.getElementById("loader-container");
  let progressText = document.getElementById("progress-text");
  const categories = ["roofs", "walls", "slabs", "curtainwalls", "windows"];
  categories.forEach((category) => {
    for (const id in buildings) {
      let gltfPath = `${site.gltfPath}${id}_${category}_allFloors.gltf`;
      gltfloader.load(
        gltfPath,
        (gltf) => {
          buildingGltf = gltf.scene;
          buildingGltf.name = `${id}-${category}`;
          scene.getObjectByName(`${site.id}-buildings`).add(buildingGltf);
          loadingContainer.style.display = "none";
        },
        () => {
          loadingContainer.style.display = "flex";
          progressText.textContent = `Loading ${site.name}'s buildings`;
        },
        (error) => {
          return;
        }
      );
    }
  });
  if (!scene.getObjectByName(`${site.id}-buildings`)) scene.add(group);
}

// Show OSM buildings 🏢
function osmVisibility(map, toggle) {
  osmButton.onclick = () => {
    let layer = map.getLayer("OSM-buildings");
    if (toggle) {
      loadOSM(map, 0.9);
      this.setAttribute("title", "Hide OSM Buildings");
    } else {
      map.removeLayer("OSM-buildings");
    }
    toggle = !toggle;
  };
}

function closeBimViewer() {
  document.getElementById("close-bim-viewer").addEventListener("click", () => {
    unhideElementsById(
      "style-select",
      "city-select",
      "site-select",
      "building-select"
    );
    document.getElementById("bim-viewer").remove();
    document.getElementById("close-bim-viewer").classList.add("hidden");
  });
}

function bimViewer(building) {
  openBimViewer(building);
}

function flyToCanada() {
  document.getElementById("canada").addEventListener("click", () => {
    flyTo(map, lng.canada, lat.canada, 4, 0);
    map.fitBounds(canada.bbox);
    map.setStyle(mapStyles[1].url);
    isolateSelector(selectors, "province-select", "style-select");
    isolateSelector(toolbar, "go-to", "lng", "lat");
    setTimeout(function () {
      location.reload();
    }, 2000);
  });
}

function selectBuilding(selector) {
  selector.addEventListener("change", (event) => {
    let id = selector[selector.selectedIndex].id;
    building.id = id;
    openBimViewer(building);
    closeBimViewer();
    event.target.selectedIndex = 0;
  });
}

function loadMasses(masses, site, visible = true, x = 0, y = 0, z = 0) {
  // GLTF masses for hovering and raycasting
  const group = new Group();
  group.name = `${site.id}-masses`;
  let url = site.gltfMasses.url;
  const gltfloader = new GLTFLoader();
  gltfloader.load(url, (gltf) => {
    gltfMasses = gltf.scene;
    gltfMasses.name = `${site.id}-masses`;
    gltfMasses.position.x = x;
    gltfMasses.position.y = y;
    gltfMasses.position.z = z;
    if (!visible) {
      gltfMasses.traverse(function (object) {
        if (object.isMesh) {
          object.visible = visible;
          masses.push(object);
        }
      });
    }
    group.add(gltfMasses);
    if (!scene.getObjectByName(`${site.id}-masses`)) scene.add(group);
  });
}

function setModelOrigin(site) {
  let lng = site.coordinates.lng;
  let lat = site.coordinates.lat;
  let msl = site.coordinates.msl;

  modelOrigin = [lng, lat];
  modelAltitude = msl;
  modelRotate = [Math.PI / 2, 0, 0];
  modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
    modelOrigin,
    modelAltitude
  );

  modelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    /* Since the 3D model is in real world meters, a scale transform needs to be
    applied since the CustomLayerInterface expects units in MercatorCoordinates.*/
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
  };
}

function setSite(site, provinceTerm, cityName) {
  province = canada.provinces[provinceTerm];
  city = province.cities[cityName];
  if (province.cities) getCities(province.code);
  if (city.sites)
    createOptions(document.getElementById("site-select"), city.sites);
  removeFromScene();
  removeGeojson(locGeojason);
  setModelOrigin(site);
  flyToSite(site);
  hideElementsById("province-select", "lng", "lat", "go-to");
  unhideElementsById("city-select", "site-select", "osm", "trees", "bus-stops");
  masses = [];
  if (!site.hasOwnProperty("buildings")) {
    removeFromScene();
    infoMessage(`⚠️ No buildings at ${site.name}`);
    hideElementsById("lng", "lat", "building-select");
    unhideElementsById("osm");
    if (site.hasOwnProperty("gltfMasses")) {
      loadMasses(
        masses,
        site,
        true,
        site.gltfMasses.position.x,
        site.gltfMasses.position.y,
        site.gltfMasses.position.z
      );
    }
  } else {
    loadMasses(masses, site, false);
    loadBldsGltf(site);
    unhideElementsById("building-select");
    createOptions(buildingSelector, site.buildings);
    selectBuilding(buildingSelector);
  }
}

function removeFromScene() {
  let toRemove = scene.children.slice(3);
  if (toRemove.lenght === 0) return;
  toRemove.forEach((group) => {
    group.traverse(function (object) {
      if (object.isMesh) {
        object.geometry.dispose();
        object.material.dispose();
      }
    });
    scene.remove(group);
  });
}

function siteMarker(sites) {
  let markers = [];
  for (let key in sites) {
    site = sites[key];
    const el = document.createElement("div");
    el.className = "mapbox-marker";
    el.setAttribute("id", key);
    el.setAttribute("title", sites[key].name);
    if (site.logo)
      el.style.setProperty("background-image", `url(${site.logo})`);
    markers.push(el);
    el.addEventListener("click", (e) => {
      let id = e.target.id
      site = sites[id];
      setSite(site, province.term, city.name);
      markers.forEach((marker) => {
        marker.remove();
      });
    });
    new mapboxgl.Marker(el).setLngLat(site.coordinates).addTo(map);
  }
  return markers;
}

function toggleCustomLayer(button, toggle, layerName, radius) {
  button.onclick = () => {
    let layer = canada.provinces[province.term].cities[city.name].layers[layerName]
    let color = layer.color ? layer.color : "red";
    toggle = !toggle;
    if (typeof layer.geojson === 'function' && toggle) {
      layer.geojson(site).then((features) => {
        addCustomLayer(features, layerName, color, radius);
      });
    };  
      if (typeof layer.geojson !== 'function' && toggle) {
        layer.geojson.then((features) => {
          addCustomLayer(features, layerName, color, radius);
        });
    } if (!toggle) {
      map.removeLayer(`${layerName}-layer`);
      map.removeSource(layerName);
    }
  } 
}

function addCustomLayer(features, layerName, color, radius = 7) {
  map.addSource(layerName, {
    type: "geojson",
    // Use a URL for the value for the `data` property.
    data: features,
  });

  let popup;
  map.addLayer({
    id: `${layerName}-layer`,
    type: "circle",
    source: layerName,
    paint: {
      "circle-radius": radius,
      "circle-stroke-width": 2,
      "circle-color": color,
      "circle-stroke-color": "white",
    },
  });
  map.on("mouseenter", `${layerName}-layer`, function (e) {
    let feature = e.features[0];
    popup = new mapboxgl.Popup()
      .setLngLat(feature.geometry.coordinates)
      .setHTML(`<p>${feature.properties.title}</p>`)
      .addTo(map);
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", `${layerName}-layer`, function (e) {
    popup.remove();
    map.getCanvas().style.cursor = "";
  });
  map.on("click", `${layerName}-layer`, function (e) {
    let feature = e.features[0];
    new mapboxgl.Popup()
      .setLngLat(feature.geometry.coordinates)
      .setHTML(`<p>${feature.properties.title}</p>`)
      .addTo(map);
  });
}

function removeMarker(markers) {
  if (markers)
    markers.forEach((marker) => {
      marker.remove();
    });
}

function goTo(site) {
  if (
    !(
      document.getElementById("lng").value == "" ||
      document.getElementById("lat").value == ""
    )
  ) {
    def.coordinates.lng = document.getElementById("lng").value;
    def.current = document.getElementById("lat").value;
    delete def.buildings;
    delete def.gltfMasses;
    def.name = "this site";
  }
  setSite(site, province.term, city.name);
  removeGeojson(locGeojason);
}

function hideSelectors() {
  hideElementsById(
    "style-select",
    "province-select",
    "city-select",
    "site-select",
    "building-select"
  );
}

// MAPBOX 🗺️📦
function mapbox(){
  mapboxgl.accessToken =
    "pk.eyJ1Ijoibmljby1hcmVsbGFubyIsImEiOiJjbDU2bTA3cmkxa3JzM2luejI2dnd3bzJsIn0.lKKSghBtWMQdXszpTJN32Q";
  map = new mapboxgl.Map({
    container: "map", // container ID
    style: mapStyles.satellite_labels.url,
    center: [lng.canada, lat.canada], // starting position [lng, lat]
    zoom: 4, // starting zoom
    pitch: 0,
    antialias: true,
    doubleClickZoom: false,
    projection: "globe", // display the map as a 3D globe
  });
  map.fitBounds(canada.bbox);
  // Day sky
  map.on("style.load", () => {
    // Set the default atmosphere style
    // add sky styling with `setFog` that will show when the map is highly pitched
    map.setFog({
      "horizon-blend": 0.3,
      color: "#f8f0e3",
      "high-color": "#add8e6",
      "space-color": "#d8f2ff",
      "star-intensity": 0.0,
    });
    addTerrain(map);
    osmVisibility(map, toggleOSM);
    map.setTerrain({ source: "mapbox-dem", exaggeration: 1 });
    osmVisibility(map, toggleOSM);
  });
  }

  function setIntesections() {

    if (hasNotCollided(intersections)) {
      restorePreviousSelection();
      return;
    }
  
    const foundItem = intersections[0];
  
    if (isPreviousSeletion(foundItem)) return;
  
    restorePreviousSelection();
    savePreviousSelectio(foundItem);
    highlightItem(foundItem);
  }
  
  map.on("mousemove", (event) => {
    getMousePosition(event);
    map.triggerRepaint();
  });
