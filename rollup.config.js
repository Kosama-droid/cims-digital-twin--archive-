import resolve from '@rollup/plugin-node-resolve'

export default [
{
  input: "src/mapbox-viewer.js",
  output: [
    {
    format: "esm",
    file: "./dist/map-bundle.js"
    }
  ],
  plugins: [
    resolve(),
  ],
},
// {
//   input: "src/bim-viewer-wiv.js",
//   output: [
//     {
//     format: "esm",
//     file: "./dist/bim-viewer-wiv-bundle.js"
//     }
//   ],
//   plugins: [
//     resolve(),
//   ],
// },
]
