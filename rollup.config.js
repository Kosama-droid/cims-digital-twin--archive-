import resolve from '@rollup/plugin-node-resolve'

export default {
  input: "src/ifc-mapbox-viewer.js",
  output: [
    {
    format: "esm",
    file: "dist/bundle.js"
    }
  ],
  plugins: [
    resolve(),
  ],
};
