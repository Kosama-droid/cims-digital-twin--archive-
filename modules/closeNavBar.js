const navigationBar = document.getElementById("selectors");
const navigationButton = document.getElementById("close-nav-bar");

export default function closeNavBar() {
    let togglenavigationBar = false;
    navigationButton.onclick = function () {
      navigationBar.style.visibility = togglenavigationBar ? "visible" : "collapse";
      navigationButton.style.transform = togglenavigationBar
        ? ""
        : "rotate(180deg)";
      const navBarBackground = document.getElementById("nav-bar");
      navBarBackground.style.backgroundColor = togglenavigationBar
        ? ""
        : "#FFFFFF00";
      navBarBackground.style.boxShadow = togglenavigationBar ? "" : "none";
      togglenavigationBar = !togglenavigationBar;
    };
    }