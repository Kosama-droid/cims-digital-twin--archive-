import { Color } from "three";
import { IfcViewerAPI } from "web-ifc-viewer";
import { buildingsNames } from "../static/data/cdc-data.js";
import {
  updateSelectBldgMenu,
  createBuildingSelector,
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

const building = {
  current: { currentModelId },
  ifcFile: {},
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

const container = document.getElementById('viewer-container');
const viewer = new IfcViewerAPI({ container, backgroundColor: new Color(0xffffff) });
viewer.grid.setGrid();
viewer.axes.setAxes();
viewer.IFC.setWasmPath("../src/wasm/");

const input = document.getElementById('file-input');
input.onchange = loadIfc;

let url = '../static/public-ifc/CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-AZRIELI_PAVILION-AS_FOUND.ifc';
loadIfc(url);


async function loadIfc(url) {

    // Export to glTF and JSON
    const result = await viewer.GLTF.exportIfcFileAsGltf({
        ifcFileUrl: url,
        categories: {
            walls: [IFCWALL, IFCWALLSTANDARDCASE],
            slabs: [IFCSLAB],
            windows: [IFCWINDOW],
            curtainwalls: [IFCMEMBER, IFCPLATE, IFCCURTAINWALL],
            doors: [IFCDOOR],
            furniture: [],
            structure: [],
            mep: [],
        },
        getProperties: true
    });

    // Download result
    const link = document.createElement('a');
    document.body.appendChild(link);

    for(const categoryName in result.gltf) {
        const category = result.gltf[categoryName];
        for(const levelName in category) {
            const file = category[levelName].file;
            if(file) {
                link.download = `${file.name}_${categoryName}_${levelName}.gltf`;
                link.href = URL.createObjectURL(file);
                link.click();
            }
        }
    }

    for(let jsonFile of result.json) {
        link.download = `${jsonFile.name}.json`;
        link.href = URL.createObjectURL(jsonFile);
        link.click();
    }

    link.remove();
}
