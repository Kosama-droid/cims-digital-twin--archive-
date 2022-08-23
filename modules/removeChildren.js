  export default function removeChildren(parent, childrenToKeep = 0) {
    while (parent.childElementCount > childrenToKeep) {
      parent.removeChild(parent.lastChild);
    }
  }