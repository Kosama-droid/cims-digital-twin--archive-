export default function closeWindow(buttonId, iframe) {
  const closeButton = document.getElementById(buttonId);
  closeButton.addEventListener("click", () => {
    if (iframe) {
      document.getElementsByTagName("iframe").item(0).remove();
      closeButton.classList.add("hidden");
      document.getElementById("iframe-container").classList.add("hidden");
    } else {
      const menuButton = document.getElementById(
        buttonId.replace("close", "button")
      );
      if (menuButton) menuButton.click();
      else closeButton.parentElement.classList.add("hidden");
    }
  });
}
