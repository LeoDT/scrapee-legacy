import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';

import HTMLWebpackPlugin from 'html-webpack-plugin';

import baseConfig from './webpack.config.base';

const port = process.env.PORT || 1234;
const publicPath = `http://localhost:${port}/`;

export default merge.smart(baseConfig, {
  devtool: 'inline-source-map',

  mode: 'development',

  target: 'electron-renderer',

  entry: {
    renderer: ['react-hot-loader/patch', require.resolve('../src/desktop-app/renderer.tsx')]
  },

  output: {
    publicPath: `http://localhost:${port}/`,
    path: path.resolve(__dirname, '..', 'dist', 'desktop-app'),
    filename: '[name].[hash].js'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),

    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true
    }),

    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, '..', 'src', 'desktop-app', 'index.html')
    })
  ],

  node: {
    __dirname: false,
    __filename: false
  },

  devServer: {
    port,
    publicPath,
    compress: true,
    stats: 'errors-only',
    inline: true,
    noInfo: true,
    lazy: false,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    watchOptions: {
      ignored: /node_modules/
    },
    historyApiFallback: true
  }
});
