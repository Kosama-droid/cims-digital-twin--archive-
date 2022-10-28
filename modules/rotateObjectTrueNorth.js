import degreesToRadians from "./degreesToRadians";

export default function rotateObjectTrueNorth(object){
  const trueNorthInput = document.getElementById("object-true-north")
  trueNorthInput.addEventListener("input", () => {
    let trueNorth = trueNorthInput.value;
    let radians = degreesToRadians(trueNorth);
    if(object.gltfModel) object.gltfModel.rotation.y = radians;
    if(object.ifcModel)object.ifcModel.rotation.y = radians;
    object.trueNorth = trueNorth;
  });
  }