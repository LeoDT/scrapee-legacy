import path from 'path';
import webpack from 'webpack';
import { dependencies as externals } from '../package.json';

export default {
  externals: [...Object.keys(externals || {})],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.string\.css$/,
        use: ['to-string-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'postcss-loader']
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: ['svg-react-loader', 'svgo-loader']
      }
    ]
  },

  output: {
    path: path.join(__dirname, '..', 'dist', 'desktop-app'),
    libraryTarget: 'commonjs2'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      shared: path.resolve(__dirname, '..', 'src', 'shared')
    }
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    }),

    new webpack.NamedModulesPlugin()
  ]
};
