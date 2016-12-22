'use strict';
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const glob = require("glob")

const debug = process.argv.indexOf('-d') !== -1

let plugins = [
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: debug,
        },
        output: {
            comments: false,
        },
    })
  ]

let globmaths =  glob.sync("./src/pages/*.js",{
  nodir:true,
})

let entry = globmaths.reduce((obj,file)=>{
  let filename = path.basename(file).split(".")[0]
  obj[filename] = ["babel-polyfill",file]
  return obj
},{})

console.log(entry)

module.exports = {
    entry:entry,
    output: {
        path: `./lib`,
        filename: "[name].js",
    },
    module: {
      loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      ]
    },
    plugins: plugins,
};
