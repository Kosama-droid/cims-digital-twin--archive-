import { projects } from "./cdc-models.js";
import { Color } from '../node_modules/three';
import { IfcViewerAPI } from '../node_modules/web-ifc-viewer';

const container = document.getElementById('viewer-container');
const viewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xffffff) });
viewer.grid.setGrid();
viewer.axes.setAxes();

async function loadIfc(url) {
    await viewer.IFC.setWasmPath("../../../");
    const model = await viewer.IFC.loadIfcUrl(url);
    viewer.shadowDropper.renderShadow(model.modelID);
}

loadIfc('your/IFC/path/model.ifc');

// Get the URL parameter
const currentURL = window.location.href;
const url = new URL(currentURL);
const currentProjectID = url.searchParams.get("id");

// Get the current project
const currentProject = projects.find(project => project.id == currentProjectID);

// Add the project URL to the iframe
const iframe = document.getElementById("model-iframe");
iframe.src = currentProject.url;



