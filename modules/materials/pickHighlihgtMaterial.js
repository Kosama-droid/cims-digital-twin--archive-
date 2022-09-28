import {
  MeshBasicMaterial,
} from "three";

export default pickHighlihgtMateral = new MeshBasicMaterial({
    transparent: true,
    opacity: 0.6,
    color: 0xffff30,
    depthTest: false,
  });