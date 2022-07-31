import { IfcViewerAPI } from "web-ifc-viewer";
import {
  MeshBasicMaterial,
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

export function isolateSelector(selectors, ...keys) {
    selectors.forEach((selector) => {
      if (keys.includes(selector.id)) {
        selector.style.display = "inline-block";
      } else {
        selector.style.display = "none";
      }
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