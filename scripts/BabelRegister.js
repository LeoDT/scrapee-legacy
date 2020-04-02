const path = require('path');

require('@babel/register')({
  extensions: ['.es6', '.es', '.jsx', '.js', '.mjs', '.ts', '.tsx', '.d.ts'],
  cwd: path.join(__dirname, '..'),
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: [path.resolve(__dirname, '../', 'src')],
        alias: {
          shared: './src/shared',
          core: './src/core'
        }
      }
    ]
  ]
});
