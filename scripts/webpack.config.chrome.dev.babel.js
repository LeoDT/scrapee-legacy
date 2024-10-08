import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import CopyPlugin from 'copy-webpack-plugin';

import baseConfig from './webpack.config.base';

export default merge.smart(Object.assign({}, baseConfig, { externals: ['styled-components'] }), {
  devtool: 'inline-source-map',

  mode: 'development',

  target: 'web',

  entry: {
    background: path.resolve(__dirname, '..', 'src', 'extension-chrome', 'background.ts'),
    content: path.resolve(__dirname, '..', 'src', 'extension-chrome', 'content.ts')
  },

  output: {
    path: path.resolve(__dirname, '..', 'dist', 'extension-chrome'),
    filename: '[name].js',
    libraryTarget: 'var'
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
    ])
  ],

  node: {
    __dirname: false,
    __filename: false
  },

  watch: true,
  watchOptions: {
    ignored: /node_modules/
  }
});
