import { Color, LatheBufferGeometry } from "three";
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

import Stats from "stats.js/src/Stats";

// Get the URL parameter
const currentURL = window.location.href;
const url = new URL(currentURL);
const currentModelId = url.searchParams.get("id");

// Get user
let currentUser = "User";
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
console.log(viewer.context);
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
  COORDINATE_TO_ORIGIN: false,
});
viewer.context.renderer.postProduction.active = true;

const ifcURL = `https://cimsprojects.ca/CDC/CIMS-WebApp/assets/ontario/ottawa/carleton/ifc/${ifcFileName[currentModelId]}`;
let model;
const ifcModels = [];

loadIfc(ifcURL);

// Projection
document.getElementById("projection").onclick = () =>
  viewer.context.ifcCamera.toggleProjection();

// Load buildings 🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️🏗️
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

  viewer.IFC.getSpatialStructure(model.modelID);
  await viewer.shadowDropper.renderShadow(model.modelID);
  loadingContainer.style.display = "none";
  const ifcProject = await viewer.IFC.getSpatialStructure(model.modelID);
  createTreeMenu(ifcProject);
}

// Hover → Highlight
viewer.IFC.selector.preselection.material = hoverHighlihgtMateral;
window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();

// Dimensions 📏📏📏📏📏📏📏📏📏📏📏📏📏📏📏📏📏
const dimensionsButton = document.getElementById("dimensions");
let toggleDimensions = false;
let clicked = 0;
dimensionsButton.onclick = () => {
  toggleDimensions = !toggleDimensions;
  viewer.dimensions.active = toggleDimensions;
  viewer.dimensions.previewActive = toggleDimensions;
  let visibility = toggleDimensions ? "Hide" : "Show";
  let button = document.getElementById("dimensions");
  button.setAttribute("title", `${visibility} ${button.id}`);
  clicked = 0;
};

// Double click → Dimensions
window.onclick = () => {
  if (clicked > 0) {
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
    viewer.context.fitToFrame()
  }

  if (event.code === "Delete") {
    viewer.dimensions.delete();
  }
};

// Properties 📃📃📃📃📃📃📃📃📃📃📃📃📃📃📃📃📃📃📃
const propsGUI = document.getElementById("ifc-property-menu-root");
const propButton = document.getElementById("properties");
let toggleProp = false;
const propertyMenu = document.getElementById("ifc-property-menu");
toggleVisibility(propButton, toggleProp, propertyMenu);

// Pick → propterties
viewer.IFC.selector.selection.material = pickHighlihgtMateral;
window.ondblclick = async () => {
  const result = await viewer.IFC.selector.pickIfcItem(false);
  if (!result) return;
  const { modelID, id } = result;
  const props = await viewer.IFC.getProperties(modelID, id, true, false);
};

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
let toggleTree = false;
const treeMenu = document.getElementById("ifc-tree-menu");
toggleVisibility(treeButton, toggleTree, treeMenu);

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

  childNode.onmouseenter = () => {
    viewer.IFC.selector.prepickIfcItemsByID(0, [node.expressID]);
  };

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
  if (collision === null) return;
  const collisionLocation = collision.point;
  labeling(scene, collisionLocation, currentUser);
};
