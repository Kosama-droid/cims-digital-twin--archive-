import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default  function loadObjectGltf(path, object, currentScene, camera) {
  const gltfloader = new GLTFLoader();
  let loadingContainer = document.getElementById("loader-container");
  let progressText = document.getElementById("progress-text");
  const categories = [ "roofs", "slabs", "curtainwalls", "windows", "doors", "walls", "structure"];
  categories.forEach((category) => {
    let gltfPath = `${path}${object.id}_${category}_allFloors.gltf`;
    gltfloader.load(
      gltfPath,
     (gltf, objectGltf) => {
        objectGltf = gltf.scene;
        objectGltf.name = `${object.id}-${category}`;
        currentScene.add(objectGltf)
        loadingContainer.classList.add("hidden");
        if (category === "walls") {
          let geometry = objectGltf.children[0]
          camera.fitToBox(geometry)
        } 
      },
      () => {
        loadingContainer.classList.remove("hidden");
        progressText.textContent = `Loading ${object.name}`;
      },
      (error) => {
        return;
      }
    );
  });
}
