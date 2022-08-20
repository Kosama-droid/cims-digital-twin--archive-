import {
  MeshBasicMaterial,
} from "three";

export default hoverHighlihgtMateral = new MeshBasicMaterial({
    transparent: true,
    opacity: 0.3,
    color: 0xffffcc,
    depthTest: false,
  });