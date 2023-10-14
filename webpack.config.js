const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("node:path");

const rulesForJss = {
  test: /\.js$/,
  use: {
    loader: "babel-loader",
    //Babel config
    options: {
      presets: ["@babel/preset-env"],
    },
  },
};

const rulesForCss = {
  test: /\.css$/,
  use: ["style-loader", "css-loader"],
};

const rules = [rulesForJss, rulesForCss];

module.exports = (env, argv) => {
  const { mode } = argv;
  const isProduction = mode === "production";
  return {
    output: {
      filename: isProduction ? "bundle[contenthash].js" : "bundle.js",
      clean: true,
      path: path.resolve(__dirname, "bundle"),
    },
    // Loaders
    // Tools that help webpack translate to js during or before the
    // bundle the code. Preprocessor.
    module: {
      rules,
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "bundle.html",
        template: "./src/index.html",
        title: "Webpack App",
      }),
    ],
  };
};
