import canada from "./canada";
import { Color, LineBasicMaterial, MeshBasicMaterial } from "three";
import { IfcViewerAPI } from "web-ifc-viewer";

import * as cdt from "../modules/cdt-api";

import {
  IFCWALL,
  IFCWALLSTANDARDCASE,
  IFCSLAB,
  IFCWINDOW,
  IFCMEMBER,
  IFCPLATE,
  IFCCURTAINWALL,
  IFCDOOR,
  IFCROOF,
  IFCCOLUMN,
  IFCFURNISHINGELEMENT,
  IFCSITE,
  IFCBUILDINGELEMENTPROXY,
  IFCSTAIRFLIGHT,
  IFCSTAIR,
  IFCRAMP,
  IFCRAMPFLIGHT,
} from "web-ifc";

// import Stats from "stats.js/src/Stats";

// Get the URL parameter
const currentURL = window.location.href;
const url = new URL(currentURL);
const currentModelCode = url.searchParams.get("id");
let codes = currentModelCode.split("/");
let province = { term: codes[0] };
let city = { name: codes[1] };
let place = { id: codes[2] };
let object = { id: codes[3], name: "" };
const toggle = {};
const objectPath = `assets/${province.term}/${city.name}/${place.id}/objects/${object.id}`;
const objectFileName = `${province.term}_${city.name}_${place.id}_${object.id}`;
const glbFilePath = `${objectPath}/glb/${objectFileName}`;
// const ifcFilePath = `assets/${currentModelCode}/ifc/${objectFileName}`;
let model = {};

place = canada.provinces[province.term].cities[city.name].places[place.id];

let objects = place.objects;

object.name = objects[object.id].name;

const container = document.getElementById("viewer-container");

// GUI  👌 _________________________________________________________________________________________

// tools ⚒️
cdt.toggleButton("tools-button", false, "tools-container")

// project tree 🌳
cdt.toggleButton("ifc-tree-button", false, "ifc-tree-menu", "side-menu")


// IFC Viewer 👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️
const viewer = new IfcViewerAPI({
  container,
  backgroundColor: new Color(0x8c8c8c),
});
viewer.IFC.setWasmPath("wasm/");
const scene = viewer.context.getScene();
// Create axes
viewer.axes.setAxes();

viewer.IFC.loader.ifcManager.applyWebIfcConfig({
  USE_FAST_BOOLS: true,
  COORDINATE_TO_ORIGIN: true,
});

object.ifcURL = `${place.ifcPath}${object.id}/ifc/${place.objects[object.id].ifcFileName}`;

// Projection
document.getElementById("projection").onclick = () =>
  viewer.context.ifcCamera.toggleProjection();

// Load objects 🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️

let properties;
let projectTree;
// const plansContainer = document.getElementById("plans-menu");

loadIfc(object.ifcURL);

async function loadIfc(ifcURL) {
  const loadingContainer = document.getElementById("loader-container");
  const progressText = document.getElementById("progress-text");

    let categories = [
      "walls",
      "slabs",
      "roofs",
      "curtainwalls",
      "windows",
      "doors",
      "columns",
      "furniture",
      "stairs",
    ];

    categories.forEach((category) => {
      model[category] = loadGlbByCategory(category);

      async function loadGlbByCategory(category) {
        let categoryGlb = await viewer.GLTF.loadModel(
          `${glbFilePath}_${category}.glb`
        );
        if (category === "walls") await viewer.context.ifcCamera.cameraControls.fitToBox(categoryGlb);
        if (categoryGlb.modelID > -1) {
          // Postproduction 💅
          viewer.shadowDropper.renderShadow(categoryGlb.modelID);
          // ClippingEdges.newStyleFromMesh(`${category}-style`, categoryGlb, lineMaterial)
          return categoryGlb;
        } else {
          throw new Error(`${category} does not exist in this object`);
        }
      }
    });    

  viewer.context.renderer.postProduction.active = true;
  loadingContainer.classList.add("hidden");

  const rawProperties = await fetch(
    `${objectPath}/json/${objectFileName}_properties.json`
  );
  properties = await rawProperties.json();

  // Get project tree 🌳
  projectTree = await constructSpatialTree();
  createTreeMenu(projectTree);

  //   // Floor plans 👣👣👣👣👣
  //   const plansButton = document.getElementById("plans");
  //   toggle.plans = false;
  //   const plansMenu = document.getElementById("plans-menu");
  //   cdt.toggleVisibility(plansButton, toggle.plans, plansMenu);

  //   await viewer.plans.computeAllPlanViews(model.modelID);

    const lineMaterial = new LineBasicMaterial({ color: "black" });
    const baseMaterial = new MeshBasicMaterial({
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });

  //   await viewer.edges.create(
  //     "plan-edges",
  //     model.modelID,
  //     lineMaterial,
  //     baseMaterial
  //   );

  //   // Floor plan viewing
  //   const allPlans = viewer.plans.getAll(model.modelID);

  //   for (const plan of allPlans) {
  //     const currentPlan = viewer.plans.planLists[model.modelID][plan];
  //     const planButton = document.createElement("button");
  //     planButton.classList.add("levels");
  //     plansContainer.appendChild(planButton);
  //     planButton.textContent = currentPlan.name;
  //     planButton.onclick = () => {
  //       viewer.plans.goTo(model.modelID, plan, true);
  //       viewer.edges.toggle("plan-edges", true);
  //       togglePostproduction(false);
  //       toggleShadow(false);
  //     };
  //   }
  //   return await models;
}

// const button = document.createElement("button");
// plansContainer.appendChild(button);
// button.classList.add("button");
// button.textContent = "Exit Level View";
// button.onclick = () => {
//   viewer.plans.exitPlanView();
//   viewer.edges.toggle("plan-edges", false);
//   togglePostproduction(true);
//   toggleShadow(true);
// };

// Hover → Highlight
viewer.IFC.selector.preselection.material = cdt.hoverHighlihgtMaterial;
window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();

// Dimensions 📏📏📏📏📏📏📏📏📏📏📏📏📏📏📏📏📏
const dimensionsButton = document.getElementById("dimensions");
toggle.dimensions = false;
let clicked = 0;
dimensionsButton.onclick = () => {
  toggle.dimensions = !toggle.dimensions;
  viewer.dimensions.active = toggle.dimensions;
  viewer.dimensions.previewActive = toggle.dimensions;
  let button = document.getElementById("dimensions");
  cdt.selectedButton(button, toggle.dimensions, true);
  updatePostProduction();
  clicked = 0;
};

// Clipping planes
const clippingButton = document.getElementById("clipping");
toggle.clipping = false;
clippingButton.onclick = () => {
  toggle.clipping = !toggle.clipping;
  viewer.IFC.selector.unHighlightIfcItems();
  viewer.clipper.active = toggle.clipping;
  // ClippingEdges.createDefaultIfcStyles = false;
  let button = document.getElementById("clipping");
  cdt.selectedButton(button, toggle.clipping, true);
};

// Properties 📃📃📃📃📃📃📃📃📃📃📃📃📃📃📃📃📃📃📃
const propsGUI = document.getElementById("ifc-property-menu-root");
const propButton = document.getElementById("properties-button");
toggle.proprerties = false;
viewer.IFC.selector.selection.material = cdt.hoverHighlihgtMaterial;

// Pick → propterties
propButton.addEventListener("click", () => {
  const propertyMenu = document.getElementById("ifc-property-menu");
  toggle.proprerties = !toggle.proprerties;
  cdt.selectedButton(propButton, toggle.proprerties, true);
  if (toggle.proprerties) {
    viewer.IFC.selector.selection.material = cdt.pickHighlihgtMaterial;
    propertyMenu.classList.remove("hidden");
  } else {
    viewer.IFC.selector.unpickIfcItems();
    viewer.IFC.selector.unHighlightIfcItems();
    viewer.IFC.selector.selection.material = cdt.hoverHighlihgtMaterial;
    propertyMenu.classList.add("hidden");
  }
});

// Click → Dimensions 📏
window.onclick = async () => {
  if (clicked > 0 && toggle.dimensions) {
    viewer.dimensions.create();
  }

  const result = await viewer.IFC.selector.pickIfcItem(false);
  if (result) {
    const foundProperties = properties[result.id];
    const psets = getPropertySets(foundProperties);
    createPropsMenu(psets);
  }
  clicked++;
};

// Keybord ⌨️⌨️⌨️⌨️⌨️⌨️⌨️⌨️⌨️⌨️⌨️⌨️⌨️⌨️⌨️⌨️⌨️
window.onkeydown = (event) => {
  const keyName = event.key;
  if (keyName === "e") {
    console.log("export:", object.name);
    preproscessIfc(object);
  }
  if (event.code === "Escape") {
    viewer.IFC.selector.unpickIfcItems();
    viewer.IFC.selector.unHighlightIfcItems();
  }
  if (event.code === "Space") {
    viewer.context.fitToFrame();
  }

  if (event.code === "Delete" && toggle.dimensions) {
    viewer.dimensions.delete();
    updatePostProduction()
  }
  if (event.code === "Delete" && toggle.clipping) {
    viewer.clipper.deletePlane();
  }
};

window.ondblclick = () => {
  // Clipping Planes ✂️✂️✂️✂️✂️✂️✂️✂️✂️✂️✂️✂️✂️✂️✂️✂️✂️
  if (toggle.clipping) {
    viewer.clipper.createPlane();
    return;
  }
};

// Utils functions
function getFirstItemOfType(type) {
  return Object.values(properties).find((item) => item.type === type);
}

function getAllItemsOfType(type) {
  return Object.values(properties).filter((item) => item.type === type);
}

// Get spatial tree
async function constructSpatialTree() {
  const ifcProject = getFirstItemOfType("IFCPROJECT");

  const ifcProjectNode = {
    expressID: ifcProject.expressID,
    type: "IFCPROJECT",
    children: [],
  };

  const relContained = getAllItemsOfType("IFCRELAGGREGATES");
  const relSpatial = getAllItemsOfType("IFCRELCONTAINEDINSPATIALSTRUCTURE");

  await constructSpatialTreeNode(ifcProjectNode, relContained, relSpatial);

  return ifcProjectNode;
}

// Recursively constructs the spatial tree
async function constructSpatialTreeNode(item, contains, spatials) {
  const spatialRels = spatials.filter(
    (rel) => rel.RelatingStructure === item.expressID
  );
  const containsRels = contains.filter(
    (rel) => rel.RelatingObject === item.expressID
  );

  const spatialRelsIDs = [];
  spatialRels.forEach((rel) => spatialRelsIDs.push(...rel.RelatedElements));

  const containsRelsIDs = [];
  containsRels.forEach((rel) => containsRelsIDs.push(...rel.RelatedObjects));

  const childrenIDs = [...spatialRelsIDs, ...containsRelsIDs];

  const children = [];
  for (let i = 0; i < childrenIDs.length; i++) {
    const childID = childrenIDs[i];
    const props = properties[childID];
    const child = {
      expressID: props.expressID,
      type: props.type,
      children: [],
    };

    await constructSpatialTreeNode(child, contains, spatials);
    children.push(child);
  }

  item.children = children;
}

// Gets the property sets

function getPropertySets(props) {
  const id = props.expressID;
  const propertyValues = Object.values(properties);
  const allPsetsRels = propertyValues.filter(
    (item) => item.type === "IFCRELDEFINESBYPROPERTIES"
  );
  const relatedPsetsRels = allPsetsRels.filter((item) =>
    item.RelatedObjects.includes(id)
  );
  const psets = relatedPsetsRels.map(
    (item) => properties[item.RelatingPropertyDefinition]
  );
  for (let pset of psets) {
    pset.HasProperty = pset.HasProperties.map((id) => properties[id]);
  }
  props.psets = psets;
  return props;
}

function createPropsMenu(props) {
  removeAllChildren(propsGUI);

  const psets = props.psets;
  const mats = props.mats;
  const type = props.type;

  delete props.psets;
  delete props.mats;
  delete props.type;

  for (let key in props) {
    if (props[key] === null) return;
    createPropertyEntry(key, props[key]);
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

// properties 📒
cdt.toggleButton("properties-button", false, "ifc-property-menu", "side-menu")

// Project Tree 🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳

const toggler = document.getElementsByClassName("caret");
let i;

for (i = 0; i < toggler.length; i++) {
  toggler[i].addEventListener("click", function () {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.classList.toggle("caret-down");
  });
}

function createTreeMenu(ifcProject) {
  const root = document.getElementById("tree-root");
  removeAllChildren(root);
  const ifcProjectNode = createNestedChild(root, ifcProject);
  for (const child of ifcProject.children) {
    constructTreeMenuNode(ifcProjectNode, child);
  }
}

function constructTreeMenuNode(parent, node) {
  const children = node.children;
  if (children.length === 0) {
    createSimpleChild(parent, node);
    return;
  }
  const nodeElement = createNestedChild(parent, node);
  for (const child of children) {
    constructTreeMenuNode(nodeElement, child);
  }
}

function createSimpleChild(parent, node) {
  const content = nodeToString(node);
  const childNode = document.createElement("li");
  childNode.classList.add("leaf-node");
  childNode.textContent = content;
  parent.appendChild(childNode);

  childNode.onclick = async () => {
    viewer.IFC.selector.pickIfcItemsByID(0, [node.expressID]);
  };
}

function createNestedChild(parent, node) {
  const content = nodeToString(node);
  const root = document.createElement("li");
  createTitle(root, content);
  const childrenContainer = document.createElement("ul");
  childrenContainer.classList.add("nested");
  root.appendChild(childrenContainer);
  parent.appendChild(root);
  return childrenContainer;
}

function createTitle(parent, content) {
  const title = document.createElement("span");
  title.classList.add("caret");
  title.onclick = () => {
    title.parentElement.querySelector(".nested").classList.toggle("active");
    title.classList.toggle("caret-down");
  };

  title.textContent = content;
  parent.appendChild(title);
}

function nodeToString(node) {
  return `${node.type} - ${node.expressID}`;
}

function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// Labeling 💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬💬
// Get user
let currentUser = "Anonymous";
document
  .getElementById("user")
  .addEventListener(
    "change",
    () => (currentUser = document.getElementById("user").value)
  );

const messageButton = document.getElementById("message");
toggle.message = false;
messageButton.onclick = () => {
  toggle.message = !toggle.message;
  let button = document.getElementById("message");
  cdt.selectedButton(button, toggle.message, true);
  let user = document.getElementById("user-container");
  toggle.message
    ? user.classList.remove("hidden")
    : user.classList.add("hidden");
};

window.oncontextmenu = () => {
  const collision = viewer.context.castRayIfc(model);
  if (!toggle.message || collision === null) return;
  const collisionLocation = collision.point;
  cdt.labeling(scene, collisionLocation, currentUser);
};

function toggleShadow(active) {
  const shadows = Object.values(viewer.shadowDropper.shadows);
  for (shadow of shadows) {
    shadow.root.visible = active;
  }
}

function togglePostproduction(active) {
  viewer.context.renderer.postProduction.active = active;
}

async function preproscessIfc(object) {
  const result = await viewer.GLTF.exportIfcFileAsGltf({
    ifcFileUrl: object.ifcURL,
    getProperties: false,
    splitByFloors: false,
    categories: {
      walls: [IFCWALL, IFCWALLSTANDARDCASE],
      doors: [IFCDOOR, IFCBUILDINGELEMENTPROXY],
      slabs: [IFCSLAB],
      windows: [IFCWINDOW],
      curtainwalls: [IFCMEMBER, IFCPLATE, IFCCURTAINWALL, IFCSITE],
      roofs: [IFCROOF],
      furniture: [IFCFURNISHINGELEMENT],
      columns: [IFCCOLUMN],
      stairs: [IFCSTAIRFLIGHT, IFCSTAIR],
      ramps: [IFCRAMP, IFCRAMPFLIGHT],
      // mep: [],
    },
  });

  // Download result
  const link = document.createElement("a");
  document.body.appendChild(link);

  for (let jsonFile of result.json) {
    link.download = `${objectFileName}_properties.json`;
    link.href = URL.createObjectURL(jsonFile);
    link.click();
  }

  for (const categoryName in result.gltf) {
    const category = result.gltf[categoryName];
    for (const levelName in category) {
      const file = category[levelName].file;
      if (file) {
        link.download = `${objectFileName}_${categoryName}.glb`;
        link.href = URL.createObjectURL(file);
        link.click();
      }
    }
  }

  link.remove();
}

function updatePostProduction() {
  viewer.context.renderer.postProduction.update();
}


// Set up stats
// const stats = new Stats();
// stats.showPanel(0);
// document.body.append(stats.dom);
// stats.dom.style.right = "5px";
// stats.dom.style.bottom = "5px";

// stats.dom.style.left = "auto";
// viewer.context.stats = stats;
