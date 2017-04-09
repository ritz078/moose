/* eslint-disable no-param-reassign */
module.exports = {
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.(css|scss|less)/,
        loader: 'emit-file-loader',
        options: {
          name: 'dist/[path][name].[ext]',
        },
      }, {
        test: /\.(less)$/,
        use: ['babel-loader', 'raw-loader', 'less-loader'],
      }, {
        test: /\.(css)$/,
        use: ['babel-loader', 'raw-loader', 'css-loader'],
      });

    return config;
  },
};
