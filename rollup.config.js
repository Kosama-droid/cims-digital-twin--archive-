import resolve from '@rollup/plugin-node-resolve'

export default [
{
  input: "app/mapbox-viewer.js",
  // input: "app/maplibre-viewer.js",
  output: [
    {
    format: "esm",
    file: "dist/mapbox-bundle.js"
    // file: "dist/maplibre-bundle.js"
    }
  ],
  plugins: [
    resolve(),
  ],
},
// {
//   input: "app/bim-viewer-wiv.js",
//   output: [
//     {
//     format: "esm",
//     file: "dist/bim-viewer-wiv-bundle.js"
//     }
//   ],
//   plugins: [
//     resolve(),
//   ],
// },
]