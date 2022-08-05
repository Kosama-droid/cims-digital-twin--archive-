import { Color, LineBasicMaterial, MeshBasicMaterial } from "three";
import { IfcViewerAPI } from "web-ifc-viewer";
import { buildingsNames, ifcFileName } from "../static/data/cdc-data.js";
import {
  updateSelectBldgMenu,
  createBuildingSelector,
  closeNavBar,
  toggleVisibility,
  hoverHighlihgtMateral,
  pickHighlihgtMateral,
  labeling,
} from "../modules/twin.js";

import {
  IFCWALL,
  IFCWALLSTANDARDCASE,
  IFCSLAB,
  IFCWINDOW,
  IFCMEMBER,
  IFCPLATE,
  IFCCURTAINWALL,
  IFCDOOR,
} from "web-ifc";

import Stats from "stats.js/src/Stats";

// Get the URL parameter
const currentURL = window.location.href;
const url = new URL(currentURL);
const currentModelId = url.searchParams.get("id");
const toggle = {};

// Get user
let currentUser = "";
document
  .getElementById("user")
  .addEventListener(
    "change",
    () => (currentUser = document.getElementById("user").value)
  );

const building = {
  current: { currentModelId },
  ifcFile: {},
  listed: {},
  loaded: {},
};

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

const container = document.getElementById("viewer-container");

// IFC Viewer 👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️
const viewer = new IfcViewerAPI({
  container,
  backgroundColor: new Color(0xdddddd),
});
viewer.IFC.setWasmPath("../src/wasm/");
const scene = viewer.context.getScene();
// Create axes
viewer.axes.setAxes();

// Set up stats
const stats = new Stats();
stats.showPanel(0);
document.body.append(stats.dom);
stats.dom.style.right = "0px";
stats.dom.style.left = "auto";
viewer.context.stats = stats;

viewer.IFC.loader.ifcManager.applyWebIfcConfig({
  USE_FAST_BOOLS: true,
  COORDINATE_TO_ORIGIN: true,
});

const ifcURL = `https://cimsprojects.ca/CDC/CIMS-WebApp/assets/ontario/ottawa/carleton/ifc/${ifcFileName[currentModelId]}`;
let model;
const ifcModels = [];

loadIfc(ifcURL);

// Projection
document.getElementById("projection").onclick = () =>
  viewer.context.ifcCamera.toggleProjection();

// Load buildings 🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️

let properties;
let projectTree;
const plansContainer = document.getElementById("plans-menu");
async function loadIfc(ifcURL) {
  const loadingContainer = document.getElementById("loading-container");
  const progressText = document.getElementById("progress-text");

  model = await viewer.IFC.loadIfcUrl(
    ifcURL,
    true,
    (progress) => {
      loadingContainer.style.display = "flex";
      progressText.textContent = `Loading ${
        buildingsNames[currentModelId]
      }: ${Math.round((progress.loaded * 100) / progress.total)}%`;
    },
    (error) => {
      console.log(error);
    }
  );

  const rawProperties = await fetch(
    `../assets/carleton/json/ON_Ottawa_CDC_${currentModelId}_properties.json`
  );
  properties = await rawProperties.json();

  // Get project tree 🌳
  projectTree = await constructSpatialTree();
  createTreeMenu(projectTree);

  // Floor plans 👣👣👣👣👣
  const plansButton = document.getElementById("plans");
  toggle.plans = false;
  const plansMenu = document.getElementById("plans-menu");
  toggleVisibility(plansButton, toggle.plans, plansMenu);

  // Toggle left menu ⬅️
  document.getElementById("toolbar").onclick = () => {
    let plans = !document
      .getElementById("plans-menu")
      .classList.contains("hidden");
    let ifc = !document
      .getElementById("ifc-tree-menu")
      .classList.contains("hidden");
    toggle.left = plans || ifc;
    toggle.left
      ? document.getElementById("left-menu").classList.remove("hidden")
      : document.getElementById("left-menu").classList.add("hidden");
  };

  await viewer.plans.computeAllPlanViews(model.modelID);

  const lineMaterial = new LineBasicMaterial({ color: "black" });
  const baseMaterial = new MeshBasicMaterial({
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });

  await viewer.edges.create(
    "plan-edges",
    model.modelID,
    lineMaterial,
    baseMaterial
  );

  // Floor plan viewing
  const allPlans = viewer.plans.getAll(model.modelID);

  for (const plan of allPlans) {
    const currentPlan = viewer.plans.planLists[model.modelID][plan];
    if (currentPlan.name.includes("LV")) {
      const planButton = document.createElement("button");
      planButton.classList.add("levels");
      plansContainer.appendChild(planButton);
      planButton.textContent = currentPlan.name;
      planButton.onclick = () => {
        viewer.plans.goTo(model.modelID, plan, true);
        viewer.edges.toggle("plan-edges", true);
        togglePostproduction(false);
        toggleShadow(false);
      };
    }
  }

    viewer.shadowDropper.renderShadow(model.modelID);
  viewer.context.renderer.postProduction.active = true;
  loadingContainer.style.display = "none";
  }
    const button = document.createElement("button");
    plansContainer.appendChild(button);
    button.classList.add("button");
    button.textContent = "Exit Level View";
    button.onclick = () => {
      viewer.plans.exitPlanView();
      viewer.edges.toggle("plan-edges", false);
      togglePostproduction(true);
      toggleShadow(true);
    };




// Hover → Highlight
viewer.IFC.selector.preselection.material = hoverHighlihgtMateral;
window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();

// Dimensions 📏📏📏📏📏📏📏📏📏📏📏📏📏📏📏📏📏
const dimensionsButton = document.getElementById("dimensions");
toggle.dimensions = false;
let clicked = 0;
dimensionsButton.onclick = () => {
  toggle.dimensions = !toggle.dimensions;
  viewer.dimensions.active = toggle.dimensions;
  viewer.dimensions.previewActive = toggle.dimensions;
  let visibility = toggle.dimensions ? "Hide" : "Show";
  let button = document.getElementById("dimensions");
  button.setAttribute("title", `${visibility} ${button.id}`);
  toggle.dimensions
    ? button.classList.add("selected-button")
    : button.classList.remove("selected-button");
  clicked = 0;
};

// Clipping planes
const clippingButton = document.getElementById("clipping");
toggle.clipping = false;
clippingButton.onclick = () => {
  toggle.clipping = !toggle.clipping;
  viewer.clipper.active = toggle.clipping;
  let visibility = toggle.clipping ? "Hide" : "Show";
  let button = document.getElementById("clipping");
  button.setAttribute("title", `${visibility} ${button.id}`);
  toggle.clipping
    ? button.classList.add("selected-button")
    : button.classList.remove("selected-button");
};

// Click → Dimensions
window.onclick = () => {
  if (clicked > 0 && toggle.dimensions) {
    viewer.dimensions.create();
  }
  clicked++;
};

// Keybord ⌨️⌨️⌨️⌨️⌨️⌨️⌨️⌨️⌨️⌨️⌨️⌨️⌨️⌨️⌨️⌨️⌨️
window.onkeydown = (event) => {
  if (event.code === "Escape") {
    viewer.IFC.selector.unpickIfcItems();
    viewer.IFC.selector.unHighlightIfcItems();
  }
  if (event.code === "Space") {
    viewer.context.fitToFrame();
  }

  if (event.code === "Delete" && toggle.dimensions) {
    viewer.dimensions.delete();
  }
  if (event.code === "Delete" && toggle.clipping) {
    viewer.clipper.deletePlane();
  }
};

// Properties 📃📃📃📃📃📃📃📃📃📃📃📃📃📃📃📃📃📃📃
const propsGUI = document.getElementById("ifc-property-menu-root");
const propButton = document.getElementById("properties");
toggle.proprerties = false;
const propertyMenu = document.getElementById("ifc-property-menu");
toggleVisibility(propButton, toggle.proprerties, propertyMenu);

// Pick → propterties
viewer.IFC.selector.selection.material = pickHighlihgtMateral;

window.ondblclick = async () => {
  const result = await viewer.IFC.selector.pickIfcItem(false);
  if (result) {
    const foundProperties = properties[result.id];
    const psets = getPropertySets(foundProperties);
    createPropsMenu(psets);
  }
  // Clipping Planes ✂️✂️✂️✂️✂️✂️✂️✂️✂️✂️✂️✂️✂️✂️✂️✂️✂️
  if (toggle.clipping) {
    viewer.clipper.createPlane();
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

// Project Tree 🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳🌳

const toggler = document.getElementsByClassName("caret");
let i;

for (i = 0; i < toggler.length; i++) {
  toggler[i].addEventListener("click", function () {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.classList.toggle("caret-down");
  });
}

const treeButton = document.getElementById("project-tree");
toggle.tree = false;
const treeMenu = document.getElementById("ifc-tree-menu");
toggleVisibility(treeButton, toggle.tree, treeMenu);

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
window.oncontextmenu = () => {
  const collision = viewer.context.castRayIfc(model);
  if (collision === null || currentUser === "") return;
  const collisionLocation = collision.point;
  labeling(scene, collisionLocation, currentUser);
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
