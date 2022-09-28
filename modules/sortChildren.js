export default function sortChildren(parent) {
    const items = Array.prototype.slice.call(parent.children);
    items.sort(function (a, b) {
      return a.textContent.localeCompare(b.textContent);
    });
    items.forEach((item) => {
      const itemParent = item.parentNode;
      let detatchedItem = itemParent.removeChild(item);
      itemParent.appendChild(detatchedItem);
    });
  }