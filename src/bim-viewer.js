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
    LineSegments,
  } from "three";
  import CameraControls from "camera-controls";
  
  import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
  
  import { IFCLoader } from "web-ifc-three/IFCLoader";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
  
  // 1. The Scene
  const scene = new Scene();
  const canvas = document.getElementById("three-canvas");
  
  import {
    CSS2DRenderer,
    CSS2DObject,
  } from "three/examples/jsm/renderers/CSS2DRenderer.js";
  
  import { models, ifcFileName } from "../static/data/cdc-models.js";
  
  // Get the URL parameter
  const currentURL = window.location.href;
  const url = new URL(currentURL);
  const currentModelCode = url.searchParams.get("id");
  
  // // Get the current project
  // const currentProject = models.find(project => project.id == currentModelCode);
  
  const axes = new AxesHelper();
  axes.material.depthTest = false;
  axes.renderOrder = 2;
  scene.add(axes);
  
  const grid = new GridHelper();
  scene.add(grid);
  
  // 2. The object
  
  // const loader = new GLTFLoader();
  const ifcLoader = new IFCLoader();
  ifcLoader.ifcManager.setWasmPath("../src/wasm/");


  const ifcFile = `https://cimsprojects.ca/CDC/CIMS-WebApp/assets/ontario/ottawa/carleton/ifc/${ifcFileName[currentModelCode]}`;
  // const ifcFile = `../static/public-ifc/${ifcFileName[currentModelCode]}`;
  console.log(ifcFile)
  ifcLoader.load(
    ifcFile,
    (ifcModel) => {
      ifcModel.name = `ifc-${currentModelCode}`;
      scene.add(ifcModel);
      loader.style.display = "none";
    },
    (progress) => {
      // loader.style.display = "flex";
      // progressText.textContent = `Loading ${ selectedOption }: ${Math.round((progress.loaded * 100) / progress.total)}%`;
    },
    (error) => {
      console.log(error);
    }
  );

  const loadingScreen = document.getElementById("loader-container");
  const progressText = document.getElementById("progress-text");
  let masses;
  
  
  // 3. The camera
  const size = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  
  //Creates the camera (point of view of the user)
  const aspect = size.width / size.height;
  const camera = new PerspectiveCamera(75, aspect);
  camera.position.z = 15;
  camera.position.y = 13;
  camera.position.x = 8;
  camera.lookAt(axes.position);
  
  scene.add(camera);
  
  // 4. The renderer
  const renderer = new WebGLRenderer({ canvas });
  renderer.setPixelRatio(Math.max(devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.setClearColor(0xffffff, 1);
  
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.pointerEvents = "none";
  labelRenderer.domElement.style.top = "0";
  document.body.appendChild(labelRenderer.domElement);
  
  // 5. Lights
  
  const lightColor = 0xffffff;

  const ambientLight = new AmbientLight(lightColor, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new DirectionalLight(lightColor, 1);
  directionalLight.position.set(0, 10, 0);
  directionalLight.target.position.set(-5, 0, 0);
  scene.add(directionalLight);
  scene.add(directionalLight.target);
  
  // 6. Responsivity
  
  window.addEventListener("resize", () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    labelRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });
  
  // 7. Controls
  
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
  const cameraControls = new CameraControls(camera, canvas);
  cameraControls.dollyToCursor = true;
  
  cameraControls.setLookAt(50, 100, 100, 0, 0, 0);
  
  // 8. Picking
  
  const raycaster = new Raycaster();
  const mouse = new Vector2();
  
  window.addEventListener("dblclick", (event) => {
    getMousePosition(event);
  
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(masses);
  
    if (!intersects.length) return;
  
    const found = intersects[0];
  
    const collisionLocation = found.point;
  
    const message = window.prompt("Describe the issue:");
  
    const container = document.createElement("div");
    container.className = "label-container";
  
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.className = "delete-button hidden";
    container.appendChild(deleteButton);
  
    const label = document.createElement("p");
    label.textContent = `${found.object.name} : ${message}`;
    label.classList.add("label");
    container.appendChild(label)
    
    const labelObject = new CSS2DObject(container);
    labelObject.position.copy(collisionLocation);
    scene.add(labelObject);
  
    deleteButton.onclick = () => {
      labelObject.removeFromParent();
      labelObject.element = null;
      container.remove()
    }
  
    container.onmouseenter = () => deleteButton.classList.remove('hidden');
    container.onmouseleave = () => deleteButton.classList.add('hidden');
  
  });
  
  function getMousePosition(event) {
    mouse.x = (event.clientX / canvas.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / canvas.clientHeight) * 2 + 1;
  }
  
  // 9. Animation
  animate();
  
  function animate() {
    const delta = clock.getDelta();
    cameraControls.update(delta);
  
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  
  // 10 Debugging
  
  const gui = new GUI();
  gui.close();
  
  const min = -3;
  const max = 3;
  const step = 0.01;
  
  const transformationFolder = gui.addFolder("Transformation");
  const colorFolder = gui.addFolder("Colors");
  const colorParam = {
    value: 0xff0000,
  };
  
  colorFolder
    .addColor(colorParam, "value")
    .name("Background Color")
    .onChange(() => {
      renderer.setClearColor(colorParam.value);
    });
  