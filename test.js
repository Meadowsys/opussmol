// @ts-check
"use strict";

const execa = require("execa");
const name = "testfile";
const cmd = `opusenc --vbr --bitrate ${200} "${name}.flac" "${name}.opus"`;

const convert_le_opus = (br, namier = name) => execa(`opusenc --vbr --bitrate ${br} "${namier}.flac" "${namier}_${br}.opus"`, {
   stdio: "inherit",
   extendEnv: false,
   env: process.env,
   cwd: process.cwd()
});

convert_le_opus(20)
   .then(() => convert_le_opus(40))
   .then(() => convert_le_opus(50))
   .then(() => convert_le_opus(75))
   .then(() => convert_le_opus(100))
   .then(() => convert_le_opus(125))
   .then(() => convert_le_opus(150))
   .then(() => convert_le_opus(175))
   .then(() => convert_le_opus(200))
