import { Color } from "three";
import { IfcViewerAPI } from "web-ifc-viewer";
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
} from "web-ifc";

import {
  IfcPath,
  buildingsNames,
  ifcFileName,
  // da_IfcPath,
  // da_ifcFileName,
} from "../static/data/cdc-data.js";

let province = "ON";
let city = "Ottawa";
let site = "cu";
let currentModelId = "SD";
let fileRoute = `${province}_${city}_${site}_${currentModelId}_`;
// let ifcURL = `https://cimsprojects.ca/CDC/CIMS-WebApp/assets/ontario/ottawa/carleton/ifc/${ifcFileName[currentModelId]}`;
// let ifcURL = `${IfcPath}${ifcFileName[currentModelId]}`;
let ifcURL = '../assets/carleton/ifc/CDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-STORMONT_AND_DUNDAS_HOUSE-AS_FOUND.ifcCDC-CIMS-FEDERATED_BLDGS-SUST-CIMS-DOC-STORMONT_AND_DUNDAS_HOUSE-AS_FOUND.ifc'


const container = document.getElementById("viewer-container");
const viewer = new IfcViewerAPI({
  container,
  backgroundColor: new Color(0xffffff),
});
viewer.IFC.setWasmPath("../src/wasm/");

preposcessIfc(ifcURL, fileRoute);

const ids = [];

// for (currentModelId in da_ifcFileName) {
//   let fileRoute = `${province}_${city}_${site}_${currentModelId}_`;
// //   const ifcURL = `https://cimsprojects.ca/CDC/CIMS-WebApp/assets/ontario/ottawa/carleton/ifc/${ifcFileName[currentModelId]}`;
// let ifcURL = `${da_IfcPath}${da_ifcFileName[currentModelId]}`;
//   ids.push(currentModelId);
// }

// let i = 0;
// document.getElementById("gltf").addEventListener("click", () => {
//     currentModelId = ids[i]
//     console.log(currentModelId);
//     let fileRoute = `${province}_${city}_${site}_${currentModelId}_`
//     let ifcURL = `${da_IfcPath}${da_ifcFileName[currentModelId]}`;
//     preposcessIfc(ifcURL, fileRoute);
//   i++;
// });

async function preposcessIfc(url, fileRoute) {
  // Export to glTF and JSON
  const result = await viewer.GLTF.exportIfcFileAsGltf({
    ifcFileUrl: url,
    splitByFloors: false,
    categories: {
      walls: [IFCWALL, IFCWALLSTANDARDCASE],
      slabs: [IFCSLAB],
      windows: [IFCWINDOW],
      curtainwalls: [IFCMEMBER, IFCPLATE, IFCCURTAINWALL],
      doors: [IFCDOOR],
      roofs:[IFCROOF],
      // furniture: [],
      // structure: [],
      // mep: [],
    },
    getProperties: true,
  });

  // Download result
  let link = document.createElement("a");
  document.body.appendChild(link);

  for (const categoryName in result.gltf) {
    const category = result.gltf[categoryName];
    for (const levelName in category) {
      const file = category[levelName].file;
      if (file) {
        link.download = `${fileRoute}${categoryName}.gltf`;
        link.href = URL.createObjectURL(file);
        link.click();
      }
    }
  }

  for (let jsonFile of result.json) {
    link.download = `${fileRoute}${jsonFile.name}`;
    link.href = URL.createObjectURL(jsonFile);
    link.click();
  }

    link.remove();
}
