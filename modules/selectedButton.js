export default function selectedButton(button, toggle) {
  toggle
    ? button.classList.add("selected-button")
    : button.classList.remove("selected-button");
    }

export async function getJson(path) {
  let response = await fetch(path);
  let json = await response.json();
  return json;
}