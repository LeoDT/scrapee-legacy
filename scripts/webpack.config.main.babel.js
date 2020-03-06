import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';

import baseConfig from './webpack.config.base';

export default merge.smart(baseConfig, {
  devtool: 'none',

  mode: process.env.NODE_ENV,

  target: 'electron-main',

  entry: './src/desktop-app/main.ts',

  output: {
    path: path.resolve(__dirname, '..', 'dist', 'desktop-app'),
    filename: 'main.js'
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV
    })
  ],

  node: {
    __dirname: false,
    __filename: false
  }
});
