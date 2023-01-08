export default function closeWindow(buttonId, iframe) {
  const closeButton = document.getElementById(buttonId);
  if (closeButton)
    closeButton.addEventListener("click", () => {
      if (iframe) {
        document.getElementsByTagName("iframe").item(0).classList.add("hidden");
        if (closeButton) closeButton.classList.add("hidden");
      } else {
        document.getElementsByClassName("iframe").remove;
        const menuButton = document.getElementById(
          buttonId.replace("close", "button")
        );
        if (menuButton) menuButton.click();
        else closeButton.parentElement.classList.add("hidden");
      }
    });
  else {
    document.getElementById("iframe-container").classList.add("hidden");
  }
}
