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
    MeshLambertMaterial,
    LineSegments,
  } from "three";
  import CameraControls from "camera-controls";
  
  import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
  
  import { IFCLoader } from "web-ifc-three/IFCLoader";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
  
  import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from "three-mesh-bvh";

  import {
    CSS2DRenderer,
    CSS2DObject,
  } from "three/examples/jsm/renderers/CSS2DRenderer.js";

 import { ifcFileName } from "../static/data/cdc-models.js";
  
 // Get the URL parameter
  const currentURL = window.location.href;
  const url = new URL(currentURL);
  const currentModelCode = url.searchParams.get("id");

  const loadingScreen = document.getElementById("loader-container");
  const progressText = document.getElementById("progress-text");
  let masses;
  
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
camera.position.y = 13;
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

//Creates grids and axes in the scene
const grid = new GridHelper(50, 30);
scene.add(grid);

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
});

function animate() {
  const delta = clock.getDelta();
  cameraControls.update(delta);

  renderer.render(scene, camera);
  // labelRenderer.render(scene, camera);
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
 const ifcURL = `https://cimsprojects.ca/CDC/CIMS-WebApp/assets/ontario/ottawa/carleton/ifc/${ifcFileName[currentModelCode]}`;
 // const ifcURL = `../static/public-ifc/${ifcFileName[currentModelCode]}`;
 const ifcModels = [];
 loadBuildingIFC(ifcURL, ifcModels);

const raycaster = new Raycaster();
raycaster.firstHitOnly = true;
const mouse = new Vector2();

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

const highlightMateral = new MeshLambertMaterial({
  transparent: true,
  opacity: 0.6,
  color: 0xff88ff,
  depthTest: false,
});

let lastModel;

function pick(event) {
  const found = cast(event);
  if (found) {
      const index = found.faceIndex;
      lastModel = found.object;
      const geometry = found.object.geometry;
      const ifc = ifcLoader.ifcManager;
      const id = ifc.getExpressId(geometry, index);

      ifcLoader.ifcManager.createSubset({
        modelID: found.object.modelID,
        material: highlightMateral,
        ids: [id],
        scene,
        removePrevious: true
      });
  }
  else if(lastModel) {
    ifcLoader.ifcManager.removeSubset(lastModel.modelID, highlightMateral)
    lastModel = undefined;
  }
}

threeCanvas.ondblclick = (event) => pick(event);
  
  // 8. Picking & Labeling
  
  // const raycaster = new Raycaster();
  // const mouse = new Vector2();
  
  // window.addEventListener("dblclick", (event) => {
  //   getMousePosition(event);
  
  //   raycaster.setFromCamera(mouse, camera);
  //   const intersects = raycaster.intersectObject(masses);
  
  //   if (!intersects.length) return;
  
  //   const found = intersects[0];
  
  //   const collisionLocation = found.point;
  
  //   const message = window.prompt("Describe the issue:");
  
  //   const container = document.createElement("div");
  //   container.className = "label-container";
  
  //   const deleteButton = document.createElement("button");
  //   deleteButton.textContent = "X";
  //   deleteButton.className = "delete-button hidden";
  //   container.appendChild(deleteButton);
  
  //   const label = document.createElement("p");
  //   label.textContent = `${found.object.name} : ${message}`;
  //   label.classList.add("label");
  //   container.appendChild(label)
    
  //   const labelObject = new CSS2DObject(container);
  //   labelObject.position.copy(collisionLocation);
  //   scene.add(labelObject);
  
  //   deleteButton.onclick = () => {
  //     labelObject.removeFromParent();
  //     labelObject.element = null;
  //     container.remove()
  //   }
  
  //   container.onmouseenter = () => deleteButton.classList.remove('hidden');
  //   container.onmouseleave = () => deleteButton.classList.add('hidden');
  
  // });
  
  // function getMousePosition(event) {
  //   mouse.x = (event.clientX / threeCanvas.clientWidth) * 2 - 1;
  //   mouse.y = -(event.clientY / threeCanvas.clientHeight) * 2 + 1;
  // }
  
  // 10 Debugging
  
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
  
// FUNCTIONS _____________________________________________________________________________________________________

  async function loadBuildingIFC(url, models) {
    await ifcLoader.ifcManager.setWasmPath("../src/wasm/");
    ifcLoader.load(
    url,
    (ifcModel) => {
      ifcModel.name = `ifc-${currentModelCode}`;
      scene.add(ifcModel);
      // loader.style.display = "none";
      models.push(ifcModel);
    },
    (progress) => {
      // loader.style.display = "flex";
      // progressText.textContent = `Loading ${ selectedOption }: ${Math.round((progress.loaded * 100) / progress.total)}%`;
    },
    (error) => {
      console.log(error);
    }
  );
  }