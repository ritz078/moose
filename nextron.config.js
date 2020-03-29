const webpack = require("webpack");
const req = require("require-yml");

const config = req("./config.yml");

module.exports = {
  webpack: (defaultConfig, env) =>
    Object.assign(defaultConfig, {
      entry: {
        background: "./main/background.ts",
      },
      plugins: [
        ...defaultConfig.plugins,
        new webpack.DefinePlugin({
          OMDB_API: `"${config.OMDB_API}"`,
        }),
      ],
    }),
};
