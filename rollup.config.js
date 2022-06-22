'use strict'
const commonjs = require('@rollup/plugin-commonjs');
const nodePolyfills = require('rollup-plugin-polyfill-node');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const nodeGlobal = require('rollup-plugin-node-globals');

module.exports = {
  input: 'mocha.entry.js',
  context: 'globalThis',
  output: {
    file: 'mocha.js',
    name: 'mocha',
    format: 'umd'
  },
  plugins: [
    commonjs(),
    nodeGlobal(),
    nodePolyfills(),
    nodeResolve({ browser: true, preferBuiltins: true }),
  ]
};
