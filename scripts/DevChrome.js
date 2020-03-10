/* eslint @typescript-eslint/no-empty-function: 0 */

require('./BabelRegister');

const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.chrome.dev.babel').default;

const dist = path.resolve(__dirname, '../', 'dist/extension-chrome/');
const filesToCopy = [
  'src/extension-chrome/manifest.json',
  'src/extension-chrome/nativeMessageManifest.json'
];

fs.ensureDirSync(dist);

filesToCopy.forEach(f => {
  const file = path.resolve(__dirname, '../', f);
  fs.ensureSymlinkSync(file, path.resolve(dist, path.basename(f)));
});

webpack(webpackConfig).watch(
  {
    aggregateTimeout: 300,
    poll: undefined
  },
  () => {}
);
