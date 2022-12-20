import selectedButton from "./selectedButton";
import unselectSibilings from "./unselectSibilings";
import hideRightMenus from "./hideRightMenus";

export default function toggleButton(buttonId, toggle, ...targets) {
  const button = document.getElementById(buttonId)
    button.onclick = () => {
      toggle = !toggle;
      unselectSibilings(button)
      selectedButton(button, toggle);
      targets.forEach(target => {
        const targetElement = document.getElementById(target);
        toggle
        ? targetElement.classList.remove("hidden")
        : targetElement.classList.add("hidden"); 
      });
    };
    return toggle
  }