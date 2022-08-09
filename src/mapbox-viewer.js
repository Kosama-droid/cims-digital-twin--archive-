import { canada } from "../static/data/canada.js";
import { icons } from "../static/icons.js";
import { mapStyles } from "../static/map-styles.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  AmbientLight,
  DirectionalLight,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Matrix4,
  Vector2,
  Vector3,
  Vector4,
  AxesHelper,
  MathUtils,
  GridHelper,
  Raycaster,
  CSS2DObject,
  MeshLambertMaterial,
  MeshStandardMaterial,
  MeshBasicMaterial,
  DoubleSide,
  FrontSide,
} from "three";

// import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

import {
  sortChildren,
  isolateSelector,
  closeNavBar,
} from "../modules/twin.js";

// GLOBAL OBJECTS 🌎  _________________________________________________________________________________________
const selectors = Array.from(document.getElementById("selectors").children);
const toolbar = Array.from(document.getElementById("toolbar").children);

isolateSelector(selectors, "province-select", "style-select");
isolateSelector(toolbar, "go-to", "coordinates");

let scene, map, camera, renderer, raycaster, gltfMasses;
let province, city, site;
let carleton = canada.ON.cities.Ottawa.sites.CU;

let previousSelection = {
  mesh: null,
  material: null,
};

const highlightMaterial = new MeshBasicMaterial({
  color: 0xcccc70,
  flatShading: true,
  side: DoubleSide,
  transparent: true,
  opacity: 0.9,
  depthTest: false,
});

const mouse = new Vector4(-1000, -1000, 1, 1);

let geoJson = {source:{id:false}}
const lng = { canada: -98.74 },
  lat = { canada: 56.415 },
  msl = { canada: 0 },
  masses = [];

closeNavBar();

// By default Carleton University → // Downsview  lng = 	-79.47247, lat = 43.73666
lng.current = -75.69435;
lat.current = 45.38435;
msl.current = 80;

// MAPBOX 🗺️📦 _________________________________________________________________________________________
mapboxgl.accessToken =
  "pk.eyJ1Ijoibmljby1hcmVsbGFubyIsImEiOiJjbDU2bTA3cmkxa3JzM2luejI2dnd3bzJsIn0.lKKSghBtWMQdXszpTJN32Q";
map = new mapboxgl.Map({
  container: "map", // container ID
  style: mapStyles[1].url,
  center: [lng.canada, lat.canada], // starting position [lng, lat]
  zoom: 4, // starting zoom
  pitch: 0,
  antialias: true,
  doubleClickZoom: false,
  projection: "globe", // display the map as a 3D globe
});
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
});

const osmButton = document.getElementById("osm");
let toggleOSM = true;

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
  map.setStyle(url);
  map.setTerrain({ source: "mapbox-dem", exaggeration: 1 });
  osmVisibility(map, toggleOSM);
});

// Show OSM buildings 🏢
function osmVisibility(map, toggle) {
  osmButton.onclick = function () {
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

// Go To Site 🛬___________________________________________________
const goTo = document.getElementById("go-to");

goTo.onclick = function () {
    // Building select menu 🏢 _______________________________________________________
    let buildings = carleton.buildings;
    const buildingSelector = document.getElementById("building-select");
    createOptions(buildingSelector, buildings);
    buildingSelector.addEventListener("change", () => {
      let id = buildingSelector[buildingSelector.selectedIndex].id;
      isolateSelector(selectors, "building-select");
      isolateSelector(toolbar, "");
      openBimViewer(id);
    });
    isolateSelector(selectors, "building-select", "style-select");
    isolateSelector(toolbar, "canada", "go-to", "osm");
    document.getElementById("go-to-icon").setAttribute("d", icons.worldIcon);

    if (document.getElementById("lng").value !== "") {
      lng.current = document.getElementById("lng").value;
    }
    if (document.getElementById("lat").value !== "") {
      lat.current = document.getElementById("lat").value;
    }
    if (document.getElementById("msl").value !== "") {
      msl.current = document.getElementById("msl").value;
    }

    flyTo(map, lng.current, lat.current);
    if (map.getSource("geoJson") !== undefined) {
      map.removeLayer("geoJson-fill");
      map.removeLayer("geoJson-outline");
      map.removeSource("geoJson");
    }
    headerMessage("Double click buildings to open BIM viewer");
    removeGeojson(map, geoJson)
};
// Fly to Canada or reset page🛬🍁 ____________________________________________________
document.getElementById('canada').addEventListener('click', () =>{
    flyTo(map, lng.canada, lat.canada, 4, 0);
    map.setStyle(mapStyles[1].url);
    isolateSelector(toolbar, "go-to", "coordinates");
    setTimeout(function () {
      location.reload();
    }, 2000);
})

// Navigate Canada 🍁 _________________________________________________________
// Province ➡️________________
let provinceSelector = document.getElementById("province-select");
createOptions(provinceSelector, canada);
provinceSelector.addEventListener("change", (event) => {
  province = event.target[event.target.selectedIndex].id;
  let code = canada[province].code;
  let url = `https://geogratis.gc.ca/services/geoname/en/geonames.geojson?concise=PROV&province=${code}`;
  geoJson = getGeojson(province, url, map, geoJson);
  getCities(code);
  isolateSelector(selectors, "province-select", "city-select", "style-select");
  isolateSelector(toolbar, "canada", "go-to", "coordinates");
  
  // City ➡️________________
  document.getElementById("city-select").addEventListener("change", (event) => {
    let cityName = event.target[event.target.selectedIndex].id;
    city = canada[province].cities[cityName]
      ? canada[province].cities[cityName]
      : cityName;
    url = `https://geogratis.gc.ca/services/geoname/en/geonames.geojson?q=${cityName}&concise=CITY&province=${code}`;
    geoJson = getGeojson(cityName, url, map, geoJson);
    if (!city.hasOwnProperty("sites")) {
      headerMessage(`⚠️ No sites at ${cityName}`);
      isolateSelector(
        selectors,
        "province-select",
        "city-select",
        "style-select"
      );
    } else {
      
      // Site ➡️________________
      let sites = city.sites;
      isolateSelector(selectors, "city-select", "site-select", "style-select");
      let siteSelector = document.getElementById("site-select");
      createOptions(siteSelector, sites);
      siteSelector.addEventListener("change", (event) => {
        sites = city.sites;
        if (map.getSource(geoJson.source.id)) {
          removeGeojson(map, geoJson);
        }
        id = event.target[event.target.selectedIndex].id;
        site = sites[id];
        lng.current = site.coordinates.lng;
        lat.current = site.coordinates.lat;
        msl.current = site.coordinates.msl;
        let zoom = site.coordinates.zoom;
        flyTo(map, lng.current, lat.current, zoom);
        if (!site.hasOwnProperty("buildings")) {
          headerMessage(`⚠️ No buildings at ${site.name}`);
          isolateSelector(
            selectors,
            "site-select",
            "style-select"
          )
        }
        else{
        
          // Building ➡️________________
          let buildings = site.buildings;
        isolateSelector(
          selectors,
          "site-select",
          "building-select",
        );
        let buildingSelector = document.getElementById("building-select");
        createOptions(buildingSelector, buildings);
        }
      });
    }
  });
});

const modelOrigin = [lng.current, lat.current];
const modelAltitude = msl.current;
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
// configuration of the custom layer for a 3D models per the CustomLayerInterface
const customLayer = {
  id: "3d-models",
  type: "custom",
  renderingMode: "3d",
  onAdd: function (map, gl) {
    camera = new PerspectiveCamera();
    scene = new Scene();
    const axes = new AxesHelper(10);
    axes.material.depthTest = false;
    axes.renderOrder = 3;
    scene.add(axes);

    // GLTF masses for hovering and raycasting
    const gltfloader = new GLTFLoader();
    gltfloader.load("../assets/ottawa/glb/CDC-MASSES.glb", (gltf) => {
      gltfMasses = gltf.scene;
      gltfMasses.name = "gltf-masses";
      gltfMasses.position.x = -485;
      gltfMasses.position.z = 435;
      gltfMasses.traverse(function (object) {
        if (object.isMesh) {
          // object.material = massesMaterial;
          object.visible = false;
          masses.push(object);
        }
      });
      scene.add(gltfMasses);

      // Show downtown buildings
      if (true) {
        gltfloader.load(
          "../assets/ottawa/glb/buildings-downtown.glb",
          (gltf) => {
            const buildings = gltf.scene;
            buildings.name = "buildings downtown";
            buildings.position.x = -485;
            buildings.position.z = 1286;
            buildings.position.y = -80;
            scene.add(buildings);
          }
        );
      }
    });

    let siteSelector = document.getElementById("site-select");
    siteSelector.addEventListener("change", (event) => {
      id = event.target[event.target.selectedIndex].id;
      console.log(province)
      console.log(city.name)
      let sites = canada[province].cities[city.name].sites;
      site = sites[id];
      lng.current = site.coordinates.lng;
      lat.current = site.coordinates.lat;
      msl.current = site.coordinates.msl;
      console.log("inside map", site)
      loadBldsGltf(site);
    });

    // function loadBldsGltf(site) {
    //   let buildings = site.buildings;
    //   let buildingGltf;
    //   const categories = ["walls", "curtainwalls", "roofs", "slabs", "windows"];
    //   categories.forEach((category) => {
    //     for (const id in buildings) {
    //       let gltfPath = `${site.gltfPath}${id}_${category}_allFloors.gltf`;
    //       gltfloader.load(gltfPath, (gltf) => {
    //         buildingGltf = gltf.scene;
    //         buildingGltf.name = `${id}-${category}`;
    //         scene.add(buildingGltf);
    //       });
    //     }
    //   });
    // }

    // const gui = new GUI();
    // gui.close();
    // const origingPosition = gui.addFolder("Origin position");
    // origingPosition
    //   .add(scene.position, "z", -1000, 1000, 1)
    //   .name("North-South");
    // origingPosition
    //   .add(scene.position, "x", -1000, 1000, 1)
    //   .name("West-East");
    // origingPosition
    //   .add(scene.position, "y", -1000, 1000, 1)
    //   .name("Height");
    // origingPosition
    //   .add(
    //     scene.rotation,
    //     "y",
    //     MathUtils.degToRad(-180),
    //     MathUtils.degToRad(180),
    //     MathUtils.degToRad(1)
    //   )
    //   .name("Rotate");

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

    const intersections = raycaster.intersectObjects(masses);

    if (hasNotCollided(intersections)) {
      restorePreviousSelection();
      return;
    }

    const foundItem = intersections[0];

    if (isPreviousSeletion(foundItem)) return;

    restorePreviousSelection();
    savePreviousSelectio(foundItem);
    highlightItem(foundItem);

    renderer.render(scene, camera);
  },
};

map.on("mousemove", (event) => {
  getMousePosition(event);
  map.triggerRepaint();
});

map.on("dblclick", () => {
  let id = gltfMasses.selected.id;
  isolateSelector(toolbar, "");
  openBimViewer(id);
});
document.getElementById("close-bim-viewer").addEventListener("click", () => {
  isolateSelector(selectors, "building-select");
  isolateSelector(toolbar, "canada", "go-to", "osm");
  document.getElementById("bim-viewer").remove();
  document.getElementById("close-bim-viewer").classList.add("hidden");
});

const bimViewerURL = "./bim-viewer.html";
let bimURL = "./bim-viewer.html";
map.on("click", () => {
  let id = gltfMasses.selected.id;
  bimURL = bimViewerURL + `?id=${id}`;
  document
    .getElementById("bim")
    .addEventListener("click", () => window.open(bimURL, "BIM-Viewer"));
  if (window.event.ctrlKey) {
    window.open(bimURL);
  }
});

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
  if (map.getSource(geoJson.source.id)) {
    map.removeLayer(geoJson.fill.id);
    map.removeLayer(geoJson.outline.id);
    map.removeSource(geoJson.source.id);
  }
  geoJson = {source:{id:false}}
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

function openBimViewer(id) {
  console.log(id);
  const bimContainer = document.getElementById("bim-container");
  const bimViewer = document.createElement("iframe");
  bimViewer.setAttribute("id", "bim-viewer");
  bimViewer.setAttribute("src", `./bim-viewer.html?id=${id}`);
  bimViewer.classList.add("bim-viewer");
  isolateSelector(selectors, "");
  bimContainer.appendChild(bimViewer);
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

function headerMessage(message, seconds = 6) {
  document.getElementById("message").innerHTML = message;
  setTimeout(
    () => (document.getElementById("message").innerHTML = ""),
    seconds * 1000
  );
}

function createOptions(selector, objects) {
  while (selector.childElementCount > 1) {
    selector.removeChild(selector.lastChild);
  }
  for (const object in objects) {
    const name = objects[object].name;
    let option = document.createElement("option");
    option.innerHTML = name;
    option.setAttribute("id", object);
    selector.appendChild(option);
    sortChildren(selector);
  }
}

function getGeojson(id, url, map, geoJson) {
  removeGeojson(map, geoJson);
  geoJson = { fill: "", outline: "" };
  getJson(url).then((geojson) => {
    geoJson.current = geojson;
    loadGeojson(map, geoJson.current, `${id}-geoJson`);
    geoJson.source = map.getSource(`${id}-geoJson`);
    geoJson.fill = map.getLayer(`${id}-geoJson-fill`);
    geoJson.outline = map.getLayer(`${id}-geoJson-outline`);
  });
  return geoJson;
}

function loadBldsGltf(site) {
  const gltfloader = new GLTFLoader();
  let buildings = site.buildings;
  let buildingGltf;
  let loadingContainer = document.getElementById("loader-container")
  let progressText = document.getElementById("progress-text")
  const categories = ["roofs", "walls", "slabs", "curtainwalls", "windows"];
  categories.forEach((category) => {
    for (const id in buildings) {
      let gltfPath = `${site.gltfPath}${id}_${category}_allFloors.gltf`;
      gltfloader.load(gltfPath, (gltf) => {
        buildingGltf = gltf.scene;
        buildingGltf.name = `${id}-${category}`;
        scene.add(buildingGltf);
        loadingContainer.style.display = "none";
      },
      (progress) => {
        loadingContainer.style.display = "flex";
        progressText.textContent = `Loading ${site.name}'s buildings`;
      },
      (error) => {
        return
        // console.log(error);
      });
    }
  });
}
