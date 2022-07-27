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
  backgroundColor: new Color(0xffffff),
});

// Create grid and axes
// viewer.grid.setGrid();
viewer.axes.setAxes();

const ifcURL = `https://cimsprojects.ca/CDC/CIMS-WebApp/assets/ontario/ottawa/carleton/ifc/${ifcFileName[currentModelId]}`;

loadIfc(ifcURL);

async function loadIfc(url) {
  await viewer.IFC.setWasmPath("../src/wasm/");
  const model = await viewer.IFC.loadIfcUrl(url);
  await viewer.shadowDropper.renderShadow(model.modelID);
  viewer.context.renderer.postProduction.active = true;
}

// Properties menu

window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();
window.onclick = () => viewer.IFC.selector.pickIfcItem();

window.ondblclick = async () => {
  const result = await viewer.IFC.selector.highlightIfcItem();
  if (!result) return;
  const { modelID, id } = result;
  const props = await viewer.IFC.getProperties(modelID, id, true, false);
  createPropertiesMenu(props);
};

const propsGUI = document.getElementById("ifc-property-menu-root");

function createPropertiesMenu(properties) {
  console.log(properties);

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
