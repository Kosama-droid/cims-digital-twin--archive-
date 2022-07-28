import { Color, LatheBufferGeometry } from "three";
import { IfcViewerAPI } from "web-ifc-viewer";
import { buildingsNames, ifcFileName } from "../static/data/cdc-data.js";
import {
  updateSelectBldgMenu,
  createBuildingSelector,
  closeNavBar,
  toggleVisibility,
} from "../modules/twin.js"

// Get the URL parameter
const currentURL = window.location.href;
let currentUser = "User";
document.getElementById("user").addEventListener("change", () =>  currentUser = document.getElementById("user").value );
const url = new URL(currentURL);
const currentModelId = url.searchParams.get("id");

const loadingScreen = document.getElementById("loader-container");
const progressText = document.getElementById("progress-text");

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

const treeMenu = document.getElementById("ifc-tree-menu");
const treeButton = document.getElementById("tree-button");
let toggleTree = false;
toggleVisibility(treeMenu, treeButton, toggleTree);
toggleVisibility(treeMenu, treeButton, toggleTree);

option.innerHTML = buildingsNames[currentModelId];
const listedBuildings = document.getElementById("listed-buildings");
createBuildingSelector(building, buildingsNames, listedBuildings);
updateSelectBldgMenu(building, currentModelId);

const toggler = document.getElementsByClassName("caret");
let i;

for (i = 0; i < toggler.length; i++) {
  toggler[i].addEventListener("click", function() {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.classList.toggle("caret-down");
  });
}

document
  .getElementById("building-select")
  .addEventListener("change", function () {
    let selectedOption = this[this.selectedIndex].id;
    let newURL = currentURL.slice(0, -2) + selectedOption;
    location.href = newURL;
  });
closeNavBar();

const container = document.getElementById("viewer-container");
const viewer = new IfcViewerAPI({
  container,
  backgroundColor: new Color(0xdddddd),
});

// Create grid and axes
// viewer.grid.setGrid();
viewer.axes.setAxes();

const ifcURL = `https://cimsprojects.ca/CDC/CIMS-WebApp/assets/ontario/ottawa/carleton/ifc/${ifcFileName[currentModelId]}`;

loadIfc(ifcURL);
let model;

async function setUpMultiThreading() {
  const manager = ifcLoader.ifcManager;
  // These paths depend on how you structure your project
  await manager.useWebWorkers(true, '../src/wasm/IFCWorker.js');
}

setUpMultiThreading();

async function loadIfc(url) {
  await viewer.IFC.setWasmPath("../src/wasm/");
  model = await viewer.IFC.loadIfcUrl(url);
  await viewer.shadowDropper.renderShadow(model.modelID);
  viewer.context.renderer.postProduction.active = true;

  const ifcProject = await viewer.IFC.getSpatialStructure(model.modelID);
  createTreeMenu(ifcProject);
}

// Properties menu

window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();
// window.onclick = () => viewer.IFC.selector.pickIfcItem();

window.ondblclick = async () => {
  const result = await viewer.IFC.selector.pickIfcItem(false, true);
  if (!result) return;
  const { modelID, id } = result;
  const props = await viewer.IFC.getProperties(modelID, id, true, false);
  createPropertiesMenu(props);
};

const propsGUI = document.getElementById("ifc-property-menu-root");

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

// Project Viewer

function createTreeMenu(ifcProject) {
  const root = document.getElementById("tree-root")
  removeAllChildren(root);
  const ifcProjectNode = createNestedChild(root, ifcProject);
  for(const child of ifcProject.children) {
    constructTreeMenuNode(ifcProjectNode, child);
  }
}

function constructTreeMenuNode(parent, node) {
  const children = node.children;
  if(children.length === 0) {
    createSimpleChild(parent, node);
    return;
  }
  const nodeElement = createNestedChild(parent, node);
  for(const child of children) {
    constructTreeMenuNode(nodeElement, child)
  }
}

function createSimpleChild(parent, node) {
  const content = nodeToString(node);
  const childNode = document.createElement('li');
  childNode.classList.add('leaf-node');
  childNode.textContent = content;
  parent.appendChild(childNode);

  childNode.onmouseenter = () => {
      viewer.IFC.selector.prepickIfcItemsByID(0, [node.expressID]);
  }

  childNode.onclick = async () => {
    viewer.IFC.selector.pickIfcItemsByID(0, [node.expressID]);
  }
}

function createNestedChild(parent, node) {
  const content = nodeToString(node);
  const root = document.createElement('li');
  createTitle(root, content);
  const childrenContainer = document.createElement('ul');
  childrenContainer.classList.add('nested');
  root.appendChild(childrenContainer);
  parent.appendChild(root);
  return childrenContainer;
}

function createTitle(parent, content) {
  const title = document.createElement('span')
  title.classList.add('caret');
  title.onclick = () => {
    title.parentElement.querySelector('.nested').classList.toggle('active');
    title.classList.toggle('caret-down')
  }

  title.textContent = content;
  parent.appendChild(title)
}

function nodeToString(node) {
  return `${node.type} - ${node.expressID}`;
}

function removeAllChildren(element) {
  while(element.firstChild) {
    element.removeChild(element.firstChild)
  }
}