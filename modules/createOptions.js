import sortChildren from "../modules/sortChildren";

export default function createOptions(selector, objects) {
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
