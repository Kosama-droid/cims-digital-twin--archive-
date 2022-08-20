export default function labeling(scene, collisionLocation, user = "User") {
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