export default function closeWindow(buttonId, isIframe) {
  const closeButton = document.getElementById(buttonId);
  if (closeButton)
    closeButton.addEventListener("click", () => {
      if (isIframe) {
        const iframes = [...document.getElementsByTagName("iframe")];
        for (const iframe of iframes) iframe.classList.add("hidden");
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
