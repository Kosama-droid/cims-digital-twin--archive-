import sortChildren from "../modules/sortChildren";

export default function createOptions(selector, objects, keepSelectors = 2) {
  while (selector.childElementCount > keepSelectors) {
    selector.removeChild(selector.lastChild);
  }
  for (const object in objects) {
    const name = objects[object].name;
    let option = document.createElement("option");
    option.innerHTML = name;
    option.setAttribute("id", objects[object].id);
    //option.id = objects[object.id];
    option.classList.add('option')
    selector.appendChild(option);
    sortChildren(selector);
  }
}