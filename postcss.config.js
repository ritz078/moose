module.exports = {
  plugins: [
    require('postcss-easy-import')({ prefix: '_' }),
    require('postcss-url')({ url: 'inline' }),
  ],
};
