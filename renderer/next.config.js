const webpack = require("webpack");
const req = require("require-yml");
const _config = req("./config.yml");

module.exports = {
  webpack: (config, { isServer, dev }) => {
    config.target = "electron-renderer";

    config.plugins.push(
      new webpack.DefinePlugin({
        BROWSER: !isServer,
        FETCH_SUBTITLES: _config.FETCH_SUBTITLES,
        DEV: dev,
      })
    );

    return config;
  },

  experimental: {
    jsconfigPaths: true,
  },
};
