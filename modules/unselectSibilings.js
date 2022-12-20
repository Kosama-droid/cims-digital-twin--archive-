export default function unselectSibilings(button) {
  const buttonParent = button.parentElement;
  const buttonSibilings = buttonParent.children;
  const childrenArray = Array.from(buttonSibilings);
  childrenArray.forEach((child) => {
    child.classList.remove("selected-button")
  });
}
