const webpack = require("webpack");
require("dotenv").config();

module.exports = {
  webpack: (config, { isServer, dev }) => {
    config.target = "electron-renderer";

    config.plugins.push(
      new webpack.DefinePlugin({
        BROWSER: !isServer,
        FETCH_SUBTITLES: process.env.FETCH_SUBTITLES,
        DEV: dev,
      })
    );

    return config;
  },

  experimental: {
    jsconfigPaths: true,
  },
};
