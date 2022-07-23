import resolve from '@rollup/plugin-node-resolve'

export default [
{
  input: "src/ifc-mapbox-viewer.js",
  output: [
    {
    format: "esm",
    file: "./dist/bundle.js"
    }
  ],
  plugins: [
    resolve(),
  ],
},
{
  input: "src/bim-viewer-wiv.js",
  output: [
    {
    format: "esm",
    file: "./dist/bim-viewer-wiv-bundle.js"
    }
  ],
  plugins: [
    resolve(),
  ],
},
{
  input: "src/bim-viewer-wit.js",
  output: [
    {
    format: "esm",
    file: "./dist/bim-viewer-wit-bundle.js"
    }
  ],
  plugins: [
    resolve(),
  ],
},
]
