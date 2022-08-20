export default function toggleVisibility(button, toggle, object = null) {
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