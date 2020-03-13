import path from 'path';
import merge from 'webpack-merge';
import { dependencies as externals } from '../package.json';

import baseConfig from './webpack.config.base';

export default merge.smart(baseConfig, {
  externals: [...Object.keys(externals || {})],

  devtool: 'none',

  mode: process.env.NODE_ENV,

  target: 'electron-main',

  entry: './src/desktop-app/main.ts',

  output: {
    path: path.resolve(__dirname, '..', 'dist', 'desktop-app'),
    filename: 'main.js'
  },

  node: {
    __dirname: false,
    __filename: false
  }
});
