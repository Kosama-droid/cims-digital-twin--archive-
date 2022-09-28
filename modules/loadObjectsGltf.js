import { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

export default function loadObjectsGltf(site, currentScene) {
  site.id = site.id;
  const group = new Group();
  group.name = `${site.id}-objects`;
  const gltfloader = new GLTFLoader();
  let categories = [];
  let objects = site.objects;
  let objectGltf;
  let loadingContainer = document.getElementById("loader-container");
  let progressText = document.getElementById("progress-text");
  if (isMobile) {
    categories = [];
  }
  else{ 
    categories = ["roofs", "walls", "slabs", "curtainwalls", "windows"] 
  }
  categories.forEach((category) => {
    for (const id in objects) {
      let gltfPath = `${site.gltfPath}${id}_${category}_allFloors.gltf`;
      gltfloader.load(
        gltfPath,
        (gltf) => {
          objectGltf = gltf.scene;
          objectGltf.name = `${id}-${category}`;
          currentScene.getObjectByName(`${site.id}-objects`).add(objectGltf);
          loadingContainer.classList.add("hidden");
        },
        () => {
          loadingContainer.classList.remove("hidden");
          progressText.textContent = `Loading ${site.name}'s objects`;
        },
        (error) => {
          return;
        }
      );
    }
  });
  if (!currentScene.getObjectByName(`${site.id}-objects`)) currentScene.add(group);
}
