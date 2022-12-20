export default function hideRightMenus(exclude) {
  const rightMenus = Array.from(document.getElementById("right-menus").children);
      rightMenus.forEach(menu => {
        if (menu !== exclude) menu.classList.add("hidden");
      });
}