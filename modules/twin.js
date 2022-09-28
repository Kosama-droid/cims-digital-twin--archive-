import { IfcViewerAPI } from "web-ifc-viewer";
import {
  MeshBasicMaterial,
  DoubleSide,
} from "three";

import {
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

const listedBuildings$1 = document.getElementById("listed-buildings");
const loadedBuildings = document.getElementById("loaded-buildings");
const navigationBar = document.getElementById("selectors");
const navigationButton = document.getElementById("close-nav-bar");

export const hoverHighlihgtMateral = new MeshBasicMaterial({
  transparent: true,
  opacity: 0.3,
  color: 0xffffcc,
  depthTest: false,
});

export const pickHighlihgtMateral = new MeshBasicMaterial({
  transparent: true,
  opacity: 0.6,
  color: 0xffff30,
  depthTest: false,
});

export const highlightMaterial = new MeshBasicMaterial({
  color: 0xcccc70,
  flatShading: true,
  side: DoubleSide,
  transparent: true,
  opacity: 0.9,
  depthTest: false,
});

export function isolateSelector(selectors, ...keys) {
    selectors.forEach((selector) => {
      if (keys.includes(selector.id)) {
        selector.classList.remove('hidden');
      } else {
        selector.classList.add('hidden');
      }
    });
  }

  export function hideElementsById(...ids) {
    ids.forEach(id => {
       document.getElementById(id).classList.add('hidden');
    });
  }

  export function unhideElementsById(...ids) {
    ids.forEach(id => {
       document.getElementById(id).classList.remove('hidden');
    });
  }

export function closeNavBar() {
let togglenavigationBar = false;
navigationButton.onclick = function () {
  navigationBar.style.visibility = togglenavigationBar ? "visible" : "collapse";
  navigationButton.style.transform = togglenavigationBar
    ? ""
    : "rotate(180deg)";
  const navBarBackground = document.getElementById("nav-bar");
  navBarBackground.style.backgroundColor = togglenavigationBar
    ? ""
    : "#FFFFFF00";
  navBarBackground.style.boxShadow = togglenavigationBar ? "" : "none";
  togglenavigationBar = !togglenavigationBar;
};
}

export function createBuildingSelector(building, names, selector) {
  for (id in names) {
    let option = document.createElement("option");
    option.setAttribute("id", id);
    building.listed[id] = names[id];
    option.innerHTML = names[id];
    selector.appendChild(option);
  }
  sortChildren(selector);
}

export function updateSelectBldgMenu(building, id) {
    let selectedOption = document.getElementById(id);
      building.current.id = id;
      if (!(building.current.id in building.loaded)) {
        delete building.listed[id];
        building.loaded[id] = id;
        loadedBuildings.appendChild(selectedOption);
        sortChildren(loadedBuildings);
      } else {
        delete building.loaded[id];
        building.listed[id] = id;
        listedBuildings$1.appendChild(selectedOption);
        sortChildren(listedBuildings$1);
      }
    }

export function sortChildren(parent) {
        const items = Array.prototype.slice.call(parent.children);
        items.sort(function (a, b) {
          return a.textContent.localeCompare(b.textContent);
        });
        items.forEach((item) => {
          const itemParent = item.parentNode;
          let detatchedItem = itemParent.removeChild(item);
          itemParent.appendChild(detatchedItem);
        });
      }

export function toggleVisibility(button, toggle, object = null) {
        button.onclick = function () {
          if (toggle) {
            this.setAttribute("title", `Show ${this.id.replace("-", " ")}`)
            this.classList.remove("selected-button")
            if (object) {object.classList.add("hidden")};
            toggle = false
          } else {
            this.setAttribute("title", `Hide ${this.id.replace("-", " ")}`);
            if (object) {object.classList.remove("hidden")};
            this.classList.add("selected-button")
            toggle = true
          }
        };
        return toggle;
      }

export function labeling(scene, collisionLocation, user = "User") {
        const message = window.prompt("Message:");
      
        if (!message) return;
      
        const container = document.createElement("div");
        container.className = "label-container canvas";
      
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.className = "delete-button hidden";
        container.appendChild(deleteButton);
      
        const label = document.createElement("p");
        label.textContent = `${user}: ${message}`;
        label.classList.add("label");
        container.appendChild(label);
      
        const labelObject = new CSS2DObject(container);
        labelObject.position.copy(collisionLocation);
        scene.add(labelObject);
      
        deleteButton.onclick = () => {
          labelObject.removeFromParent();
          labelObject.element = null;
          container.remove();
        };
      
        container.onmouseenter = () => deleteButton.classList.remove("hidden");
        container.onmouseleave = () => deleteButton.classList.add("hidden");
      }

      
export function deleteChildren(parent) {
  while (parent.children.length > 0) {
    parent.remove(parent.children[0]);
  }
}

export function createOptions(selector, objects) {
  while (selector.childElementCount > 1) {
    selector.removeChild(selector.lastChild);
  }
  for (const object in objects) {
    const name = objects[object].name;
    let option = document.createElement("option");
    option.innerHTML = name;
    option.setAttribute("id", object);
    selector.appendChild(option);
    sortChildren(selector);
  }
}

export function selectedButton(button, toggle) {
  toggle
    ? button.classList.add("selected-button")
    : button.classList.remove("selected-button");
    }

export async function getJson(path) {
  let response = await fetch(path);
  let json = await response.json();
  return json;
}

function setGeojson(objects) {
  const geojson = { type: "FeatureCollection" };
  geojson.features = [];
  for (let key in objects) {
    let object = objects[key];
    geojson.features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [object.coordinates.lng, object.coordinates.lat],
      },
      properties: {
        title: `${object.name}`,
        description: `${object}.description`,
      },
    });
  }
  return geojson;
}

async function setMarker(objects, toggle, markers) {
  if (toggle) {
    for (let key in objects) {
      let object = objects[key];
      const el = document.createElement("div");
      el.className = "mapbox-marker";
      el.setAttribute("id", key);
      el.setAttribute(
        "title",
        object.title ? objects[key].title : objects[key].name
      );
      el.style.setProperty("width", 20);
      el.style.setProperty("height", 20);
      if (object.logo)
        el.style.setProperty("background-image", `url(${object.logo})`);
      markers.push(el);
      el.addEventListener("click", () => {});
      markers.forEach((marker) => {
        toggle
          ? marker.classList.remove("hidden")
          : marker.classList.add("hidden");
      });
      new mapboxgl.Marker(el).setLngLat(object.coordinates).addTo(map);
    }
  }
}
