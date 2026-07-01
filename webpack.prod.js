const path = require("path");

const sharedRules = [
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
];

const sharedOutput = {
  chunkFilename: "[name].[chunkhash:8].js",
  path: path.resolve(__dirname, "docs"),
  publicPath: "",
  environment: {
    arrowFunction: false
  }
};

module.exports = env => [
  {
    mode: "production",
    entry: ["./src/index.js"],
    devtool: false,
    module: { rules: sharedRules },
    output: {
      ...sharedOutput,
      library: { name: "CircleSlices", type: "umd" },
      globalObject: "this",
      filename: "circle-slices.js"
    },
    target: ["web", "es5"]
  },
  {
    mode: "production",
    entry: ["./src/virtue-ring.js"],
    devtool: false,
    module: { rules: sharedRules },
    output: {
      ...sharedOutput,
      library: { name: "VirtueRing", type: "umd" },
      globalObject: "this",
      filename: "virtue-ring.js"
    },
    target: ["web", "es5"]
  }
];
