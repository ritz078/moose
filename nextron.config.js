const webpack = require("webpack");
const req = require("require-yml");
const path = require("path");

const config = req("./config.yml");
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
          OMDB_API: `"${config.OMDB_API}"`,
        }),
      ],
    }),
};
