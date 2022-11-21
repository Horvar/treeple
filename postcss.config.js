var autoprefixer = require('autoprefixer');

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
};