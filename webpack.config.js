const path = require("path");
const MODE = "development";

const enabledSourceMap = (MODE === "development");
const nodeExternals = require('webpack-node-externals');

module.exports = {
    target: "node",
    externals:[nodeExternals()],
    mode: MODE,
    entry:path.join(__dirname,"./js/main.js"),
    output:{
            path:path.join(__dirname,"/js"),
            filename:"dist.js"
    },
    module:{
        rules:[{
            test: /\.js$/,
            use:[
                    {
                        loader:"babel-loader",
                        options:{
                            presets:[
                                "@babel/preset-env",
                            ]
                        }
                    }
            ]
        },
        {
         test: /\.css|.scss/,
         use:[
             "style-loader",
             {
                 loader:"css-loader",
                 options:{
                     url:false,
                     sourceMap:enabledSourceMap,
                     importLoaders:2
                 },
             },{
                loader:"sass-loader",
                 options:{
                     sourceMap:enabledSourceMap,
                 }
             }
         ]    
        }]
    }
};