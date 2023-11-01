const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  publicPath: "./",
  configureWebpack: {
    devtool: "source-map",
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            // 删除console debugger 删除警告
            compress: {
              drop_console: true, //console
              drop_debugger: false,
              pure_funcs: ['console.log'] //移除console
            }
          }
        })
      ]
    },
  },
  // css相关配置 配置高于chainWebpack中关于css loader的配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // css预设器配置项
    loaderOptions: {
      sass: {
        prependData: `
         @import "@/styles/config.scss";
         @import "@/styles/myselfSet.scss";
         `,
      },
    },
  },
  // devServer: {
  //   port: 8080,
  //   open: true,
  //   host: "localhost",
  //   proxy: {
  //     "/socket": {
  //       target: "http://localhost:10001",
  //       pathRewrite: {
  //         "^/socket": "",
  //       },
  //       ws: true,
  //       changeOrigin: true,
  //     },
  //   },
  // },
};
