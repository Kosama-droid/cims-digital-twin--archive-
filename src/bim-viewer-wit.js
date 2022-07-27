import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  MOUSE,
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Matrix4,
  Box3,
  Sphere,
  Spherical,
  Raycaster,
  MathUtils,
  Clock,
  DirectionalLight,
  AmbientLight,
  AxesHelper,
  GridHelper,
  EdgesGeometry,
  LineBasicMaterial,
  MeshBasicMaterial,
  LineSegments,
} from "three";

import CameraControls from "camera-controls";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { IFCLoader } from "web-ifc-three/IFCLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from "three-mesh-bvh";

import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

import { buildingsNames, ifcFileName } from "../static/data/cdc-data.js";
import {
  updateSelectBldgMenu,
  createBuildingSelector,
  closeNavBar,
  toggleVisibility,
} from "../modules/twin.js";

// Get the URL parameter
const currentURL = window.location.href;
let currentUser = "User";
document.getElementById("user").addEventListener("change", () =>  currentUser = document.getElementById("user").value );
const url = new URL(currentURL);
const currentModelId = url.searchParams.get("id");

const loadingScreen = document.getElementById("loader-container");
const progressText = document.getElementById("progress-text");
const propsGUI = document.getElementById("ifc-property-menu-root");

const building = {
  current: { currentModelId },
  ifcFile: {},
  listed: {},
  loaded: {},
};

// GUI
const propertyMenu = document.getElementById("ifc-property-menu");
const propButton = document.getElementById("prop-button");
let toggleProp = false;
toggleVisibility(propertyMenu, propButton, toggleProp);

option.innerHTML = buildingsNames[currentModelId];
const listedBuildings = document.getElementById("listed-buildings");
createBuildingSelector(building, buildingsNames, listedBuildings);
updateSelectBldgMenu(building, currentModelId);

document
  .getElementById("building-select")
  .addEventListener("change", function () {
    let selectedOption = this[this.selectedIndex].id;
    let newURL = currentURL.slice(0, -2) + selectedOption;
    location.href = newURL;
  });
closeNavBar();

//Creates the Three.js scene
const scene = new Scene();

//Object to store the size of the viewport
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//Creates the camera (point of view of the user)
const camera = new PerspectiveCamera(75, size.width / size.height);
camera.position.z = 15;
camera.position.y = 25;
camera.position.x = 8;

//Creates the lights of the scene
const lightColor = 0xffffff;

const ambientLight = new AmbientLight(lightColor, 0.5);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(lightColor, 2);
directionalLight.position.set(0, 10, 0);
scene.add(directionalLight);

//Sets up the renderer, fetching the canvas of the HTML
const threeCanvas = document.getElementById("three-canvas");
const renderer = new WebGLRenderer({ canvas: threeCanvas, alpha: true });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xdddddd, 1);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(threeCanvas.clientWidth, threeCanvas.clientHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.pointerEvents = "none";
labelRenderer.domElement.style.top = "0";
document.body.appendChild(labelRenderer.domElement);

//Creates grids and axes in the scene
const grid = new GridHelper(50, 30);
// scene.add(grid);

const axes = new AxesHelper();
axes.material.depthTest = false;
axes.renderOrder = 1;
scene.add(axes);

// Controls
const subsetOfTHREE = {
  MOUSE,
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Matrix4,
  Spherical,
  Box3,
  Sphere,
  Raycaster,
  MathUtils: {
    DEG2RAD: MathUtils.DEG2RAD,
    clamp: MathUtils.clamp,
  },
};

CameraControls.install({ THREE: subsetOfTHREE });
const clock = new Clock();
const cameraControls = new CameraControls(camera, threeCanvas);
cameraControls.dollyToCursor = true;

cameraControls.setLookAt(50, 100, 100, 0, 0, 0);

//Animation loop

animate();

//Adjust the viewport to the size of the browser
window.addEventListener("resize", () => {
  (size.width = window.innerWidth), (size.height = window.innerHeight);
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
  labelRenderer.setSize(size.width, size.height);
});

function animate() {
  const delta = clock.getDelta();
  cameraControls.update(delta);

  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
  requestAnimationFrame(animate);
}

const ifcLoader = new IFCLoader();
ifcLoader.ifcManager.setWasmPath("../src/wasm/");
ifcLoader.ifcManager.setupThreeMeshBVH(
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast
);

// IFC Loading
const ifcURL = `https://cimsprojects.ca/CDC/CIMS-WebApp/assets/ontario/ottawa/carleton/ifc/${ifcFileName[currentModelId]}`;
// const ifcURL = `../static/public-ifc/${ifcFileName[currentModelId]}`;
const ifcModels = [];
loadBuildingIFC(ifcURL, ifcModels, currentModelId);

const raycaster = new Raycaster();
raycaster.firstHitOnly = true;
const mouse = new Vector2();

const hoverHighlihgtMateral = new MeshBasicMaterial({
  transparent: true,
  opacity: 0.6,
  color: 0xffff90,
  depthTest: false,
});

const pickHighlihgtMateral = new MeshBasicMaterial({
  transparent: true,
  opacity: 0.6,
  color: 0xffff30,
  depthTest: false,
});

let lastModel;

threeCanvas.ondblclick = (event) =>
  highlight(event, pickHighlihgtMateral, true);
threeCanvas.onmousemove = (event) =>
  highlight(event, hoverHighlihgtMateral, false);
threeCanvas.oncontextmenu = (event) => {
  labeling(event);
};

// FUNCTIONS _____________________________________________________________________________________________________

async function loadBuildingIFC(url, models, id) {
  await ifcLoader.ifcManager.setWasmPath("../src/wasm/");
  ifcLoader.load(
    url,
    (ifcModel) => {
      ifcModel.name = `ifc-${currentModelId}`;
      scene.add(ifcModel);
      loadingScreen.style.display = "none";
      const ifcBb = ifcModel.geometry.boundingBox;
      cameraControls.fitToBox(ifcBb, true);
      models.push(ifcModel);
    },
    (progress) => {
      loadingScreen.style.display = "flex";
      progressText.textContent = `Loading ${buildingsNames[id]}: ${Math.round(
        (progress.loaded * 100) / progress.total
      )}%`;
    },
    (error) => {
      console.log(error);
    }
  );
}

async function highlight(event, material, getProps) {
  const found = cast(event);
  const manager = ifcLoader.ifcManager;
  if (found) {
    const index = found.faceIndex;
    lastModel = found.object;
    const geometry = found.object.geometry;
    const ifc = ifcLoader.ifcManager;
    const id = ifc.getExpressId(geometry, index);

    if (getProps) {
      const modelID = found.object.modelID;
      const props = await manager.getItemProperties(modelID, id, true);
      const typeProps = await manager.getTypeProperties(modelID, id);

      console.log(typeProps);
      createPropertiesMenu(props);
    }

    manager.createSubset({
      modelID: found.object.modelID,
      material: material,
      ids: [id],
      scene,
      removePrevious: true,
    });
  } else if (lastModel) {
    manager.removeSubset(lastModel.modelID, material);
    lastModel = undefined;
  }
}

function getMousePosition(event) {
  mouse.x = (event.clientX / threeCanvas.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / threeCanvas.clientHeight) * 2 + 1;
}

function labeling(event) {
  getMousePosition(event);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(ifcModels);
  if (!intersects.length) return;
  const found = intersects[0];
  const collisionLocation = found.point;
  const message = window.prompt("Describe the issue:");

  if (!message) return;

  const container = document.createElement("div");
  container.className = "label-container canvas";

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "X";
  deleteButton.className = "delete-button hidden";
  container.appendChild(deleteButton);

  const label = document.createElement("p");
  label.textContent = `${currentUser}: ${message}`;
  label.classList.add("label");
  container.appendChild(label);

  const labelObject = new CSS2DObject(container);
  labelObject.position.copy(collisionLocation);
  scene.add(labelObject);

  deleteButton.onclick = () => {
    labelObject.removeFromParent();
    labelObject.element = null;
    container.remove();
  };

  container.onmouseenter = () => deleteButton.classList.remove("hidden");
  container.onmouseleave = () => deleteButton.classList.add("hidden");
}

function cast(event) {
  // Computes the position of the mouse on the screen
  const bounds = threeCanvas.getBoundingClientRect();

  const x1 = event.clientX - bounds.left;
  const x2 = bounds.right - bounds.left;
  mouse.x = (x1 / x2) * 2 - 1;

  const y1 = event.clientY - bounds.top;
  const y2 = bounds.bottom - bounds.top;
  mouse.y = -(y1 / y2) * 2 + 1;

  // Places it on the camera pointing to the mouse
  raycaster.setFromCamera(mouse, camera);

  // Casts a ray
  const found = raycaster.intersectObjects(ifcModels)[0];
  return found;
}

function createPropertiesMenu(properties) {
  removeAllChildren(propsGUI);

  const psets = properties.psets;
  const mats = properties.mats;
  const type = properties.type;

  delete properties.psets;
  delete properties.mats;
  delete properties.type;

  for (let key in properties) {
    createPropertyEntry(key, properties[key]);
  }
}

function createPropertyEntry(key, value) {
  const propContainer = document.createElement("div");
  propContainer.classList.add("ifc-property-item");

  if (value === null || value === undefined) value = "undefined";
  else if (value.value) value = value.value;

  const keyElement = document.createElement("div");
  keyElement.textContent = key;
  propContainer.appendChild(keyElement);

  const valueElement = document.createElement("div");
  valueElement.classList.add("ifc-property-value");
  valueElement.textContent = value;
  propContainer.appendChild(valueElement);

  propsGUI.appendChild(propContainer);
}

function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// Debugging

// const gui = new GUI();
// gui.close();

// const min = -3;
// const max = 3;
// const step = 0.01;

// const transformationFolder = gui.addFolder("Transformation");
// const colorFolder = gui.addFolder("Colors");
// const colorParam = {
//   value: 0xff0000,
// };

// colorFolder
//   .addColor(colorParam, "value")
//   .name("Background Color")
//   .onChange(() => {
//     renderer.setClearColor(colorParam.value);
//   });
