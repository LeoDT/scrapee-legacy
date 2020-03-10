import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';

import baseConfig from './webpack.config.base';

export default merge.smart(Object.assign({}, baseConfig, { externals: [] }), {
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

    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
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
