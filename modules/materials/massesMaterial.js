import {
    MeshStandardMaterial,
    DoubleSide,
  } from "three";
  
  export default massesMaterial = new MeshStandardMaterial({
    color: 0x555555,
    flatShading: true,
    side: DoubleSide,
    emissive: 0x555555,
  });