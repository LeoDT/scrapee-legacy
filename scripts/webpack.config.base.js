import path from 'path';
import webpack from 'webpack';

export default {
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
        test: /\.css$/,
        oneOf: [
          {
            resourceQuery: /string/,
            use: ['to-string-loader', 'css-loader', 'postcss-loader']
          },
          {
            use: ['style-loader', 'css-loader', 'postcss-loader']
          }
        ]
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
