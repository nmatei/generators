const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = env => {
  return {
    mode: "development",
    entry: ["./src/demo/index.js"],
    devtool: "inline-source-map",
    devServer: {
      host: "0.0.0.0",
      port: 5500,
      static: ["src"],
      watchFiles: ["src/**/*.*"]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/demo/index.html"
      })
    ],
    module: {
      rules: [
        {
          test: /\.(jpg|png|svg)$/,
          type: "asset/inline"
        },
        {
          test: /\.html$/i,
          loader: "html-loader"
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"]
        }
      ]
    },
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: ""
    }
  };
};
