import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import CopyPlugin from 'copy-webpack-plugin';
import WebpackShellPlugin from 'webpack-shell-plugin';

import { dependencies as externals } from '../package.json';

import baseConfig from './webpack.config.base';

export default merge.smart(baseConfig, {
  externals: [...Object.keys(externals || {})],

  devtool: 'none',

  mode: process.env.NODE_ENV,

  target: 'node',

  entry: {
    nativeMessage: path.resolve(__dirname, '..', 'src', 'extension-chrome', 'nativeMessage.ts')
  },

  output: {
    path: path.resolve(__dirname, '..', 'dist', 'extension-chrome'),
    filename: '[name].js'
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.LoaderOptionsPlugin({
      debug: true
    }),

    new CopyPlugin([
      {
        from: path.resolve(__dirname, '..', 'src', 'extension-chrome', 'manifest.json'),
        to: path.resolve(__dirname, '..', 'dist', 'extension-chrome')
      },
      {
        from: path.resolve(
          __dirname,
          '..',
          'src',
          'extension-chrome',
          'nativeMessageManifest.json'
        ),
        to: path.resolve(__dirname, '..', 'dist', 'extension-chrome')
      }
    ]),

    new webpack.BannerPlugin({
      banner: '#!/Users/LeoDT/.nvm/versions/node/v12.13.1/bin/node',
      raw: true
    }),

    new WebpackShellPlugin({
      onBuildEnd: ['chmod +x dist/extension-chrome/nativeMessage.js']
    })
  ],

  watch: true,
  watchOptions: {
    ignored: /node_modules/
  }
});
