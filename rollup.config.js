import resolve from '@rollup/plugin-node-resolve'

export default {
  input: "./src/model-viewer.js",
  output: [
    {
    format: "esm",
    file: "./src/bundle.js"
    }
  ],
  plugins: [
    resolve(),
  ],
};
