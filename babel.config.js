module.exports = {
  presets: [
    require('@babel/preset-env'),
    require('@babel/preset-typescript'),
    require('@babel/preset-react'),
  ],
  plugins: [
    require('react-hot-loader/babel'),
    [require('@babel/plugin-proposal-class-properties'), { loose: true }],
    require('@babel/plugin-proposal-optional-chaining'),
    require('@babel/plugin-proposal-nullish-coalescing-operator'),
  ],
};
