const webpack = require("webpack");

module.exports = {
  webpack: (config, { isServer }) => {
    config.target = "electron-renderer";
    config.node = {
      fs: "empty",
    };

    config.plugins.push(
      new webpack.DefinePlugin({
        BROWSER: !isServer,
      })
    );

    return config;
  },

  experimental: {
    jsconfigPaths: true,
  },
};
