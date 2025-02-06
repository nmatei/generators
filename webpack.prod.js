const path = require("path");

module.exports = env => {
  return {
    mode: "production",
    entry: ["./src/index.js"],
    devtool: false,
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        },
        {
          test: /\.(jpg|png|svg)$/,
          type: "asset/inline"
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"]
        }
      ]
    },
    output: {
      library: {
        name: "CircleSlices",
        type: "umd" // Universal Module Definition
      },
      globalObject: "this",
      filename: "circle-slices.js",
      chunkFilename: "[name].[chunkhash:8].js",
      path: path.resolve(__dirname, "docs"),
      publicPath: "",
      environment: {
        arrowFunction: false
      }
    },
    target: ["web", "es5"]
  };
};
