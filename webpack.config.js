const path = require("path");
const { BannerPlugin: bannerer } = require("webpack");
const fs = require("fs");

let LICENSE = fs.readFileSync(path.resolve(__dirname, "./LICENSE")).toString();
//LICENSE =
//`
///*******************************************************************************
//
//&{LICENSE}
//
//*******************************************************************************/
//`;

module.exports = (env, argv) => {
   const config = {
      mode: "production",
      entry: "./src/cli.ts",
      target: "node",
      module: {
         rules: [{
            test: /\.tsx?$/,
            use: [{
               loader: "ts-loader"
            }],
            exclude: /node_modules/
         }]
      },
      resolve: {
         extensions: [".ts", ".js"]
      },
      plugins: [
         new bannerer(LICENSE),
         new bannerer({ banner: `#!/usr/bin/env node`, raw: true })
      ],
      output: {
         filename: "clibundle.js",
         path: path.resolve(__dirname, "build")
      }
   };
   return config;
};
