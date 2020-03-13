const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = webpackConfig => {
  return merge.smart(webpackConfig, {
    externals: ['styled-components'],
    module: {
      rules: [
        {
          test: /\.svg$/,
          exclude: /node_modules/,
          use: ['svg-react-loader', 'svgo-loader']
        }
      ]
    },
    resolve: {
      alias: {
        shared: path.resolve(__dirname, '..', 'src', 'shared')
      }
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        COSMOS: '1'
      })
    ]
  });
};
