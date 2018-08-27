const HtmlWebPackPlugin = require("html-webpack-plugin");
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
          test: /\.css$/,
          use: [ 'style-loader', 'css-loader' ]
      },
    {
        test: /\.(png|jpeg|ttf|jpg)$/,
        use: [
            {
                loader: 'file-loader', options: {
                limit:8192
            }
            }
        ]
    }
    ]
  },
    devServer: {
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebPackPlugin({
          template: "./src/index.html",
          filename: "./index.html"
        })
    ]
};
