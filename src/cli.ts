#!/usr/bin/env node

import { go, goalsize } from "."
import yargs from "yargs";
import { bgWhiteBright, red, green, reset } from "chalk";

yargs
   .scriptName("opussmol")
   .usage("$0 <cmd> [args]")
   .command("convert", "try to do the conversion", yargs => {
      yargs.positional("filename", {
         type: "string",
         description: "the filename of the file to attempt conversion on"
      })
   }, argv => {
      if (typeof argv.filename !== "string") throw "YARGS IS BAD";
      let bitrate = 0;
      go(argv.filename, { target: goalsize }, br => {
         console.log(green(`now trying bitrate of ${br}...`) + reset(" "));
         bitrate = br;
      }, size => {
            console.log(green(`bitrate of ${bitrate} resulted in size of ${size}\n\n=====================================================\n=====================================================`) + reset(" \n"));
      }).then(br => {
         console.log(bgWhiteBright(green(`the bitrate is ${br}!`)) + reset(" "));
      }).catch(h => {
         console.error("WEFHPEWOAIFCWAINPJCWENJICWANJICAWNJPIAWCCJAWE");
         console.error(h);
      });
   })
   .help()
   .argv
