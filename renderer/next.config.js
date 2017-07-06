/* eslint-disable no-param-reassign */
const BabiliPlugin = require('babili-webpack-plugin');

module.exports = {
  webpack: (config, { dev }) => {
    config.target = 'electron-renderer';

    const loaders = [
      {
        test: /\.(css|scss|less)/,
        loader: 'emit-file-loader',
        options: {
          name: 'dist/[path][name].[ext]',
        },
      },
      {
        test: /\.(less)$/,
        use: ['babel-loader', 'raw-loader', 'postcss-loader', 'less-loader'],
      },
      {
        test: /\.(css)$/,
        use: ['babel-loader', 'raw-loader', 'css-loader', 'postcss-loader'],
      },
    ];

    config.module.rules.push(...loaders);

    config.plugins = config.plugins.filter(plugin => plugin.constructor.name !== 'UglifyJsPlugin');

    config.resolve.alias = {
      Long: 'long',
      ByteBuffer: 'bytebuffer',
    };

    if (!dev) {
      config.plugins.push(new BabiliPlugin());
    }

    return config;
  },

  exportPathMap: () =>
    // export our pages as HTML for production usage
    ({
      '/': { page: '/' },
      '/download': { page: '/download' },
    }),
  // set the prefix as `./` instead of `/`, this is because when you export your pages
  // Next.js will try to import the JS files as `/` instead of the full path
  assetPrefix: './',
};
