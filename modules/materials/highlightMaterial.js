import {
  MeshBasicMaterial,
  DoubleSide,
} from "three";

export default highlightMaterial = new MeshBasicMaterial({
    color: 0xcccc70,
    flatShading: true,
    side: DoubleSide,
    transparent: true,
    opacity: 0.9,
    depthTest: false,
  });