import { models } from "../static/data/cdc-models.js";
import { IFCLoader } from "../node_modules/web-ifc-three";
// import { IfcViewerAPI } from '../node_modules/web-ifc-viewer';
import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "../node_modules/three";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls";

//Creates the Three.js scene
const scene = new Scene();

//Object to store the size of the viewport
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//Creates the camera (point of view of the user)
const aspect = size.width / size.height;
const camera = new PerspectiveCamera(40, aspect,1,100000);
camera.position.x = -350;
camera.position.y = 280;
camera.position.z = 350;

const cameraButton = document.getElementById("camera");
cameraToggle = true;
cameraButton.addEventListener("click", () => {
  if (cameraToggle) {
  console.log("WIP Ortho camera")
}
else{
  console.log("Perspective camera")
}
cameraToggle = !cameraToggle
});

//Creates the lights of the scene
const lightColor = 0xffffff;

const ambientLight = new AmbientLight(lightColor, 0.5);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(lightColor, 1);
directionalLight.position.set(0, 10, 0);
directionalLight.target.position.set(-5, 0, 0);
scene.add(directionalLight);
scene.add(directionalLight.target);

//Sets up the renderer, fetching the canvas of the HTML
const threeCanvas = document.getElementById("three-canvas");
const renderer = new WebGLRenderer({
  canvas: threeCanvas,
  alpha: true,
});

renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Creates grids and axes in the scene

const axes = new AxesHelper();
axes.material.depthTest = false;
axes.renderOrder = 1;
scene.add(axes);

//Creates the orbit controls (to navigate the scene)
const controls = new OrbitControls(camera, threeCanvas);
controls.enableDamping = true;
controls.target.set(-2, 0, 0);

//Animation loop
const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

//Adjust the viewport to the size of the browser
window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
});

// Sets up the IFC loading
const ifcLoader = new IFCLoader();
ifcLoader.ifcManager.setWasmPath("wasm/");


for (const model of models) {
  let buildingName = model.name
  buildingName = buildingName.toUpperCase()
  buildingName = buildingName.replace(/ /g, "_")
  buildingName = buildingName.replace("BUILDING", "BLDG");
  const ifcFile = `CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-${buildingName}-AS_FOUND.ifc`;
  model.ifc = ifcFile;
}

// Get the URL parameter
const currentURL = window.location.href;
const url = new URL(currentURL);
const currentModelID = url.searchParams.get("id");

// Get the current model
const currentModel = models.find(
  (model) => model.code == currentModelID
);

const pageTitle = document.getElementById("model-title");

if (currentModel !== undefined) {
  pageTitle.innerHTML = currentModel.name
  const ifcFile = `../static/public_ifc/${currentModel.ifc}`;
ifcLoader.load(ifcFile, (ifcModel) => {
  scene.add(ifcModel);
});}
  else{
    pageTitle.innerHTML = "Digital Twin"
  }

// Load IFC file
const input = document.getElementById("file-input");
  input.addEventListener(
    "change",
    (changed) => {
      const file = changed.target.files[0];
      var ifcURL = URL.createObjectURL(file);
      ifcLoader.load(
            ifcURL,
            (ifcModel) => scene.add(ifcModel));
    },
    false
  );

