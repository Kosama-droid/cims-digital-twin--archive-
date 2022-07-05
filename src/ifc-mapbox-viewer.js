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
  Matrix4,
  Vector3,
} from "../node_modules/three";
import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js"
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls";
import { mapStyles } from "../static/map-styles.js";

mapboxgl.accessToken =
    "pk.eyJ1Ijoibmljby1hcmVsbGFubyIsImEiOiJjbDU2bTA3cmkxa3JzM2luejI2dnd3bzJsIn0.lKKSghBtWMQdXszpTJN32Q";
  const map = new mapboxgl.Map({
    container: "map", // container ID
    style: mapStyles[0].url,
    center: [-75.697, 45.384], // starting position [lng, lat]
    zoom: 18, // starting zoom
    pitch: 50,
    antialias: true,
    // projection: "globe", // display the map as a 3D globe
  });
  // Day sky
  map.on("style.load", () => {
    map.setFog({}); // Set the default atmosphere style
  });

  const modelOrigin = [-75.697, 45.384];
  const modelAltitude = 10;
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
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
    };

    const THREE = window.THREE;
    // configuration of the custom layer for a 3D model per the CustomLayerInterface

    // configuration of the custom layer for a 3D model per the CustomLayerInterface
const customLayer = {
  id: '3d-model',
  type: 'custom',
  renderingMode: '3d',
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
   
  // Sets up the IFC loading
const ifcLoader = new IFCLoader();
ifcLoader.ifcManager.setWasmPath("wasm/");
// Load IFC file
ifcLoader.load(
  '../static/public_ifc/CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-MAINTENANCE_AND_GROUNDS_BLDG-AS_FOUND.ifc',
  (ifc) => {
  this.scene.add(ifc);
  }
  );
  this.map = map;
   
  // for (const model of models) {
  //   let buildingName = model.name
  //   buildingName = buildingName.toUpperCase()
  //   buildingName = buildingName.replace(/ /g, "_")
  //   buildingName = buildingName.replace("BUILDING", "BLDG");
  //   const ifcFile = `CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-${buildingName}-AS_FOUND.ifc`;
  //   model.ifc = ifcFile;
  // }
  
  // // Get the URL parameter
  // const currentURL = window.location.href;
  // const url = new URL(currentURL);
  // const currentModelID = url.searchParams.get("id");
  
  // // Get the current model
  // const currentModel = models.find(
  //   (model) => model.code == currentModelID
  // );
  
  // const pageTitle = document.getElementById("model-title");
  
  // if (currentModel !== undefined) {
  //   pageTitle.innerHTML = currentModel.name
  //   const ifcFile = `../static/public_ifc/${currentModel.ifc}`;
  // ifcLoader.load(ifcFile, (ifcModel) => {
  //   this.scene.add(ifcModel);
  // });}
  //   else{
  //     pageTitle.innerHTML = "IFC Model"
  //   }
  
  // // Load IFC file
  // const input = document.getElementById("file-input");
  //   input.addEventListener(
  //     "change",
  //     (changed) => {
  //       const file = changed.target.files[0];
  //       var ifcURL = URL.createObjectURL(file);
  //       ifcLoader.load(
  //             ifcURL,
  //             (ifcModel) => scene.add(ifcModel));
  //     },
  //     false
  //   );
  








  // use the Mapbox GL JS map canvas for three.js
  this.renderer = new WebGLRenderer({
  canvas: map.getCanvas(),
  context: gl,
  antialias: true
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
  }
  };
   
  map.on('style.load', () => {
  map.addLayer(customLayer, 'waterway-label');
  });
