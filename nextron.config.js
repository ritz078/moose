const webpack = require("webpack");
require("dotenv").config();
const path = require("path");

const cwd = process.cwd();

module.exports = {
  webpack: (defaultConfig) =>
    Object.assign(defaultConfig, {
      entry: {
        background: "./main/background.ts",
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: {
              loader: "babel-loader",
              options: {
                cacheDirectory: true,
                presets: ["next/babel", "@babel/preset-typescript"],
              },
            },
            exclude: [/node_modules/, path.join(cwd, "renderer")],
          },
        ],
      },
      plugins: [
        ...defaultConfig.plugins,
        new webpack.DefinePlugin({
          TMDB_API: `"${process.env.TMDB_API}"`,
          SUBTITLES: `"${process.env.SUBTITLES}"`,
          UA_ID: `"${process.env.UA_ID}"`,
        }),
      ],
    }),
};
