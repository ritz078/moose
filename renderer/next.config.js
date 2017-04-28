/* eslint-disable no-param-reassign */
const BabiliPlugin = require('babili-webpack-plugin');

module.exports = {
  webpack: (config, { dev }) => {
    config.target = 'electron-renderer';

    config.module.rules.push(
      {
        test: /\.(css|scss|less)/,
        loader: 'emit-file-loader',
        options: {
          name: 'dist/[path][name].[ext]'
        }
      },
      {
        test: /\.(less)$/,
        use: ['babel-loader', 'raw-loader', 'postcss-loader', 'less-loader']
      },
      {
        test: /\.(css)$/,
        use: ['babel-loader', 'raw-loader', 'css-loader', 'postcss-loader']
      }
    );

    config.plugins = config.plugins.filter(plugin => plugin.constructor.name !== 'UglifyJsPlugin');

    config.resolve.alias = {
      Long: 'long',
      ByteBuffer: 'bytebuffer'
    };

    if (!dev) {
      config.plugins.push(new BabiliPlugin());
    }

    return config;
  }
};
