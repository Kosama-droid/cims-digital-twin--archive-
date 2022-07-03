import { projects } from "../static/data/cdc-models.js";
import { IFCLoader } from "../node_modules/web-ifc-three";
// import { IfcViewerAPI } from '../node_modules/web-ifc-viewer';
import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  GridHelper,
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
const grid = new GridHelper(50, 30);
scene.add(grid);

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


for (const project of projects) {
  let buildingName = project.name
  buildingName = buildingName.toUpperCase()
  buildingName = buildingName.replace(/ /g, "_")
  buildingName = buildingName.replace("BUILDING", "BLDG");
  const ifcFile = `CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-${buildingName}-AS_FOUND.ifc`;
  project.ifc = ifcFile;
}

// Get the URL parameter
const currentURL = window.location.href;
const url = new URL(currentURL);
const currentProjectID = url.searchParams.get("id");

// Get the current project
const currentProject = projects.find(
  (project) => project.code == currentProjectID
);

const pageTitle = document.getElementById("model-title");

pageTitle.innerHTML = currentProject.name

// Load IFC to Scene
const ifcFile = `../static/public_ifc/${currentProject.ifc}`;
ifcLoader.load(ifcFile, (ifcModel) => {
  scene.add(ifcModel);
});

