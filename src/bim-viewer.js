import { Color } from 'three';
import { IfcViewerAPI } from 'web-ifc-viewer';
import { ifcFileName } from "../static/data/cdc-models.js";


const container = document.getElementById('viewer-container');
const viewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xffffff) });

// Create grid and axes
// viewer.grid.setGrid();
viewer.axes.setAxes();

load()

 // Get the URL parameter
 const currentURL = window.location.href;
 const url = new URL(currentURL);
 const currentModelCode = url.searchParams.get("id");

 const ifcURL = `https://cimsprojects.ca/CDC/CIMS-WebApp/assets/ontario/ottawa/carleton/ifc/${ifcFileName[currentModelCode]}`;

load(ifcURL);

async function load(url) {
    const model = await viewer.IFC.loadIfcUrl(url);
    await viewer.shadowDropper.renderShadow(model.modelID);
    viewer.context.renderer.postProduction.active = true;
}