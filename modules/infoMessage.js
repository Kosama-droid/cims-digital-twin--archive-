export default function infoMessage(message, seconds = 6) {
    let container = document.getElementById("message");
    container.innerHTML = message;
    container.classList.remove("hidden");
    setTimeout(() => container.classList.add("hidden"), seconds * 1000);
  }